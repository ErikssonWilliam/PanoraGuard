#move logic here
from app.models import *
from flask import jsonify
from ..mock_data import *
from ..database import db

class UserService:

    session = db.session

    def get_users():
       return User.query.all()
    
    def get_user_by_id(user_id): 
        return User.query.filter_by(id=user_id).first()
        
    def create_user(username, password_hash, role, email):
       new_user = User(
            username=username,
            password_hash=password_hash, #encrypt
            role=role,
            email=email
        )
       session.add(new_user)
       session.commit()
       return new_user
        
    def update_user(user, data):
            if data.get('username'):
                user.username = data.get('username')
            if data.get('email'):
                user.email = data.get('email')
            if data.get('role'):
                user.role = data.get('role')
            session.commit()
            return user

    def delete_user(user_id):
        user = User.query.get(user_id)
        if user:
            session.delete(user)
            session.commit()
            return True
        return False