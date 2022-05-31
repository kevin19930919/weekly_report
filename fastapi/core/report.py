from sqlalchemy.orm import Session
from sqlalchemy import func
import sys
sys.path.append('../model')
from model import models, schemas

def create_report_and_project(db: Session, report: schemas.ReportCreate, project_id: int):
    try:
        project = get_project_by_id(project_id)
        report_record = models.Report(
            name=report.name, 
            date=report.date,
            project=[project]
        )
        db.add(report_record)

        db.flush()
        db.commit()
        db.refresh(report_record)
    except Exception as e:
        print('============create peoblem in crud==========',e)
    return account