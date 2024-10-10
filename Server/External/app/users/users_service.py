#move logic here
from app.models import *
from flask import jsonify

class UserService:

    def get_users():
       users = User.query.all() #query database for all users
       return [{
           'id': user.id,
           'username': user.username,
           'email': user.email,
           'role': user.role,
           'created_at': user.created_at
        } for user in users]
    
    def get_user_by_id(user_id): 
        user = User.query.get(user_id) #query database for user by id
        if user:
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'created_at': user.created_at
            }
        else:
            return None
        
    def update_user_by_id(user_id):
            return jsonify({"message": "user updated"}) # switch for update logic here

    def delete_user_by_id(user_id):
            return jsonify({"message": "user deleted"}) # switch for deletion logic here