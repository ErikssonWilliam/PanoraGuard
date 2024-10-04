from flask import jsonify, Blueprint
from ..controllers.users_controller import UserController

users_bp = Blueprint("users", __name__)

#implement the commented out lines and remove the current return values when database is running and connected in models

@users_bp.route('/', methods=['GET'])
def get_users():
 #   users = UserController.get_all_users()
 #   return jsonify(users), 200
 return 'getting all users'

@users_bp.route('/<string:user_id>', methods=['GET']) #replace string with uuid when implemented
def get_user(user_id):
 #   user = UserController.get_user_by_id(user_id)
 #   if user:
 #       return jsonify(user), 200
 #   else:
 #       return jsonify({'message': 'User not found'}), 404
 return jsonify({"user_id": str(user_id)})
    
