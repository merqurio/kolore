# Imports
# ----------------------------------------------------------------
from flask import Blueprint, render_template, make_response, request
from google.appengine.ext import ndb

# Models
# ----------------------------------------------------------------

from app.admin.models import BlogPost

# Config
# ----------------------------------------------------------------

front_app = Blueprint('front', __name__, template_folder='templates',
                      static_folder='static',
                      static_url_path='/app/front/static')


# Controllers
# ----------------------------------------------------------------

@front_app.route('/')
def home():
    posts = BlogPost.query().fetch()
    response = make_response(render_template('front-index.html', posts=posts))
    if not request.cookies.get('lang'):
        response.set_cookie('lang', value='en')
    return response
