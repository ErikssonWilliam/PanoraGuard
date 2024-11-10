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
        email_pswrd = "test_password"
    else:
        REQUIRED_ENV_VARS = ["DATABASE_URL", "SECRET_KEY", "email_pswrd"]

        missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
        if missing_vars:
            print("Error: The following environment variables are missing:")
            for var in missing_vars:
                print(f" - {var}")
            sys.exit(1)
        SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
        SECRET_KEY = os.getenv("SECRET_KEY")
        email_pswrd = os.getenv("email_pswrd")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
