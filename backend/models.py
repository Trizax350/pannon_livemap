from datetime import datetime
from numbers import Real
from sqlalchemy import Date,DateTime,ForeignKey,String,Integer,Column,Float
from database import Base
from sqlalchemy.sql import func

#PLivemap tables ---
class Conn_Tag_Sensor(Base):
    __tablename__='conn_tag_sensor'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Tag_ID = Column(Integer, nullable=False)
    Sensor = Column(String(255))

class Data(Base):
    __tablename__='data'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Tag_ID = Column(Integer, nullable=False)
    Vib = Column(Float, nullable=False)
    Temp = Column(Float, nullable=False)
    Steam = Column(Float, nullable=False)
    Noise = Column(Float, nullable=False)
    Time = Column(DateTime(), default=datetime.now)
    HRV = Column(Integer, nullable=False)

class Data_archiv(Base):
    __tablename__='data_archiv'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Tag_ID = Column(Integer, nullable=False)
    Vib = Column(Float, nullable=False)
    Temp = Column(Float, nullable=False)
    Steam = Column(Float, nullable=False)
    Noise = Column(Float, nullable=False)
    Time = Column(DateTime(), default=datetime.now)
    HRV = Column(Integer, nullable=False)

class Machines(Base):
    __tablename__='machines'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Tag_ID = Column(Integer, nullable=False)
    Cycle_time = Column(Float, nullable=False)
    Produced = Column(Integer, nullable=False)
    Act_product = Column(Integer, nullable=False)
    Status = Column(Integer, nullable=False)
    Andon = Column(Integer, nullable=False)
    Time = Column(DateTime(), default=datetime.now)

class Product(Base):
    __tablename__='product'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Tag_ID = Column(Integer, nullable=False)
    RFID_ID = Column(String(255), nullable=False)
    Product_name = Column(String(255), nullable=False)
    Product_type = Column(String(255), nullable=False)
    Delivery_time = Column(DateTime(), default=datetime.now)
    Produced_time = Column(DateTime(), default=datetime.now)
    Asset = Column(String(255), nullable=False)

#Ponton tables ---
class Tag_loc_processed(Base):
    __tablename__='tag_loc_processed'
    id = Column(Integer, primary_key=True, autoincrement=True)
    tag_id = Column(Integer, nullable=False)
    ts = Column(DateTime(), default=datetime.now)
    pos = Column(String(255), nullable=False)
    refreshed_at = Column(DateTime(), default=datetime.now)
    stdev = Column(Integer, nullable=False)

class Zones(Base):
    __tablename__='zones'
    id = Column(Integer, primary_key=True, autoincrement=True)
    desc = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    shape = Column(String(255), nullable=False)
    active_from = Column(DateTime())
    active_to = Column(DateTime(), nullable=True)
    layout_id = Column(Integer, nullable=False)
    color = Column(String(255), nullable=True)
    layer = Column(Integer, nullable=False)
    type_id = Column(Integer, nullable=True)
    forbidden = Column(String(255), nullable=False)
    start_z = Column(Float, nullable=False)
    end_z = Column(Float, nullable=False)

class Asset_track(Base):
    __tablename__='asset_track'
    id = Column(Integer, primary_key=True, autoincrement=True)
    asset = Column(String(255), nullable=False)
    tag_id = Column(Integer, nullable=True)
    zone = Column(String(255), nullable=False)
    entered_at = Column(DateTime())

class Tag_data(Base):
    __tablename__='tag_data'
    id = Column(Integer, primary_key=True, autoincrement=True)
    tag_id = Column(Integer, nullable=True)
    ts = Column(DateTime())
    moving = Column(String(255), nullable=False)
    battery = Column(Integer, nullable=False)
    pressure = Column(Integer, nullable=False)
    temperature = Column(Integer, nullable=False)