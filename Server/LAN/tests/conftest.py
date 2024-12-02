import pytest
from app import create_app
from app.database import db  # Assuming you use SQLAlchemy for the database
from app.database import Camera  # Replace with actual models if applicable


@pytest.fixture(scope="module")
def app():
    """Create a Flask application for tests."""
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    # app.config["TESTING"] = True

    with app.app_context():
        db.create_all()  # Set up in-memory database
        yield app
        db.drop_all()  # Cleanup after tests


@pytest.fixture(scope="module")
def init_database(app):
    """Initialize the database with test data."""
    with app.app_context():
        camera1 = Camera(id=1, ip_address="192.168.1.1")  # Example model
        camera2 = Camera(id=2, ip_address="192.168.1.1")  # Example model

        db.session.add(camera1)
        db.session.add(camera2)
        db.session.commit()

        yield db


@pytest.fixture(scope="function")
def session(app, init_database):
    """Provide a session for database interaction in tests."""
    with app.app_context():
        yield db.session
        db.session.rollback()  # Rollback after each test
