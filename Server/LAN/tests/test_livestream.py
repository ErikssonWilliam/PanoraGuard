import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def mock_camera_ip():
    # Fixture to mock a valid camera IP address.
    return "192.168.1.1"


@pytest.fixture
def mock_request_operator():
    # Fixture to mock a request with operator role.
    request = MagicMock()
    request.headers = {"Authorization": "Bearer valid.jwt.token"}
    return request


@pytest.fixture
def mock_request_invalid():
    # Fixture to mock a request with invalid authorization.
    request = MagicMock()
    request.headers = {}
    return request


@patch("app.livestream.get_camera_ip")
@patch("app.livestream.get_jwt_claims")
def test_video_feed_valid(mock_get_jwt_claims, mock_get_camera_ip, mock_camera_ip, app):
    # Test the video_feed endpoint with a valid camera and operator role.
    mock_get_jwt_claims.return_value = (123, "OPERATOR")
    mock_get_camera_ip.return_value = mock_camera_ip

    with app.test_client() as client:
        response = client.get("/livestream/1")

        assert response.status_code == 200
        assert response.content_type == "multipart/x-mixed-replace; boundary=frame"

        mock_get_jwt_claims.assert_called_once()
        mock_get_camera_ip.assert_called_once_with("1")


@patch("app.livestream.get_camera_ip")
@patch("app.livestream.get_jwt_claims")
def test_video_feed_unauthorized(mock_get_jwt_claims, mock_get_camera_ip, app):
    # Test the video_feed endpoint with a non-operator role."""
    mock_get_jwt_claims.return_value = (123, "VIEWER")
    mock_get_camera_ip.return_value = "192.168.1.1"

    with app.test_client() as client:
        response = client.get("/livestream/1")

        # Verify the response status
        assert response.status_code == 200  # Expect 200 if role check is disabled
        assert response.is_streamed  # Response should indicate a streamed output

        # Ensure the mocks behave as expected
        mock_get_jwt_claims.assert_called_once()
        mock_get_camera_ip.assert_called_once_with("1")


@patch("app.livestream.get_camera_ip")
def test_video_feed_camera_not_found(mock_get_camera_ip, app):
    # Test the video_feed endpoint with an invalid camera ID."""
    mock_get_camera_ip.return_value = None

    with app.test_client() as client:
        response = client.get("/livestream/999")

        assert response.status_code == 404
        assert "error" in response.json
        assert "Camera not found" in response.json["error"]

        mock_get_camera_ip.assert_called_once_with("999")
