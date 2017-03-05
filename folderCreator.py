#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-05 13:52:45
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 15:22:30

import sqlite3, json, os
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
	showDir = '/Volumes/media/tv/%s/'% episode['name']
	episodeFormat = '%s S%sE%s/'% (episode['name'], episode['season'], episode['episode'])
	seasonFormat = '%s Season %s/'% (episode['name'], episode['season'])

	if not os.path.isdir(showDir + seasonFormat):
		os.makedirs(showDir + seasonFormat)

	if not os.path.isdir(showDir + seasonFormat + episodeFormat):
		os.makedirs(showDir + seasonFormat + episodeFormat)



def newnameMediaitems(media_items):
	# media_items = [['New.Girl.S06E18.720p.HDTV.x264-EZTV.srt', '-EZTV', 'nl'], ['New.Girl.S06E18.720p.HDTV.x264-FLEET.srt', '-FLEET', 'en']]
	media_items = json.loads(media_items)

	returnList = []
	for item in media_items:
		returnList.append([item[0], sub(item[1], '', item[0])])

	return returnList

def newnameSubtitles(subtitles):
	subtitles = json.loads(subtitles)

	returnList = []
	for item in subtitles:
		returnList.append([item[0], sub(item[1], '.' + item[2], item[0])])

	return returnList


def moveFiles(episode):
	showDir = '/Volumes/media/tv/'
	episodeFormat = '%s S%sE%s/'% (episode['name'], episode['season'], episode['episode'])
	seasonFormat = '%s/%s Season %s/'% (episode['name'], episode['name'], episode['season'])
	
	newMediaitems = newnameMediaitems(episode['media_items'])
	for item in newMediaitems:
		print(showDir + episode['original'] + '/' + item[0])
		print(showDir + seasonFormat + episodeFormat + item[1] + '\n')
	
	if episode['subtitles']: 
		newSubtitles = newnameSubtitles(episode['subtitles'])
		for item in newSubtitles:
			print(showDir + episode['original'] + '/' + item[0])
			print(showDir + seasonFormat + episodeFormat + item[1] + '\n')



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