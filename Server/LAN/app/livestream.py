from flask import Blueprint, Response
import cv2

ls_bp = Blueprint("livestream", __name__)

rtsp_url = "rtsp://root:secure@192.168.1.121/axis-media/media.amp?videocodec=h264&resolution=1920x1080"


def generate_frames():
    cap = cv2.VideoCapture(rtsp_url)
    if not cap.isOpened():
        return b""

    try:
        while True:
            success, frame = cap.read()
            if not success:
                break
            else:
                _, buffer = cv2.imencode(".jpg", frame)
                frame = buffer.tobytes()
                yield (
                    b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
                )
    finally:
        cap.release()


@ls_bp.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )
