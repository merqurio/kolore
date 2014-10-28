# Imports
# ----------------------------------------------------------------
import time
import logging
from login import login_required
from google.appengine.api import users
from google.appengine.ext import ndb, blobstore
from google.appengine.api.images import get_serving_url
from google.appengine.api.app_identity import get_default_gcs_bucket_name
from werkzeug import parse_options_header
from flask import (Blueprint, render_template, make_response, request,
                   redirect, url_for, jsonify)

# Models
# ----------------------------------------------------------------

from app.admin.models import BlogPost, BlogCategory

# Config
# ----------------------------------------------------------------

admin_app = Blueprint('admin', __name__, template_folder='templates')
BUCKET_NAME = get_default_gcs_bucket_name()
IMG_SIZE = 1200


# Controllers
# ----------------------------------------------------------------

@admin_app.route('/')
@login_required
def home():
    user = users.get_current_user()
    name = user.nickname().split('@')[0].title()
    return render_template('home.html', user=name)

# /// Pages ///


@admin_app.route('/pages')
@login_required
def pages():
    return render_template('viewPages.html')


# /// Posts ///

@admin_app.route('/posts', methods=['GET', 'POST'])
@login_required
def posts():
    ''' Renders all posts'''
    if request.method == 'POST':

        # Get the Key, and delete() the object using Key (mandatory)
        ndb.Key('BlogPost', int(request.form['post_id'])).delete()
        time.sleep(1)

    return render_template('viewPosts.html', posts=BlogPost.query())


@admin_app.route('/addPost', methods=['GET', 'POST'])
@login_required
def addPost():
    '''Creates a new post in the DB'''
    if request.method == 'POST':

        # Create New Blog Post Object
        blog_post = BlogPost(title=request.form['title'],
                             text=request.form['text'],
                             author=users.get_current_user())

        # Create New Blog Post Categories
        post_categories = request.form['categories'].split(",")
        blog_post.categories = BlogCategory.add_categories(post_categories)

        # Save the new post
        blog_post.put()

        # Redirect
        time.sleep(1)
        return redirect(url_for('admin.posts'))

    # GET
    return render_template('addPost.html',
                           categories=BlogCategory.query_all())


@admin_app.route('/post/edit/<int:post_id>', methods=['GET', 'POST'])
@login_required
def edit_post(post_id):
    '''Edit posts'''
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

    return render_template('editPost.html',
                           post=ndb.Key('BlogPost', int(post_id)).get(),
                           categories=BlogCategory.query_all())


# /// Images ///

@admin_app.route('/upload_url')
def upload_url():
    upload_url = blobstore.create_upload_url('/admin/upload',
                                             gs_bucket_name=BUCKET_NAME)
    return jsonify({"url": upload_url})


@admin_app.route('/upload', methods=['POST'])
@login_required
def upload():
    if request.method == 'POST':
        file = request.files['file']
        # Creates the options for the file
        header = file.headers['Content-Type']
        parsed_header = parse_options_header(header)

        # IF everything is OK, save the file
        if file:
            try:
                blob_key = parsed_header[1]['blob-key']
                return get_serving_url(blob_key, size=IMG_SIZE)
            except Exception as e:
                logging.exception(e)
                return 'http://placehold.it/500&text="No :("'
        else:
            logging.exception('Not file, mate :(')


@admin_app.route("/img/<bkey>")
def img(bkey):
    blob_info = blobstore.get(bkey)
    response = make_response(blob_info.open().read())
    response.headers['Content-Type'] = blob_info.content_type
    return response


# /// Categories ///

@admin_app.route('/categories', methods=['GET', 'POST'])
@login_required
def categories():
    ''' Renders all categories'''
    if request.method == 'POST':
        post_categories = request.form['categories'].split(",")
        BlogCategory.add_categories(post_categories)
        time.sleep(1)

    return render_template('viewCategories.html',
                           categories=BlogCategory.query())


@admin_app.route('/categories/edit/<int:cat_id>',
                       methods=['GET', 'POST'])
@login_required
def edit_category(cat_id):
    ''' Renders all categories'''
    # Get the object to edit
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

    return render_template('editCategories.html',
                           categories=BlogCategory.query(),
                           edit_cat=edit_cat.get())
