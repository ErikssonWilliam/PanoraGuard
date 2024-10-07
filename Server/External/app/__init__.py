from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from .routes import routes
from .database import db
from flask_sqlalchemy import SQLAlchemy
from .models import *
from .auth import auth

def create_app():
    app = Flask(__name__)

    # Load config from config.py
    app.config.from_object("config.Config")

    # Configure JWT & Bcrypt
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Byt ut detta mot en stark nyckel
    bcrypt = Bcrypt(app)
    jwt = JWTManager(app)

    # Initialize the database
    db.init_app(app)

    with app.app_context():
        # Create all tables defined in the models
        db.create_all()

    app.register_blueprint(routes, url_prefix=("/"))
    app.register_blueprint(auth, url_prefix="/")
    
    return app