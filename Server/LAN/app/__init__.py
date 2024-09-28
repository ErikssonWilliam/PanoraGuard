from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .database import db
from .models import *


def create_app():
    app = Flask(__name__)

    # Load config from config.py
    app.config.from_object("config.Config")

    # Initialize the database
    db.init_app(app)

    with app.app_context():
        # Create all tables defined in the models
        db.create_all()

        # Check if the 'test' table is empty
        if Test.query.count() == 0:  # Assuming 'Test' is one of your models
            # Insert mock data
            mock_data = [
                Test(name="Sample Data 1"),
                Test(name="Sample Data 2"),
                Test(name="Sample Data 3"),
            ]
            db.session.bulk_save_objects(mock_data)
            db.session.commit()  # Commit the transaction

    # Import and register routes
    from .routes import api

    app.register_blueprint(api)

    return app
