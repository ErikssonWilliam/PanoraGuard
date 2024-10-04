from flask import Flask
from .routes.users_routes import users_bp
from .routes.alarms_routes import alarms_bp

app = Flask(__name__)
app.register_blueprint(users_bp, url_prefix=("/users"))
app.register_blueprint(alarms_bp, url_prefix=("/alarms"))