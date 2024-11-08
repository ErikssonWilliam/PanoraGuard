from flask import Flask
from flask_jwt_extended import JWTManager
from .extensions import bcrypt, db
from .routes import init_routes
from .mock_data import create_mock_data

# from .mock_data import create_mock_data
from .socketio_instance import socketio  # Import the SocketIO instance
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load config from config.py
    app.config.from_object("config.Config")

    # Configure JWT & Bcrypt
    app.config["JWT_SECRET_KEY"] = app.config.get("SECRET_KEY")
    bcrypt.init_app(app)
    JWTManager(app)

    # Initialize the database
    db.init_app(app)
    with app.app_context():
        print("Creating all tables")
        #    db.drop_all()
        # Create all tables defined in the models
        db.create_all()
        # Fill tables with mock data
        create_mock_data()

    init_routes(app)

    # Attach socketio to the app with CORS settings
    socketio.init_app(app, cors_allowed_origins=["http://localhost:3000", "https://ashy-meadow-0a76ab703.5.azurestaticapps.net"])

    return app
