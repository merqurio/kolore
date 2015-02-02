# Import dependencies
# ----------------------------------------------------------------
import admins
from functools import wraps
from google.appengine.api import users
from flask import redirect, request
from app.login.models import User


# Set's the login to Google Users Service
# ----------------------------------------------------------------
def login_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        # Checks if the user is logged in
        if not users.get_current_user():
            return redirect(users.create_login_url(request.url))
        else:
            user = users.get_current_user()
            # Security Layer
            if user.email() in admins.USERS:
                # DB User model check
                if user.email() in User.query_all():
                    return func(*args, **kwargs)
                else:
                    new_user = User(user=user, email=user.email(),
                                    name=user.nickname())
                    new_user.put()
                    return func(*args, **kwargs)
            # If not in permited users
            else:
                return '''This user is not in the system.
                 try to logout and login with a correct user (email).'''
    return decorated_view

