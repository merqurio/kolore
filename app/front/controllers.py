# Imports
# ----------------------------------------------------------------
from flask import Blueprint, render_template, make_response, request, url_for
from google.appengine.ext.ndb import stats

# Models
# ----------------------------------------------------------------
from app.admin.models import BlogPost
from app.front.models import Pagination

# Config
# ----------------------------------------------------------------

front_app = Blueprint('front', __name__, template_folder='templates',
                      static_folder='static',
                      static_url_path='/app/front/static')

POSTS_PER_PAGE = 2

# Controllers
# ----------------------------------------------------------------

@front_app.route('/', defaults={'page': 1})
@front_app.route('/page/<int:page>')
def home(page):
    offset = (page-1)*POSTS_PER_PAGE
    q = BlogPost.query().order(-BlogPost.date)
    posts = q.fetch(POSTS_PER_PAGE, offset=offset)
    all_posts = len(q.fetch())
    pagination = Pagination(page, POSTS_PER_PAGE, all_posts)
    response = make_response(render_template('front-index.html', posts=posts, pagination=pagination))
    return response


@front_app.route('/blog/<post_url>')
def post(post_url):
    post = BlogPost.query(BlogPost.url == post_url).get()
    return render_template('front-post.html',
                           post=post)
