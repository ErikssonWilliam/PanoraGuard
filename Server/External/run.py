from flask_migrate import upgrade
from app import create_app
from app.socketio_instance import socketio
from app.mock_data import create_mock_data

app = create_app()
if __name__ == "__main__":
    with app.app_context():
        upgrade()
        create_mock_data()
    socketio.run(app, host="0.0.0.0", port=5000)
