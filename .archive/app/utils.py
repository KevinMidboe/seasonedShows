# -*- coding: utf-8 -*-
from datetime import datetime
import hashlib
import os
import re
import struct

def sanitize(string, ignore_characters=None):
    """Sanitize a string to strip special characters.

    :param str string: the string to sanitize.
    :param set ignore_characters: characters to ignore.
    :return: the sanitized string.
    :rtype: str

    """
    # only deal with strings
    if string is None:
        return

    ignore_characters = ignore_characters or set()

    # replace some characters with one space
    # characters = {'-', ':', '(', ')', '.'} - ignore_characters
    # if characters:
    #     string = re.sub(r'[%s]' % re.escape(''.join(characters)), ' ', string)

    # remove some characters
    characters = {'\''} - ignore_characters
    if characters:
        string = re.sub(r'[%s]' % re.escape(''.join(characters)), '', string)

    # replace multiple spaces with one
    string = re.sub(r'\s+', ' ', string)

    # strip and lower case
    return string.strip().lower()

