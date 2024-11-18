from app import create_app
from scheduling import schedule_logic
import threading

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        scheduler_thread = threading.Thread(target=schedule_logic.run_schedule, daemon=True)
        scheduler_thread.start()

    app.run(debug=True, port=5100)
