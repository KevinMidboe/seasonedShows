#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-05 13:52:45
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 17:14:25

import sqlite3, json, os, tweepy
from re import sub

dbPath = 'shows.db'

consumer_key, consumer_secret = 'yvVTrxNtVsLkoHxKWxh4xvgjg', '39OW6Q8fIKDXvTPPCaEJDULcYaHC5XZ3fe7HHCGtdepBKui2jK'
access_token, access_token_secret = '3214835117-OXVVLYeqUScRAPMqfVw5hS8NI63zPnWOVK63C5I', 'ClcGnF8vW6DbvgRgjwU6YjDc9f2oxMzOvUAN8kzpsmbcL'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

def newnameMediaitems(media_items):
	# media_items = [['New.Girl.S06E18.720p.HDTV.x264-EZTV.srt', '-EZTV', 'nl'], ['New.Girl.S06E18.720p.HDTV.x264-FLEET.srt', '-FLEET', 'en']]
	media_items = json.loads(media_items)

	returnList = []
	for item in media_items:
		returnList.append([item[0], item[0].replace(item[1], '')])

	return returnList

def newnameSubtitles(subtitles):
	subtitles = json.loads(subtitles)

	returnList = []
	for item in subtitles:
		returnList.append([item[0], item[0].replace(item[1], '.' + item[2])])

	return returnList


def updateMovedStatus(episodeDict):
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('UPDATE stray_episodes SET moved = 1 WHERE original is "' + episodeDict['original'] + '"')

	conn.commit()
	conn.close()



def unpackEpisodes():
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	cursor = c.execute('SELECT * FROM stray_episodes WHERE verified = 1 AND moved = 0')
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
	showDir = '/media/hdd1/tv/%s/'% episode['name']
	episodeFormat = '%s S%sE%s/'% (episode['name'], episode['season'], episode['episode'])
	seasonFormat = '%s Season %s/'% (episode['name'], episode['season'])

	if not os.path.isdir(showDir + seasonFormat):
		os.makedirs(showDir + seasonFormat)

	if not os.path.isdir(showDir + seasonFormat + episodeFormat):
		os.makedirs(showDir + seasonFormat + episodeFormat)

def moveFiles(episode):
	# TODO All this should be imported from config file
	showDir = '/media/hdd1/tv/'
	episodeFormat = '%s S%sE%s/'% (episode['name'], episode['season'], episode['episode'])
	seasonFormat = '%s/%s Season %s/'% (episode['name'], episode['name'], episode['season'])
	
	# TODO All this is pretty ballsy to do this hard/stict.
	newMediaitems = newnameMediaitems(episode['media_items'])
	for item in newMediaitems:
		old_location = showDir + episode['original'] + '/' + item[0]
		new_location = showDir + seasonFormat + episodeFormat + item[1]
		os.rename(old_location, new_location)
	
	if episode['subtitles']: 
		newSubtitles = newnameSubtitles(episode['subtitles'])
		for item in newSubtitles:
			old_location = showDir + episode['original'] + '/' + item[0]
			new_location = showDir + seasonFormat + episodeFormat + item[1]
			os.rename(old_location, new_location)

	# shutil.rmtree(showDir + episode['original'])
	if episode['trash']:
		for trash in json.loads(episode['trash']):
			os.remove(showDir + episode['original'] + '/'+ trash)
	
	# TODO Maybe move to delete folder instead, than user can dump.
	os.rmdir(showDir + episode['original'])
	
	updateMovedStatus(episode)

	api.create_favorite(episode['response_id'])


def findVerified():
	episodes = unpackEpisodes()
	if episodes:
		for episode in episodes:
			createFolders(episode)
			moveFiles(episode)


if __name__ == '__main__':
	findVerified()
	
