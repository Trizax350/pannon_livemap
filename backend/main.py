from datetime import date, datetime
from platform import machine
from re import M
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal
from sqlalchemy.sql import func, literal
from sqlalchemy import desc, and_
import models
from fastapi.middleware.cors import CORSMiddleware

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

class Tag(BaseModel):
    Tag_ID: int
    Name: str

    class Config:
        orm_mode=True

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

class Position(BaseModel):
    ID: Optional[int]
    Tag_ID: int
    Pos_x: float
    Pos_y: float
    Pos_z: float
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

db = SessionLocal()

#Get all Tag ID

@app.get('/get_all_tag_id', response_model=List[Tag], status_code=200)
def list_all_tag_id():
    tag_id = db.query(models.Tag).order_by(models.Tag.Tag_ID).all()
    return tag_id

#Conn_Tag_Sensor functions

@app.get('/list_all_conn_tag_sensor', response_model=List[Conn_Tag_Sensor], status_code=200)
def list_conn_tag_sensor():
    conn_tag_sensor = db.query(models.Conn_Tag_Sensor).order_by(models.Conn_Tag_Sensor.ID).all()
    return conn_tag_sensor

@app.get('/get_conn_tag_sensor_by_id/{item_id}', response_model=Conn_Tag_Sensor, status_code=status.HTTP_200_OK)
def get_conn_tag_sensor_by_id(item_id: int):
    conn_tag_sensor = db.query(models.Conn_Tag_Sensor).filter(models.Conn_Tag_Sensor.ID == item_id).first()
    return conn_tag_sensor

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

@app.delete('/delete_conn_tag_sensor_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_conn_tag_sensor_item_by_id(item_id: int):
    item_to_delete = db.query(models.Conn_Tag_Sensor).filter(models.Conn_Tag_Sensor.ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Tag ID + Sensor azonosító nem található.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

##Machines functions

@app.get('/list_all_machines', response_model=List[Machines], status_code=200)
def list_machines():
    machines = db.query(models.Machines).order_by(models.Machines.ID).all()
    return machines

@app.get('/get_machine_by_id/{item_id}', response_model=Machines, status_code=status.HTTP_200_OK)
def get_machine_item_by_id(item_id: int):
    machine = db.query(models.Machines).filter(models.Machines.ID == item_id).first()
    return machine

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

@app.delete('/delete_machine_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_machine_item_by_id(item_id: int):
    item_to_delete = db.query(models.Machines).filter(models.Machines.ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Gép azonosító nem található.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

#Tag-ek utolsó adatainak lekérése:
@app.get('/list_all_tag_last_data', status_code=200)
def list_all_last_positions():
    max_pos_ids_by_tag_id = db.query(func.max(models.Position.ID).label('Pos_Max_ID')).group_by(models.Position.Tag_ID).subquery('max_pos_ids_by_tag_id')
    max_data_ids_by_tag_id = db.query(func.max(models.Data.ID).label('Data_Max_ID')).group_by(models.Data.Tag_ID).subquery('max_data_ids_by_tag_id')
    max_machine_ids_by_tag_id = db.query(func.max(models.Machines.ID).label('Machine_Max_ID')).group_by(models.Machines.Tag_ID).subquery('max_machine_ids_by_tag_id')

    get_datas = db.query(
        models.Tag, 
        models.Position, 
        models.Data,
        models.Machines).join(models.Position).join(models.Data).join(models.Machines).filter(and_(
            models.Position.ID == max_pos_ids_by_tag_id.c.Pos_Max_ID,
            models.Data.ID == max_data_ids_by_tag_id.c.Data_Max_ID,
            models.Machines.ID == max_machine_ids_by_tag_id.c.Machine_Max_ID)).all()
        
    return get_datas