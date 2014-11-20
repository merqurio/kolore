# Imports
# ----------------------------------------------------------------
from google.appengine.ext import ndb


# User Model
# ----------------------------------------------------------------
class User(ndb.Model):
    name = ndb.StringProperty()
    email = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)
    user = ndb.UserProperty(required=True)

    @classmethod
    def query_all(cls):
        '''It creates a list with all the user objects'''
        users = cls.query()
        users_list = []
        for user in users:
            users_list.append(user.email)
        return users_list
