from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from .routes import routes
from .database import db
from flask_sqlalchemy import SQLAlchemy
from .models import *
from .mock_data import *


def create_app():
    app = Flask(__name__)

    # Load config from config.py
    app.config.from_object("config.Config")

    # Configure JWT & Bcrypt
    # Byt ut detta mot en stark nyckel
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'
    bcrypt = Bcrypt(app)
    jwt = JWTManager(app)

    # Initialize the database
    db.init_app(app)
    with app.app_context():
        db.drop_all()
        # Create all tables defined in the models
        db.create_all()
        # Fill tables with mock data
        create_mock_data()

    app.register_blueprint(routes, url_prefix=("/"))


    return app
