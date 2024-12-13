"""
This file contains functionality for extracting information from JWT tokens.
"""

import jwt
from .database import Camera
from config import Config


def get_jwt_claims(request):
    """
    Function for extracting information from a JWT token.
    The JWT token is extracted and decoded from the Authorization header of a request.

    Parameters:
        request (flask.Request): The request containing the Authorization header.

    Returns:
        tuple: A tuple containing the user ID and role.
    """

    # Get the Authorization header from the request
    auth_header = request.headers.get("Authorization")

    if auth_header and auth_header.startswith("Bearer "):
        # Extract the token from the header
        token = auth_header.split(" ")[1]

        try:
            # Decode the token using your secret key and algorithm
            decoded_token = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])

            # Access the role inside the 'sub' object
            user_id = decoded_token.get("sub", {}).get(
                "user_id"
            )  # Get user_id from 'sub'
            role = decoded_token.get("sub", {}).get("role")  # Get role from 'sub'

            return user_id, role  # or whatever data you need
        except jwt.ExpiredSignatureError:
            return None, "Token has expired"
        except jwt.InvalidTokenError:
            return None, "Invalid token"

    return None, "Authorization header missing or invalid"


def get_camera_ip(camera_id):
    """Helper function to fetch the camera IP from the database."""
    camera = Camera.query.filter_by(id=camera_id).first()
    if camera:
        return camera.ip_address
    return None


def get_cameras():
    """Helper function to fetch all cameras from the database."""
    cameras = Camera.query.all()
    return [camera.to_dict() for camera in cameras]
