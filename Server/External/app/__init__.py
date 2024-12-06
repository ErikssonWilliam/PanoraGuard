from flask import Flask
from flask_jwt_extended import JWTManager
from .extensions import bcrypt, db, migrate
from .routes import init_routes
from flask_cors import CORS
from .socketio_instance import socketio


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load config from config.py
    app.config.from_object("config.Config")

    # Configure JWT & Bcrypt
    app.config["JWT_SECRET_KEY"] = app.config.get("SECRET_KEY")

    # Init extensions
    bcrypt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db, directory="app/migrations")
    JWTManager(app)

    # Register blueprints
    init_routes(app)

    # Attach socketio to the app with CORS settings
    socketio.init_app(
        app,
        cors_allowed_origins=[
            "http://localhost:3000",
            "https://ashy-meadow-0a76ab703.5.azurestaticapps.net",
            "https://panoraguard.se",
        ],
        async_mode="eventlet",
    )

    return app
