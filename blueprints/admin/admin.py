# Imports
# ----------------------------------------------------------------
import time
import logging
from login import login_required
from google.appengine.api import users
from google.appengine.ext import ndb, blobstore
from google.appengine.api.images import get_serving_url
from werkzeug import parse_options_header
from flask import (Blueprint, render_template, make_response, request,
                   redirect, url_for, jsonify)

# Models
# ----------------------------------------------------------------

from blueprints.admin.models import BlogPost, BlogCategory

# Config
# ----------------------------------------------------------------

admin_blueprint = Blueprint('admin', __name__, template_folder='templates')
BUCKET_NAME = "chroma-dev"


# Controllers
# ----------------------------------------------------------------

@admin_blueprint.route('/')
@login_required
def home():
    user = users.get_current_user()
    return render_template('home.html', user=user.nickname())

# /// Pages ///


@admin_blueprint.route('/pages')
@login_required
def pages():
    return render_template('viewPages.html')


# /// Posts ///

@admin_blueprint.route('/posts', methods=['GET', 'POST'])
@login_required
def posts():
    ''' Renders all posts'''
    if request.method == 'POST':

        # Get the Key, and delete() the object using Key (mandatory)
        ndb.Key('BlogPost', int(request.form['post_id'])).delete()
        time.sleep(1)

    return render_template('viewPosts.html', posts=BlogPost.query())


@admin_blueprint.route('/addPost', methods=['GET', 'POST'])
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
    upload_url = blobstore.create_upload_url('/upload',
                                             gs_bucket_name=BUCKET_NAME)
    return render_template('addPost.html',
                           categories=BlogCategory.query_all(),
                           upload_url=upload_url)


@admin_blueprint.route('/upload', methods=['POST'])
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
                files = []
                the_file = {}
                the_file['name'] = file.filename
                the_file['file'] = get_serving_url(blob_key)
                files.admin_blueprintend(the_file)
                return jsonify({"file": the_file['file']})
            except Exception as e:
                logging.exception(e)
                return jsonify({"success": False})


@admin_blueprint.route("/img/<bkey>")
def img(bkey):
    blob_info = blobstore.get(bkey)
    response = make_response(blob_info.open().read())
    response.headers['Content-Type'] = blob_info.content_type
    return response


@admin_blueprint.route('/post/edit/<int:post_id>', methods=['GET', 'POST'])
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


# /// Categories ///

@admin_blueprint.route('/categories', methods=['GET', 'POST'])
@login_required
def categories():
    ''' Renders all categories'''
    if request.method == 'POST':
        post_categories = request.form['categories'].split(",")
        BlogCategory.add_categories(post_categories)
        time.sleep(1)

    return render_template('viewCategories.html',
                           categories=BlogCategory.query())


@admin_blueprint.route('/categories/edit/<int:cat_id>',
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
