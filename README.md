## Kolore Content Manager

This is the content administrator that we use in [Chroma Branding][0]. Is written in Python for [App Engine][1]. Right now is just a functional Blog CMS, but a page administrator, web settings and other stuff will be added soon ! 

![ Dashboard Preview ](http://lh6.ggpht.com/UpDBa0WRxeYDhuG3wXLmtZGOG6FQDmR3eSpfBBDXpUGlycZnRv9wRZboT1Hwv51LmLAFeQUvJTAu91Gt1TT7gORBU18u=s1200)

##### Services
- Google App Engine
    - Images API
    - Blobstore API
- Google Datastore
- Google Cloud Storage

##### Languages
- [Python][2]
- JS & CSS

##### Dependencies & resources
- [Flask Framework][3]
- [Babel][4]
- [Jinja2][5]
- [Bower][6]

---

## Docs

### Python Dependencies
App Engine Dependencies must be install and uploaded with your app. The configuration to include the libraries is done in the `appengine_config.py` file. `lib` subdirectory is added as a site packages directory.

##### Install the dependencies inside a lib folder
`pip install -r requirements.txt -t lib/` to install these dependencies in `lib/` subdirectory.

### Babel Commands
We use [POeditor][7] for managing the languages. 

##### Extract all terms
`pybabel extract -F babel.cfg -o messages.pot .`

##### Start a language
`pybabel init -i messages.pot -d translations -l 'es'`

##### Compile all translations
`pybabel compile -d translations`


### App Engine Commands

##### Start the server
`dev_appserver.py .`

##### Deploy to the server
`appcfg.py -A PROJECT-ID --oauth2 update .`


### Bower
Bower is used to install all the front-end dependencies inside `app/admin/static/plugins/`

##### Install dependencies
``bower install`` at root



[0]: http://www.chromabranding.com
[1]: https://cloud.google.com
[2]: https://www.python.org/
[3]: https://flask.pocoo.org
[4]: https://pythonhosted.org/Flask-Babel/
[5]: http://jinja.pocoo.org/
[6]: http://bower.io
[7]: https://poeditor.com
