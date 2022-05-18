from sqlalchemy.orm import Session

from . import models, schemas


def get_CryptoTrade(db: Session, _id: int):
    return db.query(models.CryptoTrade).filter(models.CryptoTrade.id == _id).first()


def get_CryptoTrade_by_target(db: Session, target: str):
    return db.query(models.CryptoTrade).filter(models.CryptoTrade.target == target)

def get_CryptoTrades(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CryptoTrade).offset(skip).limit(limit).all()


def create_CryptoTrade(db: Session, CryptoTrade: schemas.CreateCryptoTrade):
    db_CryptoTrade = models.CryptoTrade(
        etarget=CryptoTrade.email, 
        price=CryptoTrade.price, 
        quantity=CryptoTrade.quantity)
    db.add(db_CryptoTrade)
    db.commit()
    db.refresh(db_CryptoTrade)
    return db_CryptoTrade


def delete_CryptoTrade(db: Session, _id: int):
    db_CryptoTrade = db.query(models.CryptoTrade).filter(models.CryptoTrade.id == _id).first()
    if db_CryptoTrade:
        db.delete(db_CryptoTrade)
        db.commit()
        db.flush()
    return db_CryptoTrade    