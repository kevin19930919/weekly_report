from sqlalchemy.orm import Session
from sqlalchemy import func
import sys
sys.path.append('../../model')
from model import models, schemas

#TODO
def get_CryptoTrade(db: Session, _id: int):
    return db.query(models.CryptoTrade).filter(models.CryptoTrade.id == _id).first()

#TODO
def get_CryptoTrade_by_target(db: Session, target: str):
    return db.query(models.CryptoTrade).filter(models.CryptoTrade.target == target)

#TODO
def get_CryptoTrades(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Crypto).offset(skip).limit(limit).all()

def create_CryptoTrade(transaction: Session, CryptoTrade: schemas.CreateCryptoTrade):
    try:
        db_trade = models.Trade(
            price=CryptoTrade.price, 
            quantity=CryptoTrade.quantity,
            total_cost=CryptoTrade.price*CryptoTrade.quantity,
            date=CryptoTrade.date
        )
        transaction.add(db_trade)
        
        db_Crypto = models.Crypto(
            target=CryptoTrade.target,
            exchange=CryptoTrade.exchange,
            trade_hash=db_trade.trade_hash
            )
        transaction.add(db_Crypto)

        transaction.flush()
        transaction.commit()
        transaction.refresh(db_Crypto)
        transaction.refresh(db_trade)
    except Exception as e:
        print('============create peoblem in crud==========',e)
    return CryptoTrade

#TODO
def delete_CryptoTrade(db: Session, trade_hash: str):
    db_CryptoTrade = db.query(models.Crypto).filter(models.Crypto.trade_hash == trade_hash).first()
    if db_CryptoTrade:
        db.delete(db_CryptoTrade)
        db.commit()
        db.flush()
    return db_CryptoTrade    

# def get_CryproTrade_cost_group_by_target(db: Session, _target: str):
#     print(f"target symbol:{_target}")
#     results = db.query(models.Crypto).filter(models.Crypto.target==_target).all()
#     print('length:',len(results))
#     total_cost = 0
#     column = getattr(, )

#     for result in results:
#         total_cost += result.trade.price*result.trade.quantity)
        

def get_all_crypto_costs(db: Session):
    return db.query(models.Crypto.target, func.sum(models.Trade.total_cost)).join(models.Trade).group_by(models.Crypto.target).all()

def create_Alert(db: Session, AlertInfo: schemas.Alert):
    try:
        db_alert = models.Alert(
            price=AlertInfo.price, 
            crypto=AlertInfo.crypto,
            direction=AlertInfo.direction,
        )
        transaction.add(db_alert)

        transaction.flush()
        transaction.commit()
        transaction.refresh(db_alert)
    except Exception as e:
        print('============create peoblem in crud==========',e)
    return AlertInfo
