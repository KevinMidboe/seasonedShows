#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-04 16:50:09
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 17:20:04

import os, sqlite3, re, json
from fuzzywuzzy import process
from langdetect import detect
from pprint import pprint

showDir = '/media/hdd1/tv/'
dbPath = 'shows.db'
mediaExtensions = ['mkv', 'mp4', 'avi']
mediaExcluders = ['sample', 'RARBG']
subExtensions = ['srt']

def getFuzzyName(query):
	return process.extractOne(query, getShowNames().keys())

def removeUploader(mediaItem):
	match = re.search('-[a-zA-Z\[\]\-]*.[a-z]{3}', mediaItem)
	if match:
		uploader, ext = match.group(0).split('.')
		return uploader

	return ''

def getLanguage(path, subtitles):
	f = open(path + subtitles, 'r', encoding= 'ISO-8859-15')
	language = detect(f.read())
	f.close()

	return language

# Finds the correct show name
def getShowNames():
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('SELECT show_names, date_added, date_modified FROM shows')

	returnList = {}
	for name, added, modified in c.fetchall():
		returnList[name] = [added, modified]

	conn.close()
	return returnList

def XOR(list1, list2):
	return set(list1) ^ set(list2)


def getByIdentifier(folderItem, identifier):
	itemMatch = re.findall(identifier + '[0-9]{1,2}', folderItem)
	# TODO Should be more precise than first item in list
	item = re.sub(identifier, '', itemMatch[0])
	# TODO Should be checking for errors
	return item 

def getItemChildren(folder):
	children = os.listdir(showDir + folder)

	media_items = []
	subtitles = []
	trash = []
	for childItem in children:
		if childItem[-3:] in mediaExtensions and childItem[:-4] not in mediaExcluders:
			media_items.append([childItem, removeUploader(childItem)])
		elif childItem[-3:] in subExtensions:
			subtitles.append([childItem, removeUploader(childItem), getLanguage(showDir + folder + '/', childItem)])
		else:
			trash.append(childItem)

	return media_items, subtitles, trash

	
def addToDB(episodeInfo):
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	original = episodeInfo['original']
	full_path = episodeInfo['full_path']
	name = episodeInfo['name']
	season = episodeInfo['season']
	episode = episodeInfo['episode']
	media_items = json.dumps(episodeInfo['media_items'])
	subtitles = json.dumps(episodeInfo['subtitles'])
	trash = json.dumps(episodeInfo['trash'])
	tweet_id = episodeInfo['tweet_id']
	reponse_id = episodeInfo['reponse_id']
	verified = episodeInfo['verified']
	moved = episodeInfo['moved']

	print((media_items))
	try:
		c.execute('INSERT INTO stray_episodes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [original,\
			full_path, name, season, episode, media_items, subtitles, trash, tweet_id, reponse_id, verified, moved])
		
	except sqlite3.IntegrityError:
		print('Episode already registered')

	conn.commit()
	conn.close()




def getNewFolderContents():
	# TODO Should not do on keys, if empty.
	showNames = getShowNames().keys()
	# TODO Better way to filter non dotfiles, dirread in filter?
	# Should maybe all dirs be checked at start?
	folderContents = filter( lambda f: not f.startswith('.'), os.listdir(showDir))

	return XOR(folderContents, showNames) # OK


def checkForSingleEpisodes(folderItem):
	# TODO also if empty, should be checked earlier
	showName, hit = getFuzzyName(folderItem)

	episodeMatch = re.findall(re.sub(' ', '.', showName)+'\.S[0-9]{1,2}E[0-9]{1,2}\.', folderItem)
	if episodeMatch:
		return True  # OK


def getEpisodeInfo(folderItem):
	showName, hit = getFuzzyName(folderItem)
	season = getByIdentifier(folderItem, 'S')
	episode = getByIdentifier(folderItem, 'E')
	media_items, subtitles, trash = getItemChildren(folderItem)
	
	episodeInfo = []
	episodeInfo = {'original': folderItem, 
		'full_path': showDir + folderItem,
		'name': showName, 
		'season': season, 
		'episode': episode,
		'media_items': media_items,
		'subtitles': subtitles,
		'trash': trash, 
		'tweet_id': None,
		'reponse_id': None,
		'verified': '0',
		'moved': '0'}


	addToDB(episodeInfo)
	return episodeInfo



def findStray():
	# TODO What if null or tries to pass down error
	for item in getNewFolderContents():
		if checkForSingleEpisodes(item):
			pprint(getEpisodeInfo(item))


if __name__ == '__main__':
	findStray()
