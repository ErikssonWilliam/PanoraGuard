#move logic here
from app.models import *
from flask import jsonify
from ..mock_data import *
from ..database import db

class UserService:

    session = db.session

    def get_users():
       return User.query.all()
    
    def get_user_by_uname(uname): 
        return User.query.filter_by(username=uname).first()
        
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
        
    def update_user(self, user_id, username=None, email=None, role=None):
        user = self.get_user_by_id(user_id)
        if user:
            if username:
                user.username = username
            if email:
                user.email = email
            if role:
                user.role = role
            self.db_session.commit()
            return user
        return None

    def delete_user(self, user_id):
#        user = self.get_user_by_id(user_id)
        user = User.query.delete(user_id)
        if user:
            self.db_session.delete(user)
            self.db_session.commit()
            return True
        return False