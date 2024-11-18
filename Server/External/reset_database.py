import os
from sqlalchemy import create_engine, MetaData
from config import Config


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
        for root, dirs, files in os.walk(migrations_dir, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        os.rmdir(migrations_dir)
        print("Migrations directory deleted.")

    os.system("flask db init")
    os.system("flask db migrate -m 'Initial migration'")
    os.system("flask db upgrade")
    print("Database has been reset and migrations reapplied.")


if __name__ == "__main__":
    reset_database()
