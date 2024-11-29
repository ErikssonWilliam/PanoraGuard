from sqlalchemy import text
from datetime import datetime, timedelta
from app.extensions import db
from config import Config

DB_URI = Config.SQLALCHEMY_DATABASE_URI

session = db.session


def clean():
    six_months_old = datetime.now() - timedelta(days=180)

    try:
        deleted_rows = session.execute(
            text("DELETE FROM alarms WHERE timestamp < :six_months_old"),
            {"six_months_old": six_months_old},
        )
        session.commit()
        print(f"Deleted {deleted_rows.rowcount} rows from alarms table")
    except Exception as e:
        session.rollback()
        print(f"Error deleting rows from alarms table: {e}")
    finally:
        session.close()
