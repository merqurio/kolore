## Chroma Back-end

This is the content administrator that we use in [Chroma Branding][0]. Is written in Python for [App Engine][1]. 

#### Services
- Google App Engine
    - Images API
    - Mail API
    - Blobstore API
- Google Datastore
- Google Cloud Storage

#### Languages
- [Python][2]

#### Dependencies & resources
- [Flask Framework][3]
- [Babel][4]
- [Jinja2][5]
- [Bower][6]

---

## Docs

#### Babel commands

##### Extract all terms
pybabel extract -F babel.cfg -o messages.pot .

##### Start a language
pybabel init -i messages.pot -d translations -l {THE LANGUAGE ex: 'es'}

##### Compile all translations
pybabel compile -d translations


[0]: http://www.chromabranding.com
[1]: https://cloud.google.com
[2]: https://www.python.org/
[3]: https://flask.pocoo.org
[4]: https://pythonhosted.org/Flask-Babel/
[5]: http://jinja.pocoo.org/
[6]: http://bower.io
