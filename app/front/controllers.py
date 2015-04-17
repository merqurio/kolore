# Imports
# ----------------------------------------------------------------
from flask import (Blueprint, render_template, make_response, url_for)

# Models
# ----------------------------------------------------------------
from app.admin.models import BlogPost
from app.front.models import Pagination
from datetime import datetime
import main
import re

# Config
# ----------------------------------------------------------------

front_app = Blueprint('front', __name__, template_folder='templates',
                      static_folder='static',
                      static_url_path='/app/front/static')

POSTS_PER_PAGE = 2
LAST_UPDATE = datetime(2015, 04, 17, 17, 15, 30)


# Controllers
# ----------------------------------------------------------------
@front_app.route('/', defaults={'page': 1})
@front_app.route('/page/<int:page>')
def home(page):
    offset = (page - 1) * POSTS_PER_PAGE
    q = BlogPost.query().order(-BlogPost.date)
    posts = q.fetch(POSTS_PER_PAGE, offset=offset)
    all_posts = len(q.fetch())
    pagination = Pagination(page, POSTS_PER_PAGE, all_posts)
    response = make_response(render_template('front-index.html',
                                             posts=posts,
                                             pagination=pagination))
    return response


@front_app.route('/blog/<post_url>')
def post(post_url):
    single_post = BlogPost.query(BlogPost.url == post_url).get()
    return render_template('front-post.html',
                           post=single_post)


# Sitemap
# ----------------------------------------------------------------
@front_app.route('/sitemap.xml', methods=['GET'])
def sitemap():
    """Generate sitemap.xml. Makes a list of urls and date modified."""
    pages = [['/', LAST_UPDATE]]

    # static pages
    for rule in main.app.url_map.iter_rules():
        if "GET" in rule.methods and len(rule.arguments) == 0 and not re.match('(?:admin|static)', rule.endpoint):
            pages.append(
                [rule.rule, LAST_UPDATE]
            )

    # post model pages
    all_posts = BlogPost.query().order(-BlogPost.date).fetch()
    for single_post in all_posts:
        url = url_for('front.post', post_url=single_post.url)
        modified_time = single_post.date
        pages.append([url, modified_time])

    sitemap_xml = render_template('sitemap_template.xml', pages=pages)
    response = make_response(sitemap_xml)
    response.headers["Content-Type"] = "application/xml"

    return response
