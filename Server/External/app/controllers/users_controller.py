from app.models import User
from flask import jsonify

#implement the commented out lines and remove the current mock return values when database is running and connected in models

class UserController:
    def get_all_users():
#        users = User.query.all() #query database for all users
#        return [{
#            'id': user.id,
#            'username': user.username,
#           'email': user.email,
#           'role': user.role,
#            'created_at': user.created_at
#        } for user in users]
        return jsonify({"message": "all users retrieved"})
    
    def get_user_by_id(user_id):
#        user = User.query.get(user_id) #query database for user by id
#        if user:
#            return {
#                'id': user.id,
#                'username': user.username,
#                'email': user.email,
#                'role': user.role,
#                'created_at': user.created_at
#            }
#        else:
#            return None
        return jsonify({"user_id": str(user_id)})
    
    def register_user():
        return jsonify({"message": "user registered"}) # switch for registration logic here
    
    def update_user_by_id(user_id):
        return jsonify({"message": "user updated"}) # switch for update logic here
    
    def delete_user_by_id(user_id):
        return jsonify({"message": "user deleted"}) # switch for deletion logic here
    