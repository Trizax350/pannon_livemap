from encodings import utf_8
import imp
from click import echo
from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("postgresql://postgres:morgi0213@localhost:5432/pannon_livemap")

Base = declarative_base()

SessionLocal = sessionmaker(bind=engine)