from sqlalchemy.orm import Session
from sqlalchemy import func
from abc import ABC, abstractmethod
import sys
sys.path.append('../model')
from model import schemas
from model import crud.account

class AccountInterface(ABC):
    @abstractmethod
    def verify_account(self):
        raise NotImplementedError

class Account(AccountInterface):
    def __init__(self, db, account_info):
        self._db = db
        self._email = account_info.email
        self._password = account_info.password

    def verify_account(self, db):
        if account.check_account_exists(self._db, self._email = email, self._password):
            return True
        return False    

