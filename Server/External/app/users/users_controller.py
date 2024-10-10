from app.models import *
from flask import jsonify
from ..auth.auth_db_mock import users_db
from .users_service import UserService

#will request entered data, tries the calls and returns the results

class UserController:

    def get_users():
        return UserService.get_users()

    
    def get_user_by_id(user_id):
        return UserService.get_user_by_id(user_id)
    
#    def create_user(username, password, role):             #Is this gonna be in auth or user???
#        if not username or not password or not role:
#            return jsonify({"msg": "Missing fields"}), 400
#
#        if username in users_db:
#            return jsonify({"msg": "User already exists"}), 409
#
#        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
#        users_db[username] = {
#        "password_hash": password_hash,
#        "role": role
#        }
#        # add logic to add user to database
#        return jsonify({"msg": "User created successfully"}), 201
    
    def update_user_by_id(user_id):
        return UserService.update_user_by_id(user_id)
    
    def delete_user_by_id(user_id):
        return UserService.delete_user_by_id(user_id)
    