# Import the Flask Framework
from flask import Flask, render_template, request
app = Flask(__name__)
# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.

# Import dependencies
from flask.ext.babel import Babel

# Babel Config
babel = Babel(app)
app.config['BABEL_DEFAULT_LOCALE'] = 'en'
LANGUAGES = {
    'en': 'English',
    'es': 'Espanol',
    'eu': 'Euskera',
    'fr': 'Francais'
}


# Import Blueprints
from blueprints.admin.admin import admin_blueprint

# Register Blueprints
app.register_blueprint(admin_blueprint, url_prefix='/admin')


#Language selector
@babel.localeselector
def get_locale():
    if not request.cookies.get('lang'):
        return 'en'
    else:
        return request.cookies.get('lang')


# Main routes
@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return 'This is your code'


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return render_template('404.html')


@app.errorhandler(500)
def page_not_founds(e):
    """Return a custom 500 error."""
    return render_template('500.html')
