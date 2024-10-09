<<<<<<< HEAD
from flask import Flask
from .routes.users_routes import users_bp
from .routes.alarms_routes import alarms_bp

app = Flask(__name__)
app.register_blueprint(users_bp, url_prefix=("/users"))
app.register_blueprint(alarms_bp, url_prefix=("/alarms"))
=======
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from .routes import routes
from .database import db
from flask_sqlalchemy import SQLAlchemy
from .models import *
from .auth import auth
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
    app.register_blueprint(auth, url_prefix="/")

    return app
>>>>>>> cbe9cf8f6d9e6da81134dd97f07ae8fc044c1a4c
