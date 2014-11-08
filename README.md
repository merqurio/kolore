## Kolore Content Manager
[![Stories in Ready](https://badge.waffle.io/ChromaBranding/kolore.png?label=ready&title=Ready)](https://waffle.io/ChromaBranding/kolore)
![ Version ](http://img.shields.io/badge/v-0.2-2af985.svg)
[![Gitter](http://img.shields.io/badge/Join-Chat-07e96a.svg)](https://gitter.im/ChromaBranding/kolore?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![ Not production ready ](http://img.shields.io/badge/Not%20for-Production-red.svg)
[![byChroma](http://img.shields.io/badge/by-Chroma-22f2b8.svg)](http://www.chromabranding.com)


**Kolore** is a content management system. It has been created to develop websites fast and efficiently for [Chroma Branding][0]. Is written in Python for [App Engine][1]. Right now is just a functional Blog CMS. More to come soon.

![ Dashboard Preview ](http://lh6.ggpht.com/UpDBa0WRxeYDhuG3wXLmtZGOG6FQDmR3eSpfBBDXpUGlycZnRv9wRZboT1Hwv51LmLAFeQUvJTAu91Gt1TT7gORBU18u=s1200)


---

# Docs

1. [What & How](#1)
2. [Installing Dependencies](#2)
3. [Useful commands](#3)

<a name="1"></a>
## [What & How](#1)

The CMS is a [Flask][3] app with [Jinja2][5] and [Flask-Babel][4] running on top of Google's *App Engine* Servers. It uses *NDB Datastore* as database wich automates cache for you. The files are uploaded to the *Cloud Storage* and served from there. Got lost ? See the graphic below:

![ Esquema ](http://lh6.ggpht.com/iHK8rVXY-GWuef-V8kFWjhUtgKfT_dhxWykUnbXO2i4a2bkcy_Izy-ts0g9DSEvtP5TihJ3iY4aJD72AIMkni9ljcYk=s1200)

##### So what's so amazing about this ?
*You don't have to pay anything until your website has lots of visitors.* You just need to start a project in the [Google's Developer Console][13] to upload your instance of **Kolore**. Plus you have a lot of freedom for customazing and you don't have to worry about scale problems.

##### What makes it different ?
We focus in the users. We want to make web management easy for our customers. 

##### I don't mind about this stuff, I just want to create a web fast. 
**Soon** you will find all the info you need to create a template, place it and start running.


##### Languages
- [Python][2]
- JS & CSS

##### Dependencies
- [Flask][3]
- [Babel][12]
- [Jinja2][5]
- [Bower][6] & Front-end dependencies

##### Google Cloud Services
- [Google App Engine][1]
    - [Images API][8]
    - [Blobstore API][9]
- [Google Datastore NDB][10]
- [Google Cloud Storage][11]

---
<a name="2"></a>
## [Installing Dependencies](#2)

### Python Dependencies
Dependencies must be installed and uploaded within your app. The configuration to include the libraries in App Engine's python is done in the `appengine_config.py` file. A `lib` subdirectory is added as a site packages directory. Remember ! you must have Google Cloud SDK installed in order to run it locally.

##### Install the dependencies inside a lib folder
`pip install -r static/requirements.txt -t lib/` to install these dependencies in `lib/` subdirectory from terminal in the root directory.

### Bower
[Bower][6] is used to install all the front-end dependencies inside `app/admin/static/plugins/`

##### Install dependencies
``bower install`` at root directory an they wil be automatically placed.

---
<a name="3"></a>
## [Useful commands](#3)

### App Engine Commands

##### Start the server
In the root directory of the app run in your terminal<br>
`dev_appserver.py .`

##### Deploy to the server
Remember to change also the `app.yaml`file with project-id.<br>
`appcfg.py -A PROJECT-ID --oauth2 update .`

### Babel Commands
[Babel][12] is an internationalization library for Python. We use [Flask-Babel][4] an extension to Flask that adds i18n and l10n support to any Flask application. We use [POeditor][7] for managing the languages. English is the main language and actually 100% translated to Spanish and Basque.

##### Extract all terms to translate
`pybabel extract -F babel.cfg -o messages.pot .`

##### Start a language
`pybabel init -i messages.pot -d translations -l 'es'`

##### Compile all translations
Once you have a `.po` file withe the translations, thode must be compiled to `.mo`
`pybabel compile -d translations`








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
[12]: babel.pocoo.org
[13]: https://console.developers.google.com/project
