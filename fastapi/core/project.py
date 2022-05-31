from sqlalchemy.orm import Session
from sqlalchemy import func
import sys
sys.path.append('../model')
from model import models, schemas

# def get_project(db: Session, project: schemas.Project):
#     return db.query(models.Project).filter(models.Account.email == email).first()
def get_project_id(account_id:int, project_name: str):
    project = db.query(models.Project).filter(and_(models.Project.name==project_name,models.Project.account_id==account_id)).first()
    return project.id

def create_project(db: Session, project: schemas.ProjectCreate, account_id: int):
    try:
        project_record = models.Project(
            name=project.name,
            account_id=account_id
        )
        db.add(project_record)

        db.flush()
        db.commit()
        db.refresh(project_record)
    except Exception as e:
        print('============create peoblem in crud==========',e)
    return project