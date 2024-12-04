import pytest
from app.auth.auth_service import AuthService
from app.models import User, UserRole
from app.extensions import bcrypt


@pytest.fixture
def sample_user(session):
    session.query(User).delete()
    session.commit()

    user = User(
        username="testuser",
        password_hash=bcrypt.generate_password_hash("password123").decode("utf-8"),
        role=UserRole.OPERATOR,
        email="testuser@example.com",
    )
    session.add(user)
    session.commit()
    return user


def test_login_success(session, sample_user):
    response = AuthService.login("testuser", "password123")
    assert response is not None
    assert response["user_id"] == sample_user.id
    assert response["role"] == "OPERATOR"
    assert "access_token" in response


def test_login_invalid_password(session, sample_user):
    with pytest.raises(ValueError, match="Invalid password"):
        AuthService.login("testuser", "wrongpassword")


def test_login_user_not_found(session):
    with pytest.raises(KeyError, match="User not found"):
        AuthService.login("nonexistentuser", "password123")
