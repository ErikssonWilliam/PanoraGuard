import os
import sys
import secrets
from dotenv import load_dotenv, find_dotenv

dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)


def is_pytest_running():
    return (
        (os.environ.get("PYTEST_VERSION") is not None)
        or os.path.basename(sys.argv[0])
        in (
            "pytest",
            "py.test",
        )
        or "pytest" in sys.modules
    )


class Config:
    if is_pytest_running():
        SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
        SECRET_KEY = secrets.token_hex(16)
        CAMERA_USERNAME = "test_username"
        CAMERA_PASSWORD = "test_password"
    else:
        REQUIRED_ENV_VARS = [
            "DATABASE_URL",
            "SECRET_KEY",
            "CAMERA_USERNAME",
            "CAMERA_PASSWORD",
        ]

        missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
        if missing_vars:
            print("Error: The following environment variables are missing:")
            for var in missing_vars:
                print(f" - {var}")
            sys.exit(1)
        SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
        SECRET_KEY = os.getenv("SECRET_KEY")
        CAMERA_USERNAME = os.getenv("CAMERA_USERNAME")
        CAMERA_PASSWORD = os.getenv("CAMERA_PASSWORD")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SPEAKER_IP = "192.168.1.108"  # Always the same
    # EXTERNAL_ALARMS_ADD = "https://company3-externalserver.azurewebsites.net/alarms/add" # When using the cloud server
    EXTERNAL_ALARMS_ADD = (
        "http://192.168.1.145:5000/alarms/add"  # When using the local server
    )
