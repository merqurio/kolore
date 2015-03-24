# Imports
# ----------------------------------------------------------------
import re
from unicodedata import normalize
from functools import wraps
from google.appengine.api import users
from app.admin.models import User
from app.admin.users import USERS
from flask import request, redirect

PUNCTUATION = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')


# Clean Urls
# ----------------------------------------------------------------
def clean_url(text, delim=u'-'):
    """Generates an ASCII-only slug."""
    result = []
    for word in PUNCTUATION.split(text.lower()):
        word = normalize('NFKD', word).encode('ascii', 'ignore')
        if word:
            result.append(word)
    return unicode(delim.join(result))


# Google Login Service wrap
# ----------------------------------------------------------------
def admin_login_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        # Checks if the user is logged in
        if not users.get_current_user():
            return redirect(users.create_login_url(request.url))
        else:
            user = users.get_current_user()
            # Security Layer
            if user.email() in USERS:
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
                return '''Sorry but this user, is not in our system.'''
    return decorated_view
