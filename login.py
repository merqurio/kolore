# import dependencies
import admins
from functools import wraps
from google.appengine.api import users
from flask import redirect, request
from main import app


# Set's the login to Google Users Service
def login_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not users.get_current_user():
            return redirect(users.create_login_url(request.url))
        else:
            user = users.get_current_user()
            if user.email() in admins.USERS:
                return func(*args, **kwargs)
            else:
                return 'Trampak iten, ezta ? Email; info@chromabranding.com'
    return decorated_view


# Creates a logout page
@app.route('/logout')
def logout():
    return redirect(users.create_logout_url('/'))
