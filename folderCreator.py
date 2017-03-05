#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-05 13:52:45
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 14:59:26

import sqlite3, json
from re import sub

dbPath = 'shows.db'

def unpackEpisodes():
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	cursor = c.execute('SELECT * FROM stray_episodes WHERE verified = 1')
	episodeList = []
	for row in c.fetchall():
		columnNames = [description[0] for description in cursor.description]
		
		episodeDict = dict.fromkeys(columnNames)
		
		for i, key in enumerate(episodeDict.keys()):
			episodeDict[key] = row[i]

		episodeList.append(episodeDict)
	
	conn.close()

	return episodeList


def createFolders(episode):
	


def getMediaitems(media_items):
	# media_items = [['New.Girl.S06E18.720p.HDTV.x264-EZTV.srt', '-EZTV', 'nl'], ['New.Girl.S06E18.720p.HDTV.x264-FLEET.srt', '-FLEET', 'en']]
	media_items = json.loads(media_items)

	returnList = []
	for item in media_items:
		returnList.append(sub(item[1], '', item[0]))

	return returnList

def getSubtitles(subtitles):
	subtitles = json.loads(subtitles)

	returnList = []
	for item in subtitles:
		returnList.append(sub(item[1], '.' + item[2], item[0]))

	return returnList


def moveFiles(episode):
	newMediaitems = getMediaitems(episode['media_items'])
	print(newMediaitems)
	
	if episode['subtitles']: 
		newSubtitles = getSubtitles(episode['subtitles'])
		print(newSubtitles)



def findVerified():
	episodes = unpackEpisodes()
	if episodes:
		for episode in episodes:
			createFolders(episode)
			moveFiles(episode)
	
	# for item in c.fetchall():
		# print(item)

def main():
	findVerified()

if __name__ == '__main__':
	main()