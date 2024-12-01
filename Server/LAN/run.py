from app import create_app
from scheduling import schedule_logic
import threading

app = create_app()

if __name__ == "__main__":
    scheduler_thread = threading.Thread(
        target=schedule_logic.run_schedule, args=(app,), daemon=True
    )
    scheduler_thread.start()

    app.run(
        debug=False, port=5100, host="0.0.0.0"
    )  # debug False needed or threading will be called multiple times
