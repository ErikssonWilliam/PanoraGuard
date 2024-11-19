from .alarms.alarms_routes import alarms_bp
from .users.users_routes import users_bp
from .cameras.cameras_routes import cameras_bp
from .clips.clips_routes import clips_bp
from .schedules.schedules_routes import schedules_bp
from .snapshots.snapshots_routes import snapshots_bp
from .auth.auth_routes import auth_bp

# Register blueprints

# Empty testdb for postman
users_db = {}


def init_routes(app):
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(alarms_bp, url_prefix="/alarms")
    app.register_blueprint(cameras_bp, url_prefix="/cameras")
    app.register_blueprint(clips_bp, url_prefix="/clips")
    app.register_blueprint(schedules_bp, url_prefix="/schedules")
    app.register_blueprint(snapshots_bp, url_prefix="/snapshots")
    app.register_blueprint(auth_bp, url_prefix="/auth")
