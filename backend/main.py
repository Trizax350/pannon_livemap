from ast import Str
from datetime import date, datetime
from numbers import Real
from platform import machine
from re import M
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal, SessionLocal2
from sqlalchemy.sql import func, literal
from sqlalchemy import desc, and_, text
import models
from fastapi.middleware.cors import CORSMiddleware
from geoalchemy2 import Geometry
from geoalchemy2.functions import GenericFunction

app=FastAPI()

origins = [
    'http://localhost:4200',
    'http://localhost:4250',
    'http://0.0.0.0:4250',
    'http://0.0.0.0:4200',
    'http://10.77.1.14:4250',
    'http://pannon-livemap.eu.ngrok.io',
    'https://pannon-livemap.eu.ngrok.io'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

#PLivemap tables ---
class Conn_Tag_Sensor(BaseModel):
    ID: Optional[int]
    Tag_ID: int
    Sensor: str

    class Config:
        orm_mode=True

class Data(BaseModel):
    ID: Optional[int]
    Tag_ID: int
    Vib: float
    Temp: float
    Steam: float
    Noise: float
    Time: Optional[datetime]

    class Config:
        orm_mode=True

class Data_archiv(BaseModel):
    ID: Optional[int]
    Tag_ID: int
    Vib: float
    Temp: float
    Steam: float
    Noise: float
    Time: Optional[datetime]

    class Config:
        orm_mode=True

class Machines(BaseModel):
    ID: Optional[int]
    Tag_ID: int
    Cycle_time: float
    Produced: int
    Act_product: int
    Status: int
    Andon: int
    Time: Optional[datetime]

    class Config:
        orm_mode=True

class Product(BaseModel):
    ID: Optional[int]
    Tag_ID: int
    RFID_ID: str
    Product_name: str
    Product_type: str
    Delivery_time: datetime
    Produced_time: datetime
    Asset: str

    class Config:
        orm_mode=True

#Ponton tables ---
class Tag_loc_processed(BaseModel):
    id: Optional[int]
    tag_id: int
    ts: datetime
    pos: str
    refreshed_at: datetime
    stdev: int

    class Config:
        orm_mode=True

class Coordinate(BaseModel):
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0

class Zone(BaseModel):
    id: int
    title: str
    shape: List[Coordinate]
    start_z: float
    end_z: float
    forbidden: bool

    class Config:
        orm_mode=True

class Asset_track(BaseModel):
    id: Optional[int]
    asset: str
    tag_id: int
    zone: str
    entered_at: datetime

    class Config:
        orm_mode=True

class Tag_data(BaseModel):
    id: Optional[int]
    tag_id: int
    ts: Optional[datetime]
    moving: Optional[str]
    battery: Optional[int]
    pressure: Optional[int]
    temperature: Optional[int]

    class Config:
        orm_mode=True

db = SessionLocal()
db2 = SessionLocal2()

def create_zone_from_db_record(db_record) -> Zone:
    zone = Zone(
        id=db_record.id,
        title=db_record.title,
        start_z=db_record.start_z,
        end_z=db_record.end_z,
        forbidden=db_record.forbidden,
        shape=[]
    )

    raw_coordinates = db_record.shape.split("((")[1][:-2].split(",")
    raw_coordinates = raw_coordinates[:-1]  # Skipping last polygon
    for raw_coordinate in raw_coordinates:
        if raw_coordinate.count(" ") == 2:
            x, y, z = raw_coordinate.split(" ")
            zone.shape.append(Coordinate(x=float(x), y=float(y), z=float(z)))
        else:
            x, y = raw_coordinate.split(" ")
            zone.shape.append(Coordinate(x=float(x), y=float(y), z=0))

    return zone

#Conn_Tag_Sensor functions
#Select all
@app.get('/list_all_conn_tag_sensor', response_model=List[Conn_Tag_Sensor], status_code=200)
def list_conn_tag_sensor():
    conn_tag_sensor = db.query(models.Conn_Tag_Sensor).order_by(models.Conn_Tag_Sensor.ID).all()
    return conn_tag_sensor

#Select by ID
@app.get('/get_conn_tag_sensor_by_id/{item_id}', response_model=Conn_Tag_Sensor, status_code=status.HTTP_200_OK)
def get_conn_tag_sensor_by_id(item_id: int):
    conn_tag_sensor = db.query(models.Conn_Tag_Sensor).filter(models.Conn_Tag_Sensor.ID == item_id).first()
    return conn_tag_sensor

#Insert
@app.post('/post_conn_tag_sensor', response_model=Conn_Tag_Sensor, status_code=status.HTTP_201_CREATED)
def add_item_to_conn_tag_sensor(conn_tag_sensor: Conn_Tag_Sensor):
    db_conn_tag_sensor = db.query(models.Conn_Tag_Sensor).filter(models.Conn_Tag_Sensor.ID == conn_tag_sensor.ID).first()

    if db_conn_tag_sensor is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez az azonosító már létezik.")

    check_new_conn_tag_sensor = db.query(models.Conn_Tag_Sensor).filter(
        models.Conn_Tag_Sensor.Tag_ID == conn_tag_sensor.Tag_ID,
        models.Conn_Tag_Sensor.Sensor == conn_tag_sensor.Sensor).first()

    if check_new_conn_tag_sensor is not None:
        raise HTTPException(status_code=400, detail="Hiba: Ez a rekord már létezik.")

    new_conn_tag_sensor = models.Conn_Tag_Sensor(
        ID = conn_tag_sensor.ID,
        Tag_ID = conn_tag_sensor.Tag_ID,
        Sensor = conn_tag_sensor.Sensor
    )

    db.add(new_conn_tag_sensor)
    db.commit()

    return new_conn_tag_sensor

#Update
@app.put('/update_conn_tag_sensor_by_id/{item_id}', response_model=Conn_Tag_Sensor, status_code=status.HTTP_200_OK)
def update_conn_tag_sensor_item_by_id(item_id: int, conn_tag_sensor: Conn_Tag_Sensor):
    check_update_conn_tag_sensor = db.query(models.Conn_Tag_Sensor).filter(
        models.Conn_Tag_Sensor.ID != item_id,
        models.Conn_Tag_Sensor.Tag_ID == conn_tag_sensor.Tag_ID,
        models.Conn_Tag_Sensor.Sensor == conn_tag_sensor.Sensor).first()

    if check_update_conn_tag_sensor is not None:
        raise HTTPException(status_code=400, detail="Hiba: Ez a Tag ID + Sensor összerendelés már létezik.")

    item_to_update = db.query(models.Conn_Tag_Sensor).filter(models.Conn_Tag_Sensor.ID == item_id).first()
    item_to_update.Tag_ID = conn_tag_sensor.Tag_ID
    item_to_update.Sensor = conn_tag_sensor.Sensor

    db.commit()
    return item_to_update

#Delete
@app.delete('/delete_conn_tag_sensor_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_conn_tag_sensor_item_by_id(item_id: int):
    item_to_delete = db.query(models.Conn_Tag_Sensor).filter(models.Conn_Tag_Sensor.ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Tag ID + Sensor azonosító nem található.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

##Machines functions
#Select all
@app.get('/list_all_machines', response_model=List[Machines], status_code=200)
def list_machines():
    machines = db.query(models.Machines).order_by(models.Machines.ID).all()
    return machines

#Select by ID
@app.get('/get_machine_by_id/{item_id}', response_model=Machines, status_code=status.HTTP_200_OK)
def get_machine_item_by_id(item_id: int):
    machine = db.query(models.Machines).filter(models.Machines.ID == item_id).first()
    return machine

#Insert
@app.post('/post_machine', response_model=Machines, status_code=status.HTTP_201_CREATED)
def add_item_to_machines(machine: Machines):
    db_machines = db.query(models.Machines).filter(models.Machines.ID == machine.ID).first()

    if db_machines is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez a gép azonosító már létezik.")

    new_machine = models.Machines(
        ID = machine.ID,
        Tag_ID = machine.Tag_ID,
        Cycle_time = machine.Cycle_time,
        Produced = machine.Produced,
        Act_product = machine.Act_product,
        Status = machine.Status,
        Andon = machine.Andon,
        Time = datetime.now()
    )

    db.add(new_machine)
    db.commit()

    return new_machine

#Update
@app.put('/update_machine_by_id/{item_id}', response_model=Machines, status_code=status.HTTP_200_OK)
def update_machine_item_by_id(item_id: int, machine: Machines):
    item_to_update = db.query(models.Machines).filter(models.Machines.ID == item_id).first()
    item_to_update.Tag_ID = machine.Tag_ID
    item_to_update.Cycle_time = machine.Cycle_time
    item_to_update.Produced = machine.Produced
    item_to_update.Act_product = machine.Act_product
    item_to_update.Status = machine.Status
    item_to_update.Andon = machine.Andon
    item_to_update.Time = datetime.now()

    db.commit()
    return item_to_update

#Delete
@app.delete('/delete_machine_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_machine_item_by_id(item_id: int):
    item_to_delete = db.query(models.Machines).filter(models.Machines.ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Gép azonosító nem található.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

#Ponton DB functions:
@app.get('/get_all_tag_id_ponton', response_model=List[Tag_data], status_code=200)
def list_all_tag_id():
    tag_id = db2.query(models.Tag_data.tag_id).group_by(models.Tag_data.tag_id).order_by(models.Tag_data.tag_id).all()
    return tag_id

#Select last tag positions
@app.get('/list_all_tag_last_data_ponton', status_code=200)
def list_all_last_positions_ponton():
    max_pos_ids_by_tag_id = db2.query(func.max(models.Tag_loc_processed.id).label('Pos_Max_ID')).group_by(models.Tag_loc_processed.tag_id).subquery('max_pos_ids_by_tag_id')
    get_datas_ponton = db2.query(models.Tag_loc_processed, func.st_astext(models.Tag_loc_processed.pos).label('geom')).filter(models.Tag_loc_processed.id == max_pos_ids_by_tag_id.c.Pos_Max_ID).all()
    return get_datas_ponton

#Select zones
@app.get('/get_zones_ponton', response_model=List[Zone], status_code=200)
def get_zones_ponton():
    sql = text('SELECT id, title, start_z, end_z, ST_AsText(shape) as shape, forbidden FROM public.zones WHERE active_to IS NULL')
    result = db2.execute(sql).fetchall()
    return [create_zone_from_db_record(record) for record in result]

#Select all tag last data
@app.get('/get_tag_data_ponton', status_code=200)
def get_tag_data_ponton():
    max_pos_ids_by_tag_id = db2.query(func.max(models.Tag_data.id).label('Pos_Max_ID')).group_by(models.Tag_data.tag_id).subquery('max_pos_ids_by_tag_id')
    get_tag_datas_ponton = db2.query(models.Tag_data).filter(models.Tag_data.id == max_pos_ids_by_tag_id.c.Pos_Max_ID).all()
    return get_tag_datas_ponton

#Select all tag last asset track data
@app.get('/get_asset_track_ponton', status_code=200)
def get_asset_track_ponton():
    max_pos_ids_by_tag_id = db2.query(func.max(models.Asset_track.id).label('Pos_Max_ID')).group_by(models.Asset_track.tag_id).subquery('max_pos_ids_by_tag_id')
    get_tag_datas_ponton = db2.query(models.Asset_track).filter(models.Asset_track.id == max_pos_ids_by_tag_id.c.Pos_Max_ID).all()
    return get_tag_datas_ponton