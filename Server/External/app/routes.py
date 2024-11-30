from .alarms.alarms_routes import alarms_bp
from .users.users_routes import users_bp
from .cameras.cameras_routes import cameras_bp
from .auth.auth_routes import auth_bp


def init_routes(app):
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(alarms_bp, url_prefix="/alarms")
    app.register_blueprint(cameras_bp, url_prefix="/cameras")
    app.register_blueprint(auth_bp, url_prefix="/auth")
