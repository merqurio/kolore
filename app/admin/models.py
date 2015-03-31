# Imports
# ----------------------------------------------------------------
from google.appengine.ext import ndb
from math import ceil


# User Model
# ----------------------------------------------------------------
class User(ndb.Model):
    """
    A reflect in the DB of the Users API
    Google console Admin users have always access
    """
    name = ndb.StringProperty()
    email = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    user = ndb.UserProperty()

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
    """
    Creates a post object
    """
    title = ndb.StringProperty()
    text = ndb.TextProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)
    categories = ndb.KeyProperty(repeated=True)
    url = ndb.StringProperty()
    author = ndb.UserProperty()

    @classmethod
    def get_urls(cls):
        """
        Returns a list of actual urls
        """
        posts = cls.query()
        urls_list = []
        for post in posts:
            urls_list.append(post.url)
        return urls_list

    def get_categories(self):
        """
        Returns a string list of post's categories
        """
        categories_list = []
        for category in self.categories:
            categories_list.append(category.get().name)
        return categories_list


class BlogCategory(ndb.Model):
    """
    The Categories for the blog posts
    """
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
        """
        Looks for exisiting categories Keys and creates new
        categories if not found. Returns a list of those keys
        """
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


# Image Model
# ----------------------------------------------------------------
class ImageReference(ndb.Model):
    """
    Creates a reference to a GCS Blob, with the necessary information to avoid a transaction
    """
    filename = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)
    url = ndb.StringProperty()
    gallery = ndb.StringProperty()
    thumb = ndb.StringProperty()
    blob = ndb.BlobKeyProperty()
    height = ndb.IntegerProperty()
    width = ndb.IntegerProperty()


# Pagination model
# ----------------------------------------------------------------

class Pagination(object):
    """
    Creates a pagination object to populate a pagination HTML
    """
    def __init__(self, page, per_page, total_count):
        self.page = page
        self.per_page = per_page
        self.total_count = total_count

    @property
    def pages(self):
        return int(ceil(self.total_count / float(self.per_page)))

    @property
    def has_prev(self):
        return self.page > 1

    @property
    def has_next(self):
        return self.page < self.pages

    def iter_pages(self, left_edge=2, left_current=2,
                   right_current=5, right_edge=2):
        last = 0
        for num in xrange(1, self.pages + 1):
            if num <= left_edge or (num > self.page - left_current - 1 and num < self.page + right_current) or num > self.pages - right_edge:
                if last + 1 != num:
                    yield None
                yield num
                last = num