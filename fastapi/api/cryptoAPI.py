from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, APIRouter
from sqlalchemy.orm import Session
import sys
sys.path.append('../model/')
from model import models, schemas
sys.path.append('../core/')
from core.crypto import crud, crawler
from model.database import get_db_session

cryptoAPIRouter = APIRouter(prefix="/crypto",tags=["crypto"])

@cryptoAPIRouter.post("/trade", response_model=schemas.CreateCryptoTrade)
def create_CryptoTrade(CryptoTrade: schemas.CreateCryptoTrade, transaction: Session = Depends(get_db_session)):
    try:
        print('request:',CryptoTrade)
        return crud.create_CryptoTrade(transaction=transaction, CryptoTrade=CryptoTrade)
    except Exception as e:
        print('=======create crypto record fail=========:',e)
        raise HTTPException(status_code = 500, detail =  "server error")

#TODO
@cryptoAPIRouter.delete("/trade")
def delete_CryptoTrade(trade_hash: str, db: Session = Depends(get_db_session)):
    try:
        return crud.delete_CryptoTrade(db=db, trade_hash=trade_hash)
    except Exception as e:
        print('delete crypto record fail:', e)
        raise HTTPException(status_code = 500, detail =  "server error")

@cryptoAPIRouter.get("/trades", response_model=List[schemas.GetCryptoTrade])
def get_CryptoTrade(db: Session = Depends(get_db_session)):
    try:
        return crud.get_CryptoTrades(db=db, limit=100)
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 404, detail =  "source not found")        

@cryptoAPIRouter.get('/costs', response_model=dict)
def get_all_costs(db: Session = Depends(get_db_session)):
    try:
        return crud.get_all_crypto_costs(db=db)
    except Exception as e:
        print(e)    
# @cryptoAPIRouter.get("/trades/cost")
# def get_Crypto_group_by_target(target: Optional[str], db: Session = Depends(get_db_session)):
#     try:
#         if target:
#             return crud.get_CryproTrade_cost_group_by_target(db=db, _target=target)
#         else:
#             return crud.get_all_CryproTrade_cost(db=db)
#     except Exception as e:
#         print(e)   
#         raise HTTPException(status_code = 404, detail =  "source not found")        
 

#TODO
@cryptoAPIRouter.get("/current-price", response_model=dict)
def get_cryptoPrice():
    try:
        return crawler.CoinMarketAPI.request_price()
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 404, detail =  "source not found")