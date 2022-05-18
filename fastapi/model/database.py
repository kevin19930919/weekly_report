#Here is the file that defines database connection using SQLAlchemy

import sqlalchemy
# from pydantic import BaseModel
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import yaml
from contextlib import contextmanager
from datetime import datetime

import base64
import hashlib

# ================ AIDMS configer =====================
with open(r'./fastapi/config/config.yaml', 'r') as file:
    config = yaml.full_load(file)
# ================orm setting==========================
DATABASE_URL = f'sqlite:///{config["db_path"]}'
engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# get sqlalchemy base class
Base = declarative_base()


# Sessionmaker is a factory for initializing new Session objects. 
# Sessionmaker initializes these sessions by requesting a connection from the engine's connection pool and attaching a connection to the new Session object.
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_session():
    db = sessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def hash_func(keyword=None):
    if not keyword :
        keyword = datetime.now().timestamp()
    s = hashlib.sha256()
    s.update(str(keyword).encode('utf-8'))
    hash_code = s.hexdigest()
    return hash_code[:12]





