# Imports
# ----------------------------------------------------------------
import time
import logging
from functions import clean_url, admin_login_required
from google.appengine.api import users
from google.appengine.ext import ndb, blobstore
from google.appengine.api.images import get_serving_url
from google.appengine.api.app_identity import get_default_gcs_bucket_name
from werkzeug import parse_options_header
from flask import (Blueprint, render_template, make_response, request,
                   redirect, url_for, jsonify)

# Models
# ----------------------------------------------------------------

from app.admin.models import BlogPost, BlogCategory, User

# Config
# ----------------------------------------------------------------

admin_app = Blueprint('admin', __name__,
                      template_folder='templates',
                      static_folder='static')
BUCKET_NAME = get_default_gcs_bucket_name()
IMG_SIZE = 1200


# Controllers /// General ///
# ----------------------------------------------------------------

@admin_app.route('/')
@admin_login_required
def home():
    current_user = users.get_current_user()
    db_user = User.query(User.email == current_user.email()).get()
    return render_template('admin-home.html', user=db_user)


@admin_app.route('/options', methods=['GET', 'POST'])
@admin_login_required
def options():
    current_user = users.get_current_user()
    db_user = User.query(User.email == current_user.email()).get()
    if request.method == 'POST':
        db_user.name = request.form['user_name']
        db_user.put()

    return render_template('admin-options.html', user=db_user)


# Controllers /// Posts ///
# ----------------------------------------------------------------

@admin_app.route('/posts', methods=['GET', 'POST'])
@admin_login_required
def posts():
    """ Renders all posts"""
    if request.method == 'POST':
        post = request.get_json()
        # Get the Key, and delete() the object using Key (mandatory)
        ndb.Key('BlogPost', int(post['post_id'])).delete()
        return "true"

    all_posts = BlogPost.query().order(-BlogPost.date).fetch(5)
    plus = True
    if len(all_posts) < 5:
        plus = False
    return render_template('admin-posts.html',
                           posts=all_posts, plus=plus)


@admin_app.route('/posts/<int:page_num>', methods=['GET', 'POST'])
@admin_login_required
def more_posts(page_num):
    offset = int(page_num * 5)
    return render_template('posts-view-more.html',
                           posts=BlogPost.query()
                           .order(-BlogPost.date)
                           .fetch(5, offset=offset))


@admin_app.route('/posts/add', methods=['GET', 'POST'])
@admin_login_required
def add_post():
    """Creates a new post in the DB"""
    if request.method == 'POST':
        # Create New Blog Post Object
        blog_post = BlogPost(title=request.form['title'],
                             text=request.form['text'],
                             author=users.get_current_user(),
                             url=clean_url(request.form['title']))

        # Create New Blog Post Categories
        post_categories = request.form['categories'].split(",")
        blog_post.categories = BlogCategory.add_categories(post_categories)

        # Save the new post
        blog_post.put()

        # Redirect
        time.sleep(1)
        return redirect(url_for('admin.posts'))

    # GET
    return render_template('admin-posts-add.html',
                           categories=BlogCategory.query_all())


@admin_app.route('/posts/edit/<int:post_id>', methods=['GET', 'POST'])
@admin_login_required
def edit_post(post_id):
    """Edit posts"""
    if request.method == 'POST':
        # Retrieve the object
        blog_post = ndb.Key('BlogPost', int(post_id)).get()

        # Update the values
        blog_post.title = request.form['title']
        blog_post.text = request.form['text']
        post_categories = request.form['categories'].split(",")
        blog_post.categories = BlogCategory.add_categories(post_categories)

        # Save the new post
        blog_post.put()

        # Redirect
        time.sleep(1)
        return redirect(url_for('admin.posts'))

    return render_template('admin-posts-edit.html',
                           post=ndb.Key('BlogPost', int(post_id)).get(),
                           categories=BlogCategory.query_all())


# Controllers /// Categories ///
# ----------------------------------------------------------------

@admin_app.route('/categories', methods=['GET', 'POST'])
@admin_login_required
def categories():
    """ Renders all categories """
    if request.method == 'POST':
        post_categories = request.form['categories'].split(",")
        BlogCategory.add_categories(post_categories)
        time.sleep(1)

    return render_template('admin-categories.html',
                           categories=BlogCategory.query().fetch())


@admin_app.route('/categories/edit/<int:cat_id>',
                 methods=['GET', 'POST'])
@admin_login_required
def edit_category(cat_id):
    """ Edit a category"""
    edit_cat = ndb.Key(BlogCategory, int(cat_id))

    if request.method == 'POST':
        if request.form["action"] == "save":
            category = edit_cat.get()
            category.name = request.form['name']
            category.put()
            time.sleep(1)
            return redirect(url_for('admin.categories'))

        elif request.form["action"] == "delete":
            BlogCategory.update_posts_categories(edit_cat.get())
            edit_cat.delete()
            time.sleep(1)
            return redirect(url_for('admin.categories'))

        else:
            pass

    return render_template('admin-categories-edit.html',
                           categories=BlogCategory.query().fetch(),
                           edit_cat=edit_cat.get())


# Controllers /// Uploads ///
# ----------------------------------------------------------------
@admin_app.route('/file_serve/<blob_key>')
def file_serve(blob_key):
    blob_info = blobstore.get(blob_key)
    response = make_response(blob_info.open().read())
    response.headers['Content-Type'] = blob_info.content_type
    return response


@admin_app.route('/upload_url')
def upload_url():
    upload_url_string = blobstore.create_upload_url('/admin/upload',
                                                    gs_bucket_name=BUCKET_NAME)
    return upload_url_string


@admin_app.route('/upload', methods=['PUT', 'POST'])
@admin_login_required
def upload():
    if request.method == 'POST':
        request_file = request.files['file']
        # Creates the options for the file
        header = request_file.headers['Content-Type']
        parsed_header = parse_options_header(header)

        # IF everything is OK, save the file
        if request_file:
            try:
                blob_key = parsed_header[1]['blob-key']
                return jsonify({"filelink": "/admin/file_serve/" + blob_key})
            except Exception as e:
                logging.exception(e)
                return jsonify({"error": e})
