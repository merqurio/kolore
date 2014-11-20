# Imports
# ----------------------------------------------------------------
import re
from unicodedata import normalize

PUNCTUATION = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')


# Functions
# ----------------------------------------------------------------
def url(text, delim=u'-'):
    """Generates an ASCII-only slug."""
    result = []
    for word in PUNCTUATION.split(text.lower()):
        word = normalize('NFKD', word).encode('ascii', 'ignore')
        if word:
            result.append(word)
    return unicode(delim.join(result))
