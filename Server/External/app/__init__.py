from flask import Flask
from flask_jwt_extended import JWTManager
from .extensions import bcrypt, db, flask_migrate
from .routes import init_routes
from .mock_data import create_mock_data
from flask_migrate import upgrade, migrate
from flask_cors import CORS
from .socketio_instance import socketio  # Import the SocketIO instance


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load config from config.py
    app.config.from_object("config.Config")

    # Configure JWT & Bcrypt
    app.config["JWT_SECRET_KEY"] = app.config.get("SECRET_KEY")
    bcrypt.init_app(app)
    flask_migrate.init_app(app, db, directory="app/migrations")
    JWTManager(app)

    # Initialize the database and Flask-Migrate
    db.init_app(app)

    with app.app_context():
        # Automatically apply any migrations
        migrate()
        upgrade()
        create_mock_data()

    init_routes(app)

    # Attach socketio to the app with CORS settings
    socketio.init_app(
        app,
        cors_allowed_origins=[
            "http://localhost:3000",
            "https://ashy-meadow-0a76ab703.5.azurestaticapps.net",
        ],
    )

    return app
