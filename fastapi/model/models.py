from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship
from sqlalchemy.types import Date
import sys
sys.path.append('./fastapi/model')
from database import Base, hash_func

class Account(Base):
    __tablename__ = "Account"
    
    id = Column(Integer, primary_key=True, index=True)
    account = Column(String(80), unique=True, nullable=False)
    password = Column(String(80), unique=True, nullable=False)
    
    projct = relationship("Project", back_populates="account")

class Project_Report(Base):
    __tablename__ = "Project_Report"
    
    project_id = Column(Integer, ForeignKey('Project.id')),
    report_id = Column(Integer, ForeignKey('Report.id')))

class Project(Base):
    __tablename__ = "Project"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=False, nullable=False)

    account_id = Column(Integer, ForeignKey("Account.id"))
    account = relationship("Account", back_populates="project")

class Report(Base):
    __tablename__ = "Report"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=False, nullable=False)
    date = Column(Date)

    project = relationship("Report", secondary=Project_Report, backref="report")

class Statement(Base):
    __tablename__ "Statement"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(200), unique=False, nullable=True)
    progress = Column(Integer, unique=False, nullable=False)
    predict_finish_date = Column(Date)

    project_id = Column(Integer, ForeignKey("Project.id"))
    report_id = Column(Integer, ForeignKey("Report.id"))




