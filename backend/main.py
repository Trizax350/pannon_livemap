from datetime import date, datetime
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