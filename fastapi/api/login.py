from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, APIRouter
from sqlalchemy.orm import Session
import sys
sys.path.append('../model/')
from model import models, schemas
sys.path.append('../core/')
import login
from model.database import get_db_session

LoginAPIRouter = APIRouter(prefix="/login",tags=["login"])

@LoginAPIRouter.post("/")
def login(db: Session = Depends(get_db_session), account_info: schemas.AccountBase):
    try:
        print('request:',account_info)
        if login.Account(db=db, account_info=account_info).verify_account():
            return 
    except Exception as e:
        print('======= login fail =========:',e)
        raise HTTPException(status_code = 500, detail =  "server error")
