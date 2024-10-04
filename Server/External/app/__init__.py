from flask import Flask
from .routes import routes
from .database import db
from flask_sqlalchemy import SQLAlchemy
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

        # Insert mock data
        #admin = User(username='admin', password_hash='hashed_password', role=UserRole.ADMIN, email='admin@example.com')
        #db.session.add(admin)
        #db.session.commit()

    app.register_blueprint(routes, url_prefix=("/"))

    return app
