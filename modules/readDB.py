#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-03 22:35:38
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-04 11:09:09

import sqlite3
from fuzzywuzzy import process

path = "/Users/KevinMidboe/Dropbox/python/seasonedShows/shows.db"

def main():
	conn = sqlite3.connect(path)
	c = conn.cursor()

	c.execute('SELECT show_names, date_added, date_modified FROM shows')

	returnList = {}
	for name, added, modified in c.fetchall():
		returnList[name] = [added, modified]

	while True:
		query = input('Query: ')
		print(process.extractOne(query, returnList.keys()))

	conn.close()


main()