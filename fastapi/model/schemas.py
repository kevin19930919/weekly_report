# pydantic models,using to filter data for transact with database
from datetime import date
from pydantic import BaseModel
from typing import List
import sys
sys.path.append('./fatapi/model')
from database import hash_func

#===== account =======
class AccountBase(BaseModel):
    email: str
    password: str

class AccountCreate(AccountBase):
    pass
    
class Account(AccountBase):
    projects: List[Project] = []
    class Config:
        orm_mode = True

#===== project ======
class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    account_id: int
    
    class Config:
        orm_mode = True

class Project_Report(ProjectBase):
    reports: List[Report]

# ===== report =====
class ReportBase(BaseModel):
    name: str
    date: date
class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    statements:List[Statement] = []
    class Config:
        orm_mode = True        

class Report_Project(Project):
    projects: List[Project]

#===== statement =====
class StatementBase(BaseModel):
    text :str
    progress :int
    predict_finish_date :date

class StatementCreate(StatementBase):    
    pass

class Statement(StatementBase):    
    report_id: int

    class Config:
        orm_mode = True