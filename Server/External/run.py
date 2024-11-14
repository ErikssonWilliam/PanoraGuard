from app import create_app
from app.socketio_instance import socketio

app = create_app()
if __name__ == "__main__":
    # app.run(debug=True, host="0.0.0.0", port=5000)
    socketio.run(app, host="0.0.0.0", port=5000)
