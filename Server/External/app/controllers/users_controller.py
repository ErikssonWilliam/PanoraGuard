from app.models import User

class UserController:
    def get_all_users():
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