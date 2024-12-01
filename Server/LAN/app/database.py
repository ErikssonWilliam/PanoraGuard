from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Camera(db.Model):
    __tablename__ = "cameras"
    id = db.Column(db.String, primary_key=True)
    ip_address = db.Column(db.String(45), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    confidence_threshold = db.Column(db.Float, nullable=False)
    schedule = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "id": str(self.id),
            "ip_address": str(self.ip_address),
            "location": self.location,
            "confidence_threshold": self.confidence_threshold,
            "schedule": self.schedule,
        }
