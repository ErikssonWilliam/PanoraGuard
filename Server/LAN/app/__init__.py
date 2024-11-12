from flask import Flask
from .database import db


def create_app():
    app = Flask(__name__)

    # Load config from config.py
    app.config.from_object("config.Config")

    # Initialize the database
    db.init_app(app)

    with app.app_context():
        # Create all tables defined in the models
        db.create_all()

    # Import and register routes
    from .testRoutes import api as test_api
    from .brightnessRoutes import api as brightness_api

    app.register_blueprint(test_api)
    app.register_blueprint(brightness_api)

    return app
