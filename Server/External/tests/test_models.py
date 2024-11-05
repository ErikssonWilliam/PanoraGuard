from app.models import User, UserRole


def test_create_user(session):
    new_user = User(
        username="testuser3",
        password_hash="hashed_password3",
        role=UserRole.ADMIN,
        email="test3@example.com",
    )
    session.add(new_user)
    session.commit()

    user = User.query.filter_by(username="testuser3").first()
    assert user is not None
    assert user.username == "testuser3"
    assert user.email == "test3@example.com"
    assert user.role == UserRole.ADMIN


def test_update_user(session):
    user = User.query.filter_by(username="testuser1").first()
    user.role = UserRole.ADMIN
    session.commit()

    updated_user = User.query.filter_by(username="testuser1").first()
    assert updated_user.role == UserRole.ADMIN


def test_delete_user(session):
    user = User.query.filter_by(username="testuser2").first()
    session.delete(user)
    session.commit()

    deleted_user = User.query.filter_by(username="testuser2").first()
    assert deleted_user is None
