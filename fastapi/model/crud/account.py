from sqlalchemy.orm import Session
from sqlalchemy import func
import sys
sys.path.append('../../model')
from model import models, schemas

def check_account_exists(db: Session, email: str, password: str):
    return query(exists().where(and_(models.Account.email==email,models.Account.password==password))).scalar()

def create_account(db: Session, account: schemas.AccountCreate):
    try:
        account_record = models.Account(
            email=account.email, 
            password=account.password,
        )
        db.add(account_record)

        db.flush()
        db.commit()
        db.refresh(account_record)
    except Exception as e:
        print('============create peoblem in crud==========',e)
    return account