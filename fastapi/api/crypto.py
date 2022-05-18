from typing import List

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
import sys
sys.path.append('../model/')
from model import models, schemas
sys.path.append('../core/')
from core.crypto import crud, crawler
from model.database import sessionLocal, engine, get_db_session

from fastapi import APIRouter

cryptoRouter = APIRouter(prefix="/crypto",tags=["crypto"])


@cryptoRouter.post("/trade", response_model=schemas.CreateCryptoTrade)
def create_CryptoTrade(CryptoTrade: schemas.CreateCryptoTrade, db: Session = Depends(get_db_session)):
    try:
        return crud.create_CryptoTrade(db=db, user=CryptoTrade)
    except Exception as e:
        print('create crypto record fail:',e)
        raise HTTPException(status_code = 500, detail =  "server error")

@cryptoRouter.get("/trades", response_model=List[schemas.CryptoTrade])
def get_CryptoTrade(db: Session = Depends(get_db_session)):
    try:
        return crud.get_CryptoTrades(db=db)
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 404, detail =  "source not found")        

@cryptoRouter.get("/crypto_price", )
def get_cryptoPrice():
    try:
        return crawler.CoinMarketAPI.request_price()
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 404, detail =  "source not found")    