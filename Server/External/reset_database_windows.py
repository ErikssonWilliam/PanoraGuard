import os
import shutil
from sqlalchemy import create_engine, MetaData
from config import Config
import subprocess


def reset_database():
    print("Initializing database reset...")
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

    meta = MetaData()
    meta.reflect(bind=engine)

    print("Dropping all tables...")
    meta.drop_all(bind=engine)
    print("All tables have been dropped.")

    # Reinitialize migrations
    print("Deleting migrations directory...")
    migrations_dir = os.path.join(os.path.dirname(__file__), "app", "migrations")
    if os.path.exists(migrations_dir):
        shutil.rmtree(migrations_dir)
        print("Migrations directory deleted.")

    try:
        subprocess.run(["flask", "db", "init"], check=True)
        subprocess.run(
            ["flask", "db", "migrate", "-m", "Initial migration"], check=True
        )
        subprocess.run(["flask", "db", "upgrade"], check=True)
        print("Database has been reset and migrations reapplied.")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    reset_database()
