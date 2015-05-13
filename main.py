# Import the Flask Framework
# ----------------------------------------------------------------
from flask import Flask, request, redirect, url_for, g

# Import dependencies
# ----------------------------------------------------------------
from flask.ext.babel import Babel
from google.appengine.api import users

# Import Blueprints
# ----------------------------------------------------------------
from app.admin.controllers import admin_app
from app.front.controllers import front_app

# Start Flask
# ----------------------------------------------------------------
# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.
app = Flask(__name__)

# Babel Config
# ----------------------------------------------------------------
babel = Babel(app)
app.config['BABEL_DEFAULT_LOCALE'] = 'en'
LANGUAGES = {
    'en': 'English',
    'es': 'Espanol',
    'eu': 'Euskera'
}

# Register Blueprints
# ----------------------------------------------------------------
app.register_blueprint(admin_app, url_prefix='/admin')
app.register_blueprint(front_app, url_prefix='')


# Language selector (Default)
# ----------------------------------------------------------------
@babel.localeselector
def get_locale():
    if not request.cookies.get('lang'):
        return 'en'
    else:
        return request.cookies.get('lang')


# Jinja2 functions
# ----------------------------------------------------------------

def url_for_other_page(page):
    args = request.view_args.copy()
    args['page'] = page
    return url_for(request.endpoint, **args)


app.jinja_env.globals['url_for_other_page'] = url_for_other_page


# Deferred Request Callbacks
# ----------------------------------------------------------------
def after_this_request(f):
    if not hasattr(g, 'after_request_callbacks'):
        g.after_request_callbacks = []
    g.after_request_callbacks.append(f)
    return f

@app.after_request
def call_after_request_callbacks(response):
    for callback in getattr(g, 'after_request_callbacks', ()):
        callback(response)
    return response

# Set a language cookie
@app.before_request
def detect_user_language():
    language = request.cookies.get('lang')
    if language is None:
        language = "en"
        @after_this_request
        def remember_language(response):
            response.set_cookie('lang', language)
    g.language = language


# Global routes
# ----------------------------------------------------------------
@app.route('/ADMIN')
def admin_redirect():
    return redirect(url_for('admin.home'))


# Creates a logout page
@app.route('/logout')
def logout():
    return redirect(users.create_logout_url('/'))


@app.errorhandler(400)  # Bad Request
@app.errorhandler(401)  # Unauthorized
@app.errorhandler(403)  # Forbidden
@app.errorhandler(404)  # Not Found
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL. Error{}'.format(e), 404


@app.errorhandler(500)
def page_not_founds(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500

