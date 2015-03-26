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
        """It creates a list with all the user objects"""
        users = cls.query()
        users_list = []
        for user in users:
            users_list.append(user.email)
        return users_list


# Blogs's Models
# ----------------------------------------------------------------
class BlogPost(ndb.Model):
    title = ndb.StringProperty()
    text = ndb.TextProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)
    categories = ndb.KeyProperty(repeated=True)
    url = ndb.StringProperty()
    author = ndb.UserProperty()

    def get_categories(self):
        """Returns a string list of post's categories"""
        categories_list = []
        for category in self.categories:
            categories_list.append(category.get().name)
        return categories_list


class BlogCategory(ndb.Model):
    name = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def query_all(cls):
        """It creates a list with all the categories objects"""
        categories = cls.query()
        category_list = []
        for category in categories:
            category_list.append(category.name)
        return category_list

    @staticmethod
    def add_categories(form_categories):
        """Looks for exisiting categories Keys and creates new
        categories if not found. Returns a list of those keys."""
        list_of_categories = []
        for category in form_categories:
            if category in BlogCategory.query_all():
                cat = BlogCategory.query(BlogCategory.name == category).get()
                list_of_categories.append(cat.key)
            else:
                new_category = BlogCategory()
                new_category.name = category
                new_category.put()
                list_of_categories.append(new_category.key)
        return list_of_categories

    def update_posts_categories(self):
        for post in BlogPost.query():
            new_categories = []
            for category in post.categories:
                if category == self.key:
                    continue
                else:
                    new_categories.append(category)
            post.categories = new_categories
            post.put()
