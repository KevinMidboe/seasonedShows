#!/usr/bin/env python2
# -*- coding: utf-8 -*-

"""
pasteee module
Allows pasting to https://paste.ee
https://github.com/i-ghost/pasteee
"""

# 2 <-> 3
from urllib.request import urlopen
from urllib.request import Request as urlrequest
from urllib.parse import urlencode
from urllib import error as urlerror
import json


class PasteError(Exception):
    """Exception class for this module"""
    pass


class Paste(object):
    def __new__(cls, paste,
                private=True, lang="plain",
                key="public", desc="",
                expire=0, views=0, encrypted=False):
        if not paste:
            raise PasteError("No paste provided")
        if expire and views:
            # API incorrectly returns success so we raise error locally
            raise PasteError("Options 'expire' and 'views' are mutually exclusive")
        request = urlrequest(
            "http://paste.ee/api",
            data=urlencode(
                {
                    'paste': paste,
                    'private': bool(private),
                    'language': lang,
                    'key': key,
                    'description': desc,
                    'expire': expire,
                    'views': views,
                    'encrypted': bool(encrypted),
                    'format': "json"
                }
            ).encode("utf-8"),
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        try:
            result = json.loads(urlopen(request).read().decode("utf-8"))
            return result["paste"]
        except urlerror.HTTPError:
            print("Couldn't send paste")
            raise
        except KeyError:
            raise PasteError("Invalid paste option: %s" % (result["error"]))