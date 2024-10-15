from flask import Flask
from flask_jwt_extended import JWTManager

from .mock_data import create_mock_data
from .extensions import bcrypt, db
from .alarms.alarms_routes import alarms_bp
from .users.users_routes import users_bp
from .cameras.cameras_routes import cameras_bp
from .clips.clips_routes import clips_bp
from .schedules.schedules_routes import schedules_bp
from .snapshots.snapshots_routes import snapshots_bp
from .auth.auth_routes import auth_bp

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
    app.config["JWT_SECRET_KEY"] = app.config.get("SECRET_KEY")
    bcrypt.init_app(app)
    jwt = JWTManager(app)

    # Initialize the database
    db.init_app(app)
    with app.app_context():
        db.drop_all()
        # Create all tables defined in the models
        db.create_all()
        # Fill tables with mock data
        create_mock_data()

    # Register blueprints
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(alarms_bp, url_prefix="/alarms")
    app.register_blueprint(cameras_bp, url_prefix="/cameras")
    app.register_blueprint(clips_bp, url_prefix="/clips")
    app.register_blueprint(schedules_bp, url_prefix="/schedules")
    app.register_blueprint(snapshots_bp, url_prefix="/snapshots")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
