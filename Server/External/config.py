import os
from dotenv import load_dotenv, find_dotenv
import sys

# Find and load the .env file, exit if not found
dotenv_path = find_dotenv()
if not dotenv_path:
    print(
        "Error: .env file not found. Please create one with the necessary configurations."
    )
    sys.exit(1)
else:
    load_dotenv(dotenv_path)


class Config:
    # Try to load environment variables, exit if critical ones are missing
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY")  # For jwt tokens
    email_pswrd = os.getenv("email_pswrd")

    # Exit if essential environment variables are missing
    if not SQLALCHEMY_DATABASE_URI:
        print("Error: DATABASE_URL not set in the .env file.")
        sys.exit(1)

    if not SECRET_KEY:
        print("Error: SECRET_KEY not set in the .env file.")
        sys.exit(1)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
