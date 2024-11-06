import pytest
from app import create_app
from app.extensions import db
from app.models import User, UserRole


@pytest.fixture(scope="module")
def app():
    app = create_app()

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture(scope="module")
def init_database(app):
    with app.app_context():
        user1 = User(
            username="testuser1",
            password_hash="hashed_password1",
            role=UserRole.OPERATOR,
            email="test1@example.com",
        )
        user2 = User(
            username="testuser2",
            password_hash="hashed_password2",
            role=UserRole.MANAGER,
            email="test2@example.com",
        )
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        yield db


@pytest.fixture(scope="function")
def session(app, init_database):
    with app.app_context():
        yield db.session
        db.session.rollback()
