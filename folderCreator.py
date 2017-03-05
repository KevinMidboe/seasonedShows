#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-05 13:52:45
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 13:55:09

import sqlite3

dbPath = 'shows.db'

def findVerified():
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('SELECT * FROM stray_episodes WHERE verified = 1')

	for item in c.fetchone():
		print(item)

def main():
	findVerified()

if __name__ == '__main__':
	main()