from flask import Flask
from flask_jwt_extended import JWTManager
from .extensions import bcrypt, db
from .routes import init_routes
from .mock_data import create_mock_data


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

    init_routes(app)

    return app
