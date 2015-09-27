## Kolore
[![Stories in Ready](https://badge.waffle.io/merqurio/kolore.png?label=ready&title=Work%20in%20progress)](https://waffle.io/merqurio/kolore)
![ Version ](http://img.shields.io/badge/v-0.4-2af985.svg)
![ Production ready ](http://img.shields.io/badge/Ready%20for-Production-2af985.svg)

**Kolore** is a content management system. It has been created to develop websites fast and efficiently for [Chroma Branding][0]. It's written in Python for the [Google App Engine][1]. Right now is just a Blog CMS.

### Test it --> [here](http://kolore-github.appspot.com/admin) <--
(Not all features are  available in the demo)

![ Dashboard Preview ](http://lh4.ggpht.com/IBl90oZNQwVfnd1jnWcZObnrC3w7h9E-tgq6WITqBoCBC76SFuQY_y0FQHciEXpMKPX6NqQQtfUC1HR7zZYBAB8=s1200)

---

# Docs

1. [What & How](#1)
2. [Installing Dependencies](#2)
3. [Local testing](#3)
4. [Managing users](#4)
5. [Deploying](#5)
6. [Babel work-flow (multilingual)](#6)
7. [Creating your own website](https://github.com/merqurio/kolore/wiki/Creating-a-site-with-Kolore)
8. [Screenshots](https://github.com/merqurio/kolore/wiki/Screenshots)

<a name="1"></a>
## [What & How](#1)

The CMS is a [Flask][3] app with [Jinja2][5] and [Flask-Babel][4] running on top of *Google App Engine* servers. It uses *NDB Datastore* as database wich automates the cache for you. The files are uploaded directly to the *Google Cloud Storage* and served from there. Got lost ? See the graphic below:

![ Architecture preview ](http://lh6.ggpht.com/iHK8rVXY-GWuef-V8kFWjhUtgKfT_dhxWykUnbXO2i4a2bkcy_Izy-ts0g9DSEvtP5TihJ3iY4aJD72AIMkni9ljcYk=s1200)

##### So what's so amazing about this ?
*You don't have to pay anything until your website has lots of visitors.* You just need to start a project in the [Google's Developer Console][13] to upload your instance of **Kolore**. Best of all ? you don't have to worry about scaling.


##### I don't mind about this stuff, I just want to create a multilingual web fast.
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
- [Redactor][17]
- Other... see `app/admin/bower.json`

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
Dependencies must be installed and uploaded within your app. The configuration to include the libraries in App Engine's python is done in the `appengine_config.py` file. The `lib` subdirectory is added as the sites packages directory.

Dependencies are managed using [pip][18] in the `lib/requirements.txt` file.

#### Install pip
Please, check the latest installation instructions [here][18].

#### Install Google Cloud SDK (or AppScale)
Kolore is designed to take the most from Google's cloud, but it can be ran in any server using [AppScale](https://github.com/AppScale/appscale).
Install the SDK from Google as detailed [here](https://cloud.google.com/sdk/).
Then make sure you install all the Appengine dependencies:
`gcloud components update gae-python`

#### Install the dependencies inside the lib folder

`pip install -r lib/requirements.txt -t lib/` to install these dependencies in `lib/` subdirectory from terminal in the root directory.

### Front-end Dependencies

[Bower][6] is used to install all the front-end dependencies. As the administration site and the front site are treated as different sites, each one has it's own dependencies that you will find inside `app/admin/static/plugins/` and `/app/front/static/plugins` respectly.

Imagine you want to add a new dependency to the front site. Just do:

```bash
cd app/front
bower search jquery
bower install --save jquery
```

This will install jquery at `app/front/plugins/jquery`

To get all those dependencies concatenated and minified, [Grunt][14] (A JS Task manager) is used. The [Grunt][14] configuration files can be found at `/app/front/Gruntfile.js` and `/app/admin/Gruntfile.js`.

Continuing with our example, modify the `app/front/Gruntfile.js` at line 20, to add the `jquery.js` file in app/front/plugins/jquery to the minified JS that will be finally loaded in the front-end.


#### Install Node, NPM, Bower and Grunt

To install dependencies using Bower, you must first install [Node][19] and NPM. Check the installation instructions [here][19] and then:
```
npm install -g bower
npm install -g grunt
npm install -g grunt-cli
```

#### Install dependencies
Use this commands to finally install all the dependencies.
```bash
[~/kolore]$ cd app/front
[~/kolore/app/front]$ bower install
[~/kolore/app/front]$ npm install
[~/kolore/app/front]$ cd ../admin
[~/kolore/app/admin]$ bower install
[~/kolore/app/front]$ npm install
```
Once you installed all the dependencies, you must build them with grunt. Keep reading.

#### Build the front-end files
In order to get all the CSS and JS in place, you must build it, once each app (admin & front). Use the command `grunt` to build it at `app/front` and `app/admin`. You can automate the dependency building by running `grunt watch` while you work on CSS and JS files.

There is a dependency not included yet in the repository, [Redactor][17]. You must obtain a copy of it and place it in the `admin/static/plugins/redactor` directory with the next structure:
```
redactor/
│ 
├── css/
│   ├── redactor-font.eot
│   ├── redactor.css
│   └── redactor.less
├── langs/
│   ├── ar.js
│   ├── az.js
│   ├── ba.js
│   ...
│   └── zh_tw.js
├── plugins/
│   ├── clips/
│   │   └── clips.js
│   ...
│   └── video/
│       └── video.js
└── redactor.js


```

---

<a name="3"></a>
## [Local testing](#3)
Once you have installed all the dependencies, you must have the **Google Cloud SDK** to run the server. Check the instructions [here][20].

#### Start the server
In the root directory of the app run in your terminal<br>
`dev_appserver.py .` or `gcloud preview app run app.yaml`

Congrats, you have a working example of Kolore. Check [http://localhost:8080/admin](http://localhost:8080/admin) to see it in action.

---

<a name="4"></a>
## [Managing users](#4)

Kolore uses the [Google User API](https://cloud.google.com/appengine/docs/python/users/) to manage the users login and security. If you already are a project administrator in the Cloud Console, you always can access. To add other user, just go to Setting --> Add user, and they will be able to access.

---

<a name="5"></a>
## [Deploying to the server](#5)

##### Create a project
First of all, you must create a new project on the [Google Cloud Console][console.developers.google.com/]. Then modify the `app.yaml`file and introduce project-id of the project you just created.

##### Deploy to the server
Easiest wayr to do it is:<br>
`appcfg.py -A PROJECT-ID --oauth2 update .`<br>

If you prefer to use the new command line:<br>
```bash
gcloud config set project PROJECT-ID
gcloud preview app deploy app.yaml
```
---

<a name="6"></a>
## [Babel Commands](#6)
[Babel][12] is an internationalization library for Python. We use [Flask-Babel][4] an extension to Flask that adds i18n and l10n support to any Flask application. We use [POeditor][7] for managing the languages. English is the main language and actually 100% translated to Spanish and Basque.

### Extract all terms to translate
`pybabel extract -F babel.cfg -o messages.pot .`

### Compile all translations
Once you have a `.po` file with the translations, those files must be compiled to a `.mo` file<br>
`pybabel compile -d translations`

##### Start a language
This project *already* has three languages initiated: Spanish, Basque and English. If you need one more:
`pybabel init -i messages.pot -d translations -l 'de'`






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
[17]: http://imperavi.com/redactor/
[18]: https://pip.pypa.io/en/latest/installing.html
[19]: https://nodejs.org/
[20]: https://cloud.google.com/sdk/
