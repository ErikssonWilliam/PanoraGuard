from flask_migrate import upgrade, init
from app import create_app
from app.socketio_instance import socketio
from app.mock_data import create_mock_data
from db_cleanup import start_scheduler

app = create_app()
if __name__ == "__main__":
    with app.app_context():
        try:
            init()
        except SystemExit:
            pass
            # migrate()
            upgrade()
            create_mock_data()
            start_scheduler(app)

        socketio.run(app, host="0.0.0.0", port=5000, debug=True)
