## Kolore
[![Stories in Ready](https://badge.waffle.io/chroma-branding/kolore.png?label=ready&title=Work%20in%20progress)](https://waffle.io/chroma-branding/kolore)
![ Version ](http://img.shields.io/badge/v-0.3-2af985.svg)
![ Production ready ](http://img.shields.io/badge/Ready%20for-Production-2af985.svg)

**Kolore** is a content management system. It has been created to develop websites fast and efficiently for [Chroma Branding][0]. It's written in Python for the [Google App Engine][1]. Right now is just a Blog CMS.

![ Dashboard Preview ](http://lh4.ggpht.com/IBl90oZNQwVfnd1jnWcZObnrC3w7h9E-tgq6WITqBoCBC76SFuQY_y0FQHciEXpMKPX6NqQQtfUC1HR7zZYBAB8=s1200)

---

# Docs

1. [What & How](#1)
2. [Installing Dependencies](#2)
3. [Local testing](#3)
4. [Deploying](#4)
5. [Other commands](#5)

<a name="1"></a>
## [What & How](#1)

The CMS is a [Flask][3] app with [Jinja2][5] and [Flask-Babel][4] running on top of *Google App Engine* <span></span>ervers. It uses *NDB Datastore* as database wich automates the cache for you. The files are uploaded directly to the *Google Cloud Storage* and served from there. Got lost ? See the graphic below:

![ Architecture preview ](http://lh6.ggpht.com/iHK8rVXY-GWuef-V8kFWjhUtgKfT_dhxWykUnbXO2i4a2bkcy_Izy-ts0g9DSEvtP5TihJ3iY4aJD72AIMkni9ljcYk=s1200)

##### So what's so amazing about this ?
*You don't have to pay anything until your website has lots of visitors.* You just need to start a project in the [Google's Developer Console][13] to upload your instance of **Kolore**. Best of all ? you don't have to worry about scale problems.


##### I don't mind about this stuff, I just want to create a web fast. 
**Soon** you will find all the info you need to create a template, place it and start running.


##### Languages
- [Python][2]
- JS
- CSS

##### Back-end Dependencies
- [Flask][3]
- [Babel][12]
- [Jinja2][5]

##### Front-end Dependencies
- [Grunt][14]
- [Bower][6]
- [Kube][15]
- [Momentjs][16]
- [Quill][17]

##### Google Cloud Services
- [Google App Engine][1]
    - [Images API][8]
    - [Blobstore API][9]
- [Google Datastore NDB][10]
- [Google Cloud Storage][11]

---

<a name="2"></a>
## [Installing Dependencies](#2)

You can consider **Kolore** a unique Flask app, serving two websites. One is the CMS and the other one is the front website. That's the reason all the Python dependencies are located in the `/lib` directory, and the front-end dependencies on two different locations: `/app/admin/static/plugins` and `/app/front/static/plugins`.

### Python Dependencies
Dependencies must be installed and uploaded within your app. The configuration to include the libraries in App Engine's python is done in the `appengine_config.py` file. The `lib` subdirectory is added as a site packages directory.

Dependencies are managed using [pip][18] in the `lib/requirements.txt` file.

##### Install pip
Please, check the latest installation instructions [here][18].

##### Install the dependencies inside the lib folder
`pip install -r lib/requirements.txt -t lib/` to install these dependencies in `lib/` subdirectory from terminal in the root directory.

### Front-end Dependencies
[Bower][6] is used to install all the front-end dependencies inside `app/admin/static/plugins/` and `/app/front/static/plugins`. Then a [Grunt][14] configuration file can be found at `/app/front` and `/app/admin`to concatenate all the front-end files.

##### Install Node, NPM, Bower and Grunt
To install dependencies using Bower, you must first install [Node][19] and NPM. Check the installation instructions [here][19] and then:
```
npm install -g bower
npm install -g grunt
```

##### Install dependencies
Use this commands to finally install all the dependencies.
```bash
ex@Book:[~/kolore]$ cd app/front
ex@Book:[~/kolore/app/front]$ bower install
ex@Book:[~/kolore/app/front]$ cd ../admin
ex@Book:[~/kolore/app/admin]$ bower install
```

---

<a name="3"></a>
## [Local testing](#3)
Once you have installed all the dependencies, you must have the **Google Cloud SDK** to run the server. Check the instructions [here][20].

##### Build the front-end files
In order to get all the CSS and JS done, you must build it, once from each app. Use the command `grunt`to build it, and `grunt watch` while you work on CSS and JS files, so they build immediately after you change them.

##### Start the server
In the root directory of the app run in your terminal<br>
`dev_appserver.py .`

Congrats, you have a working example of Kolore. Check [http://localhost:8080/admin](http://localhost:8080/admin) to see it in action.

---

<a name="4"></a>
## [Deploying to the server](#4)

##### Create a project
First of all, you must create a new project on the [Google Cloud Console][console.developers.google.com/]. Then modify the `app.yaml`file and introduce project-id of the project you just created.

##### Deploy to the server
Easiest wayr to do it is:<br>
`appcfg.py -A PROJECT-ID --oauth2 update .`


---
## [Other commands](#5)
### Babel Commands
[Babel][12] is an internationalization library for Python. We use [Flask-Babel][4] an extension to Flask that adds i18n and l10n support to any Flask application. We use [POeditor][7] for managing the languages. English is the main language and actually 100% translated to Spanish and Basque.

##### Extract all terms to translate
`pybabel extract -F babel.cfg -o messages.pot .`

##### Start a language
`pybabel init -i messages.pot -d translations -l 'es'`

##### Compile all translations
Once you have a `.po` file with the translations, those files must be compiled to a `.mo` file<br>
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
[14]: http://gruntjs.com/
[15]: http://imperavi.com/kube/
[16]: http://momentjs.com/
[17]: http://quilljs.com/
[18]: https://pip.pypa.io/en/latest/installing.html
[19]: https://nodejs.org/
[20]: https://cloud.google.com/sdk/