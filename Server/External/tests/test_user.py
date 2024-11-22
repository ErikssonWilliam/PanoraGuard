from app.models import User, UserRole
from app.users.users_service import UserService


def test_create_user(session):
    username = "testuser"
    password = "secure_password"
    role = UserRole.ADMIN
    email = "test@example.com"

    new_user = UserService.create_user(
        username=username, password=password, role=role, email=email
    )

    session.add(new_user)
    session.commit()

    assert new_user is not None
    assert new_user.username == username
    assert new_user.email == email
    assert new_user.role == role

    user = User.query.filter_by(username=username).first()
    assert user is not None
    assert user.username == new_user.username
    assert user.email == new_user.email
    assert user.role == new_user.role

    session.delete(new_user)
    session.commit()


def test_update_user(session):
    user = User(
        username="original_user",
        password_hash="hashed_password",
        role=UserRole.OPERATOR,
        email="original@example.com",
    )
    session.add(user)
    session.commit()

    update_data = {
        "username": "updated_user",
        "email": "updated@example.com",
        "role": UserRole.ADMIN,
    }

    updated_user = UserService.update_user(user=user, data=update_data)

    assert updated_user.username == "updated_user"
    assert updated_user.email == "updated@example.com"
    assert updated_user.role == UserRole.ADMIN

    user_in_db = User.query.filter_by(id=user.id).first()
    assert user_in_db is not None
    assert user_in_db.username == "updated_user"
    assert user_in_db.email == "updated@example.com"
    assert user_in_db.role == UserRole.ADMIN

    session.delete(user)
    session.commit()


def test_delete_user(session):
    user = User(
        username="delete_me",
        password_hash="hashed_password",
        role=UserRole.OPERATOR,
        email="delete_me@example.com",
    )
    session.add(user)
    session.commit()

    user_id = user.id

    user_in_db = session.query(User).get(user_id)
    assert user_in_db is not None

    result = UserService.delete_user(user_id)

    assert result is True

    user_in_db = session.query(User).get(user_id)
    assert user_in_db is None

    result = UserService.delete_user(user_id)
    assert result is False


def test_get_users(session):
    session.query(User).filter(User.username.in_(["testuser1", "testuser2"])).delete()
    session.commit()
    user1 = User(
        username="testuser1",
        password_hash="hashed_password1",
        role=UserRole.OPERATOR,
        email="testuser1@example.com",
    )
    user2 = User(
        username="testuser2",
        password_hash="hashed_password2",
        role=UserRole.ADMIN,
        email="testuser2@example.com",
    )
    session.add(user1)
    session.add(user2)
    session.commit()

    users = UserService.get_users()
    usernames = {user.username for user in users}
    emails = {user.email for user in users}
    roles = {user.role for user in users}

    assert "testuser1" in usernames
    assert "testuser2" in usernames
    assert "testuser1@example.com" in emails
    assert "testuser2@example.com" in emails
    assert UserRole.OPERATOR in roles
    assert UserRole.ADMIN in roles
    session.delete(user1)
    session.delete(user2)
    session.commit()


def test_get_user_by_id(session):
    user = User(
        username="testuser1",
        password_hash="hashed_password1",
        role=UserRole.ADMIN,
        email="testuser1@example.com",
    )
    session.add(user)
    session.commit()

    retrieved_user = UserService.get_user_by_id(user.id)
    assert retrieved_user is not None
    assert retrieved_user.id == user.id
    assert retrieved_user.username == "testuser1"

    session.delete(user)
    session.commit()


def test_get_user_by_username(session):
    user = User(
        username="testuser2",
        password_hash="hashed_password2",
        role=UserRole.ADMIN,
        email="testuser2@example.com",
    )
    session.add(user)
    session.commit()

    retrieved_user = UserService.get_user_by_username("testuser2")
    assert retrieved_user is not None
    assert retrieved_user.username == "testuser2"
    assert retrieved_user.email == "testuser2@example.com"
    assert retrieved_user.role == UserRole.ADMIN

    session.delete(user)
    session.commit()


def test_get_user_by_email(session):
    user = User(
        username="testuser2",
        password_hash="hashed_password2",
        role=UserRole.ADMIN,
        email="testuser2@example.com",
    )
    session.add(user)
    session.commit()

    retrieved_user = UserService.get_user_by_email("testuser2@example.com")
    assert retrieved_user is not None
    assert retrieved_user.username == "testuser2"
    assert retrieved_user.email == "testuser2@example.com"
    assert retrieved_user.role == UserRole.ADMIN

    session.delete(user)
    session.commit()
