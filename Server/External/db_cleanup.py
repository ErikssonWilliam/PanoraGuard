from sqlalchemy import text
from datetime import datetime, timedelta
from app.extensions import db
from config import Config
import schedule
import time
from threading import Thread

DB_URI = Config.SQLALCHEMY_DATABASE_URI

session = db.session


def run_scheduler(app):
    print("Scheduler started")
    schedule.every().day.at("00:00").do(run_clean_in_context, app)
    schedule.every().minute.do(run_clean_in_context, app)

    while True:
        schedule.run_pending()
        print("Checked for scheduled tasks")
        time.sleep(60 * 60 * 2)


def run_clean_in_context(app):
    with app.app_context():
        clean()


def start_scheduler(app):
    scheduler_thread = Thread(target=run_scheduler, args=(app,), daemon=True)
    scheduler_thread.start()


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
