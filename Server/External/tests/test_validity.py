import pytest
from app.users.users_service import UserService


def test_validity_check_success():
    valid_data = {
        "username": "testuser",
        "password": "password123",
        "role": "OPERATOR",
        "email": "testuser@example.com",
    }
    assert UserService.validity_check(valid_data) is True


def test_validity_check_missing_field():
    invalid_data = {
        "username": None,
        "password": "password123",
        "role": "GUARD",
        "email": "testuser@example.com",
    }
    with pytest.raises(ValueError, match="'username' is required and cannot be empty."):
        UserService.validity_check(invalid_data)


def test_validity_check_empty_field():
    invalid_data = {
        "username": "testuser",
        "password": None,
        "role": "GUARD",
        "email": "testuser@example.com",
    }
    with pytest.raises(ValueError, match="'password' is required and cannot be empty."):
        UserService.validity_check(invalid_data)


def test_validity_check_invalid_role():
    invalid_data = {
        "username": "testuser",
        "password": "password123",
        "role": "INVALID",
        "email": "testuser@example.com",
    }
    with pytest.raises(ValueError, match="Invalid role."):
        UserService.validity_check(invalid_data)


def test_validity_check_invalid_email():
    invalid_data = {
        "username": "testuser",
        "password": "password123",
        "role": "GUARD",
        "email": "invalid-email",
    }
    with pytest.raises(ValueError, match="Invalid email format."):
        UserService.validity_check(invalid_data)
