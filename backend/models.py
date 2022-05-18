from datetime import datetime
from sqlalchemy import Date,DateTime,ForeignKey,String,Integer,Column,Float
from database import Base
from sqlalchemy.sql import func

class Tag(Base):
    __tablename__='tag'
    Tag_ID = Column(Integer, primary_key=True, autoincrement=False)
    Name = Column(String(255))

class Data(Base):
    __tablename__='data'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Tag_ID = Column(Integer, ForeignKey('tag.Tag_ID'))
    Vib = Column(Float, nullable=False)
    Temp = Column(Float, nullable=False)
    Steam = Column(Float, nullable=False)
    Noise = Column(Float, nullable=False)
    Time = Column(DateTime(), default=datetime.now)

class Position(Base):
    __tablename__='position'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Tag_ID = Column(Integer, ForeignKey('tag.Tag_ID'))
    Pos_x = Column(Float, nullable=False)
    Pos_y = Column(Float, nullable=False)
    Pos_z = Column(Float, nullable=False)
    Time = Column(DateTime(), default=datetime.now)

class Machines(Base):
    __tablename__='machines'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Tag_ID = Column(Integer, ForeignKey('tag.Tag_ID'))
    Cycle_time = Column(Float, nullable=False)
    Produced = Column(Integer, nullable=False)
    Act_product = Column(Integer, nullable=False)
    Status = Column(Integer, nullable=False)
    Andon = Column(Integer, nullable=False)
    Time = Column(DateTime(), default=datetime.now)