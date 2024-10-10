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
            return jsonify({"username": user.username, "email": user.email}), 200
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
        data = request.json
        user = UserService.get_user_by_id(user_id)
        updated = UserService.update_user(user, data)
        if updated:
            return jsonify({"message": "User updated"}), 200
        return jsonify({"message": "User not found"}), 404

    
    def delete_user(user_id):
        deleted = UserService.delete_user(user_id)
        if deleted:
            return jsonify({"message": "User deleted"}), 200
        return jsonify({"message": "User not found"}), 404