from app.models import *
from flask import jsonify, request
#from ..auth.auth_db_mock import users_db
from .users_service import UserService

#will request entered data, tries the calls and returns the results

class UserController:

    def get_users():
        users = UserService.get_users()
        return jsonify([{"username": u.username, "email": u.email} for u in users]), 200

    def get_user_by_id(user_id):
        user = UserService.get_user_by_id(user_id)
        if user:
            return jsonify(user), 200
        return jsonify({'error': 'User not found'}), 404

    
    def create_user():
        data=request.json
        new_user=UserService.create_user(
            username=data['username'],
            password_hash=data['password_hash'],
            role=data['role'],
            email=data['email']
            )
        return jsonify({"message": "User created", "user": str(new_user)}), 201
    
    def update_user(user_id):
        return UserService.update_user_by_id(user_id)
    
    def delete_user(user_id):
        deleted = UserService.delete_user(user_id)
        if deleted:
            return jsonify({"message": "User deleted"}), 200
        return jsonify({"message": "User not found"}), 404

    

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