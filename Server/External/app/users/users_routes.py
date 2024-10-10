from flask import Blueprint
from .users_controller import UserController

users_bp = Blueprint("users", __name__)

@users_bp.route('/create', methods=['POST']) # change method to POST and implement registration logic in controller
def create_user():
    return UserController.create_user()

@users_bp.route('/all', methods=['GET'])
def get_all_users():
    return UserController.get_users()

@users_bp.route('/<string:user_id>', methods=['PUT']) #change method to PUT and implement update logic in controller
def update_user(user_id):
    return UserController.update_user_by_id(user_id)

@users_bp.route('/<string:user_id>', methods=['DELETE']) #change method to DELETE and implement deletion logic in controller
def delete_user(user_id):
    return UserController.delete_user_by_id(user_id)

@users_bp.route('/<string:user_id>', methods=['GET']) # replace string with uuid when implemented
def get_user(user_id):
    return UserController.get_user_by_id(user_id)


 
    
