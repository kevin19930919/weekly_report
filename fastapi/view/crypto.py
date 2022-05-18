from typing import List

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
import sys
sys.path.append('../model/')
from model import crud, models, schemas
from model.database import sessionLocal, engine

from fastapi import APIRouter

cryptoRouter = APIRouter(prefix="/crtpto",tags=["crypto"])
# Dependency
def get_db():
    connection = sessionLocal()
    try:
        yield connection
    finally:
        connection.close()


@cryptoRouter.post("/", response_model=schemas.CreateCryptoTrade)
def create_CryptoTrade(CryptoTrade: schemas.CreateCryptoTrade, db: Session = Depends(get_db)):
    try:
        return crud.create_CryptoTrade(db=db, user=CryptoTrade)
    except Exception as e:
        print('create crypto record fail:',e)
        return 'fail'