# Imports
# ----------------------------------------------------------------
import logging
from time import sleep
from json import dumps
from functions import clean_url, admin_login_required
from google.appengine.api import users
from google.appengine.ext import ndb, blobstore
from google.appengine.api.images import get_serving_url, Image
from google.appengine.ext.blobstore import BlobInfo, blobstore
from google.appengine.api.app_identity import get_default_gcs_bucket_name
from werkzeug import parse_options_header
from flask import (Blueprint, render_template, make_response, request,
                   redirect, url_for, jsonify)

# Models
# ----------------------------------------------------------------

from app.admin.models import (BlogPost, BlogCategory, User,
                              Pagination, ImageReference)

# Config
# ----------------------------------------------------------------

admin_app = Blueprint('admin', __name__,
                      template_folder='templates',
                      static_folder='static')
BUCKET_NAME = get_default_gcs_bucket_name()
IMG_SIZE = 1200
IMAGES_PER_PAGE = 24
IMAGES_MIME = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/tiff']


# Controllers /// General ///
# ----------------------------------------------------------------

@admin_app.route('/')
@admin_login_required
def home():
    """
    Home route
    :return: admin-home.html
    """
    current_user = users.get_current_user()
    db_user = User.query(User.email == current_user.email()).get()
    return render_template('admin-home.html', user=db_user)


@admin_app.route('/options/', methods=['GET', 'POST'])
@admin_login_required
def options():
    """
    General settings
    GET --> admin-options.html
    POST & xhr --> delete sended user
    POST & form --> add or edit user
    """
    current_user = users.get_current_user()
    db_user = User.query(User.email == current_user.email()).get()
    if request.method == 'POST':

        if request.is_xhr:
            user = request.get_json()
            # Get the Key, and delete() the object using Key (mandatory)
            ndb.Key('User', int(user['objects'])).delete()
            return "true"

        if request.form["action"] == "user_save":
            db_user.name = request.form['user_name']
            db_user.put()

        if request.form["action"] == "user_new":
            mail = request.form['user_mail']
            if not User.query(User.email == mail).get():
                new_user = User(name=mail, email=mail)
                new_user.put()
                sleep(1)


    all_users = User().query().fetch()
    return render_template('admin-options.html', user=db_user, all_users=all_users)


# Controllers /// Posts ///
# ----------------------------------------------------------------

@admin_app.route('/posts/', methods=['GET', 'POST'])
@admin_login_required
def posts():
    """
    GET --> Main post list
    POST --> Delete post
    """
    if request.method == 'POST':
        post = request.get_json()
        # Get the Key, and delete() the object using Key (mandatory)
        ndb.Key('BlogPost', int(post['objects'])).delete()
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
    """
    :param page_num: The number of pages/posts
    :return: AJAX more posts
    """
    offset = int(page_num * 5)
    return render_template('admin-posts-more.html',
                           posts=BlogPost.query()
                           .order(-BlogPost.date)
                           .fetch(5, offset=offset))


@admin_app.route('/posts/add', methods=['GET', 'POST'])
@admin_login_required
def add_post():
    """
    Create a new post
    """
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
        sleep(1)
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
        sleep(1)
        return redirect(url_for('admin.posts'))

    return render_template('admin-posts-edit.html',
                           post=ndb.Key(BlogPost, int(post_id)).get(),
                           categories=BlogCategory.query_all())


# Controllers /// Categories ///
# ----------------------------------------------------------------

@admin_app.route('/categories/', methods=['GET', 'POST'])
@admin_login_required
def categories():
    """ Renders all categories """
    if request.method == 'POST':
        post_categories = request.form['categories'].split(",")
        BlogCategory.add_categories(post_categories)
        sleep(1)

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
            sleep(1)
            return redirect(url_for('admin.categories'))

        elif request.form["action"] == "delete":
            BlogCategory.update_posts_categories(edit_cat.get())
            edit_cat.delete()
            sleep(1)
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
    """
    Serves request file
    :param blob_key: The file blob key
    :return: File
    """
    blob_info = blobstore.get(blob_key)
    response = make_response(blob_info.open().read())
    response.headers['Content-Type'] = blob_info.content_type
    response.headers['Content-Disposition'] = 'attachment; filename = "' + blob_info.filename + '"'
    return response


@admin_app.route('/upload_url')
def upload_url():
    """
    Return a url to upload files GCS
    :return: str url
    """
    upload_url_string = blobstore.create_upload_url('/admin/upload',
                                                    gs_bucket_name=BUCKET_NAME)
    return upload_url_string


@admin_app.route('/upload', methods=['POST'])
@admin_login_required
def upload():
    """
    Endpoint after GCS upload
    :return: JSON --> filelink, filename, thumb
    """
    if request.method == 'POST':
        request_file = request.files['file']

        # Creates the options for the file
        header = request_file.headers['Content-Type']
        parsed_header = parse_options_header(header)

        # IF everything is OK, save the file
        if request_file:
            try:
                blob_key = parsed_header[1]['blob-key']
                blob_info = blobstore.get(blob_key)
                blob_key_object = blob_info._BlobInfo__key

                # Check if is image and save a reference
                if blob_info.content_type in IMAGES_MIME:
                    img = Image(image_data=blob_info.open().read())
                    img_url = '/admin/file_serve/'+blob_key
                    img_ref = ImageReference(filename=blob_info.filename,
                                             blob=blob_key_object,
                                             url=img_url,
                                             thumb=get_serving_url(blob_key_object, crop=True, size=200),
                                             height=img.height,
                                             width=img.width)
                    img_ref.put()
                return jsonify({"filelink": "/admin/file_serve/" + blob_key,
                                "filename": "" + blob_info.filename,
                                "thumb": get_serving_url(blob_key, crop=True, size=200)})
            except Exception as e:
                logging.exception(e)
                return jsonify({"error": e})


# Controllers /// Redactor Manager ///
# ----------------------------------------------------------------
@admin_app.route('/image_serve/')
def images_redactor():
    """
    Image manager of redactor
    :return: JSON with image objects list
    """
    images = ImageReference.query().order(-ImageReference.date)
    urls = []

    for img in images:
        urls.append({'thumb': img.thumb,
                     'image': img.url,
                     'title': img.filename})

    response = make_response(dumps(urls))
    response.mimetype = 'application/json'
    return response


# Controllers /// Image Manager ///
# ----------------------------------------------------------------

@admin_app.route('/images/', defaults={'page': 1}, methods=['GET', 'POST'])
@admin_app.route('/images/<int:page>', methods=['GET', 'POST'])
@admin_login_required
def image_manager(page):
    """
    GET --> The main image manager page
    POST --> Delete requested file(s)
    :param page: The requested page
    """
    if request.method == 'POST':
        img_ref_key = request.get_json()

        # Delete the img from ndb
        for img_ref in img_ref_key['objects'].split(','):
            img_inst = ndb.Key(ImageReference, int(img_ref))
            img = img_inst.get()
            blob_key = img.blob

            # Delete img and blob
            img_inst.delete()
            BlobInfo.get(blob_key).delete()

        sleep(1)
        return "true"

    offset = (page-1)*IMAGES_PER_PAGE
    images = ImageReference.query().order(-ImageReference.date)
    pagination = Pagination(page, IMAGES_PER_PAGE, images.count())
    query = images.fetch(IMAGES_PER_PAGE, offset=offset)

    return render_template('admin-manager-images.html',
                           keys=query,
                           pagination=pagination)


@admin_app.route('/images/add', methods=['GET', 'POST'])
@admin_login_required
def image_manager_add():
    return render_template('admin-manager-images-add.html')
