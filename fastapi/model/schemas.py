# pydantic models,using to filter data for transact with database
from datetime import date
from pydantic import BaseModel
from typing import List
import sys
sys.path.append('./fatapi/model')
from database import hash_func


class Trade(BaseModel):
    date: date
    price: float
    quantity: float
    
    class Config:
        orm_mode = True


class Crypto(BaseModel):
    target: str
    exchange: str
    
    class Config:
        orm_mode = True

class GetCryptoTrade(Crypto):
    trade_hash: str
    trade: Trade
    pass

class CreateCryptoTrade(Crypto, Trade):
    pass

class UpdateCryptoTrade(Crypto, Trade):
    pass

class USStock(BaseModel):
    target: str

    class Config:
        orm_mode = True        

class CreateUSStockTrade(USStock, Trade):
    pass

class UpdateUSStockTrade(USStock, Trade):
    pass

class Alert(BaseModel):
    crypto:str
	direction:bool
	price:float
    
    class Config:
        orm_mode = True