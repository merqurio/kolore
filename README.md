[![Stories in Ready](https://badge.waffle.io/ChromaBranding/kolore.png?label=ready&title=Ready)](https://waffle.io/ChromaBranding/kolore)
![ python ](http://img.shields.io/badge/python-v2.7-9cd5ee.svg)
![ Active ](http://img.shields.io/badge/Active-Development-aafca5.svg)
![ Not production ready ](http://img.shields.io/badge/Not+for-Proction-red.svg)
[![byChroma](http://img.shields.io/badge/by-Chroma-22f2b8.svg)](http://www.chromabranding.com)
## Kolore Content Manager

This is the content administrator that we use in [Chroma Branding][0]. Is written in Python for [App Engine][1]. Right now is just a functional Blog CMS, but a page administrator, web settings and other stuff will be added soon ! 

![ Dashboard Preview ](http://lh6.ggpht.com/UpDBa0WRxeYDhuG3wXLmtZGOG6FQDmR3eSpfBBDXpUGlycZnRv9wRZboT1Hwv51LmLAFeQUvJTAu91Gt1TT7gORBU18u=s1200)

##### Services
- [Google App Engine][1]
    - [Images API][8]
    - [Blobstore API][9]
- [Google Datastore NDB][10]
- [Google Cloud Storage][11]

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
App Engine Dependencies must be install and uploaded with your app. The configuration to include the libraries is done in the `appengine_config.py` file. `lib` subdirectory is added as a site packages directory. Yo must have Google Cloud SDK installed in order to run it locally.

##### Install the dependencies inside a lib folder
`pip install -r static/requirements.txt -t lib/` to install these dependencies in `lib/` subdirectory from terminal in the root directory.

### Babel Commands
Babel is an extension to Flask that adds i18n and l10n support to any Flask application. We use [POeditor][7] for managing the languages. English is the main language and actually 100% translated to Spanish and Basque.

##### Extract all terms to translate
`pybabel extract -F babel.cfg -o messages.pot .`

##### Start a language
`pybabel init -i messages.pot -d translations -l 'es'`

##### Compile all translations
Once you have a `.po` file withe the translations, thode must be compiled to `.mo`
`pybabel compile -d translations`


### App Engine Commands

##### Start the server
In the root directory
`dev_appserver.py .`

##### Deploy to the server
Remember to change also the `app.yaml`file with project-id.
`appcfg.py -A PROJECT-ID --oauth2 update .`


### Bower
Bower is used to install all the front-end dependencies inside `app/admin/static/plugins/`

##### Install dependencies
``bower install`` at root directory an they wil be automatically placed.



[0]: http://www.chromabranding.com
[1]: https://cloud.google.com
[2]: https://www.python.org/
[3]: https://flask.pocoo.org
[4]: https://pythonhosted.org/Flask-Babel/
[5]: http://jinja.pocoo.org/
[6]: http://bower.io
[7]: https://poeditor.com
[8]: https://cloud.google.com/appengine/docs/python/images/
[9]: https://cloud.google.com/appengine/docs/python/blobstore/
[10]: https://cloud.google.com/appengine/docs/python/ndb/
[11]: https://cloud.google.com/storage/

