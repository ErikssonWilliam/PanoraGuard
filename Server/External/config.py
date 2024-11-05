import os
from dotenv import load_dotenv, find_dotenv
import sys

REQUIRED_ENV_VARS = ["DATABASE_URL", "SECRET_KEY", "email_pswrd"]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]

if missing_vars:
    dotenv_path = find_dotenv()
    if dotenv_path:
        load_dotenv(dotenv_path)
    else:
        print("Error: .env file not found and essential environment variables are missing.")
        sys.exit(1)

    missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]

if missing_vars:
    for var in missing_vars:
        print(f"Error: {var} is not set as an environment variable or in the .env file.")
    sys.exit(1)

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY") 
    email_pswrd = os.getenv("email_pswrd")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
