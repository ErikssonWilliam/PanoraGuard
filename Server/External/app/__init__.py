from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from .routes import routes
from .auth import auth

app = Flask(__name__)

# Konfigurera JWT och Bcrypt
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Byt ut detta mot en stark nyckel
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

from .routes import routes
app.register_blueprint(routes, url_prefix=("/"))
app.register_blueprint(auth, url_prefix="/")