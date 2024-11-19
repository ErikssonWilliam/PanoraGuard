from flask import Flask
from .database import db
from .testRoutes import test_bp
from .brightnessRoutes import br_bp
from .livestream import ls_bp
 
 
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
 
    app.register_blueprint(test_bp)
    app.register_blueprint(br_bp)
    app.register_blueprint(ls_bp)
 
    return app