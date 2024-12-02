import pytest
from unittest.mock import patch, MagicMock
from app.utils import get_jwt_claims

# from app.database import Camera
import jwt


@pytest.fixture
def mock_request():
    """Fixture to mock a request with headers."""
    request = MagicMock()
    request.headers = {"Authorization": "Bearer valid.jwt.token"}
    return request


@pytest.fixture
def mock_invalid_request():
    """Fixture to mock a request with no Authorization header."""
    request = MagicMock()
    request.headers = {}
    return request


def test_get_jwt_claims_valid_token(mock_request):
    """Test get_jwt_claims with a valid JWT token."""
    with patch("app.utils.jwt.decode") as mock_decode:
        mock_decode.return_value = {"sub": {"user_id": 123, "role": "admin"}}

        user_id, role = get_jwt_claims(mock_request)

        assert user_id == 123
        assert role == "admin"
        mock_decode.assert_called_once()


def test_get_jwt_claims_invalid_token(mock_request):
    """Test get_jwt_claims with an invalid JWT token."""
    with patch("app.utils.jwt.decode", side_effect=jwt.InvalidTokenError):
        user_id, error = get_jwt_claims(mock_request)

        assert user_id is None
        assert error == "Invalid token"


def test_get_jwt_claims_no_authorization_header(mock_invalid_request):
    """Test get_jwt_claims with missing Authorization header."""
    user_id, error = get_jwt_claims(mock_invalid_request)

    assert user_id is None
    assert error == "Authorization header missing or invalid"


# yet to be implemented
# def test_get_camera_ip(app):
#     """Test get_camera_ip with a valid camera ID."""
#     with app.app_context():  # Provide app context for the test
#         with patch("app.utils.Camera.query.filter_by") as mock_filter_by:
#             mock_camera = MagicMock()
#             mock_camera.ip_address = "192.168.1.1"
#             mock_filter_by.return_value.first.return_value = mock_camera

#             ip_address = get_camera_ip(1)

#             assert ip_address == "192.168.1.1"
#             mock_filter_by.assert_called_once_with(id=1)


# def test_get_camera_ip_no_camera(app):
#     """Test get_camera_ip with a nonexistent camera ID."""
#     with app.app_context():  # Provide app context for the test
#         with patch("app.utils.Camera.query.filter_by") as mock_filter_by:
#             mock_filter_by.return_value.first.return_value = None

#             ip_address = get_camera_ip(999)

#             assert ip_address is None
#             mock_filter_by.assert_called_once_with(id=999)

# def test_get_cameras(app):
#     """Test get_cameras with cameras in the database."""
#     with app.app_context():  # Provide app context for the test
#         with patch("app.utils.Camera.query.all") as mock_query_all:
#             mock_camera1 = MagicMock()
#             mock_camera1.to_dict.return_value = {"id": 1, "ip_address": "192.168.1.1"}
#             mock_camera2 = MagicMock()
#             mock_camera2.to_dict.return_value = {"id": 2, "ip_address": "192.168.1.2"}

#             mock_query_all.return_value = [mock_camera1, mock_camera2]

#             cameras = get_cameras()

#             assert cameras == [
#                 {"id": 1, "ip_address": "192.168.1.1"},
#                 {"id": 2, "ip_address": "192.168.1.2"}
#             ]
#             mock_query_all.assert_called_once()

# def test_get_cameras_no_cameras(app):
#     """Test get_cameras when no cameras exist in the database."""
#     with app.app_context():  # Provide app context for the test
#         with patch("app.utils.Camera.query.all") as mock_query_all:
#             mock_query_all.return_value = []

#             cameras = get_cameras()

#             assert cameras == []
#             mock_query_all.assert_called_once()
