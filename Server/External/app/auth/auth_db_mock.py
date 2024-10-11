from flask_bcrypt import Bcrypt
from ..models import UserRole

bcrypt = Bcrypt()

# Dummy users database (kan ersättas med riktig databas)
users_db = {
    "john_doe": {
        "password_hash": bcrypt.generate_password_hash("password123").decode('utf-8'),
        "role": UserRole.OPERATOR
    },
    "jane_doe": {
        "password_hash": bcrypt.generate_password_hash("password456").decode('utf-8'),
        "role": UserRole.MANAGER
    }
}