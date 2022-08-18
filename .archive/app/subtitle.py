# -*- coding: utf-8 -*-
import codecs
import logging
import os

import chardet
import hashlib

from video import Episode, Movie
from utils import sanitize

from langdetect import detect


logger = logging.getLogger(__name__)

#: Subtitle extensions
SUBTITLE_EXTENSIONS = ('.srt', '.sub')


class Subtitle(object):
    """Base class for subtitle.

    :param language: language of the subtitle.
    :type language: :class:`~babelfish.language.Language`
    :param bool hearing_impaired: whether or not the subtitle is hearing impaired.
    :param page_link: URL of the web page from which the subtitle can be downloaded.
    :type page_link: str
    :param encoding: Text encoding of the subtitle.
    :type encoding: str

    """
    #: Name of the provider that returns that class of subtitle
    provider_name = ''

    def __init__(self, name, parent_path, series, season, episode, language=None, hash=None, container=None, format=None, sdh=False):
        #: Language of the subtitle
        
        self.name = name

        self.parent_path = parent_path
        
        self.series = series
        
        self.season = season

        self.episode = episode

        self.language=language

        self.hash = hash

        self.container = container
        
        self.format = format

        self.sdh = sdh

    @classmethod
    def fromguess(cls, name, parent_path, guess):
        if not (guess['type'] == 'movie' or guess['type'] == 'episode'):
            raise ValueError('The guess must be an episode guess')

        if 'title' not in guess:
            raise ValueError('Insufficient data to process the guess')

        sdh = 'sdh' in name.lower()

        if guess['type'] is 'episode':
            return cls(name, parent_path, guess.get('title', 1), guess.get('season'), guess['episode'],
                container=guess.get('container'), format=guess.get('format'), sdh=sdh)
        elif guess['type'] is 'movie':
            return cls(name, parent_path, guess.get('title', 1), container=guess.get('container'), 
                format=guess.get('format'), sdh=sdh)


    def getLanguage(self):
        f = open(os.path.join(self.parent_path, self.name), 'r', encoding='ISO-8859-15')
        language = detect(f.read())
        f.close()

        return language

    def __hash__(self):
        return hashlib.md5("b'{}'".format(str(self.series) + str(self.season) + str(self.episode)).encode()).hexdigest()

    def __repr__(self):
        return '<%s %s [%sx%s]>' % (self.__class__.__name__, self.series, self.season, str(self.episode))



def get_subtitle_path(subtitles_path, language=None, extension='.srt'):
    """Get the subtitle path using the `subtitles_path` and `language`.

    :param str subtitles_path: path to the subtitle.
    :param language: language of the subtitle to put in the path.
    :type language: :class:`~babelfish.language.Language`
    :param str extension: extension of the subtitle.
    :return: path of the subtitle.
    :rtype: str

    """
    subtitle_root = os.path.splitext(subtitles_path)[0]

    if language:
        subtitle_root += '.' + str(language)

    return subtitle_root + extension



