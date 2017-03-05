#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-02-23 21:41:40
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-04 16:32:35

import os, re, shutil, sqlite3
from fuzzywuzzy import process
from sys import argv
from pprint import pprint

# TODO  Rename file to remove watermark  DONE
#				Look for subs in file and folder DONE
# 			What if there are multiple subs
# 			Add language for subs
# 			Remove stupid samples
# 			Import directory based on OS

# THE PARTS OF SEASONED FOLDER
# DATABASE
#  Add show
#  Get list of shows
#  Add cmdInfoExtractor

# Parser
#  Get files from directory
#  Check files not in shows list
#  Get best match to the name of file
#  Get folder contents

# cmdInfoExtractor
#  NB: Create folder for new seasons
#  Folderpath
#  Show match
#  Episode/Season
#  Contents
#  mediafiles
#	  - removed author
#  subtitles
#		- removed author
#

# cmdInfoExecuter
#  Checks if there is a waiting tweet
#  Check for replies for the gives tweets
#  If any has reply (y), execute the cmdInfo
#  Delete from waiting DB and add to fixed DB

# Twitter
#  twitter - [index] = en
#           - [index] -
#           - [index] +
#  trash
#   twitter - [index] +
#						- [index] -
#						- [index] =  

showDir = '/Volumes/media/tv/'
dbPath = "/Users/KevinMidboe/Dropbox/python/seasonedShows/shows.db"
mediaExtensions = ['mkv', 'mp4', 'avi']
subExtensions = ['srt']

def verifyConnectedDirectory():
	if not os.path.isdir(showDir):
		print('Error:', showDir + ' folder not found. Is it mounted?')
		exit(0)

def addShowToDB(name):
	if name in getShowNames():
		return False

	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('INSERT INTO shows VALUES ("' + str(name) + '"' + ", datetime('now'), datetime('now'))")

	conn.commit()
	conn.close()
	return True

def addSubLanguage(file):
	f = open('subs/The.Man.from.U.N.C.L.E.2015.1080p-[eztv].srt', 'r', encoding = "UTF-32")
	detectedLanguage = detect(f.read())

# Removes the uploader name from filename
def removeUploader(file):
	match = re.search('-[a-zA-Z\[\]\-]*.[a-z]{3}', file)

	if match and input('Remove uploader:\t' + match.group(0)[:-4] + ' [Y/n]  ') != 'n':
		uploader, ext = match.group(0).split('.')
		# if ext not in subExtensions:
		# 	file = file.replace(uploader, '')
		# else:
		# 	file = file.replace(uploader, '.eng')
		file = file.replace(uploader, '')
	return file


def moveEpisode(srcFile, destDir):
	os.rename(srcFile, destDir)

def XOR(list1, list2):
	return set(list1) ^ set(list2)

def getFuzzyNames(query):
	return process.extractOne(query, getShowNames().keys())

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

	# showList = os.listdir(showDir)  # Get's list of folders in showDir

	# return process.extractOne(input, showList)




def getSeasons(show):
	existingShowSeasons = os.listdir(showDir + show)
	
	seasonsList = []
	for season in existingShowSeasons:
		# Checks if folder is given format (Season [0-9]{2}$)
		if re.search('Season\ [0-9]{2}$', season):
			# If re finds a match we append the season folder to seasonsList[]
			seasonsList.append(season[-2:])

	# TODO Return full season name and create list in the if statement at return'
	return seasonsList


def createEpisodeFolders(show, season, episode, createNew=False):
	episodeFormat = '%s S%sE'%  (show, season)
	seasonFormat = '%s Season %s/' % (show, season)

	seasonDir = showDir + show + '/' + seasonFormat

	# Creates a season folder if none exists for given season value
	if createNew == True:
		os.makedirs(seasonDir)

	episodeList = os.listdir(seasonDir)

	for i in range(1,int(episode)+1):
		i_formatted = '{:02}'.format(i)
		if episodeFormat + i_formatted not in episodeList:
			os.makedirs(seasonDir + episodeFormat + i_formatted)
			print(' ' + episodeFormat + i_formatted)


# TODO to only get the stray files.
# Get all folders without spaces and atleast one '.'
def findStray():
	showNames = getShowNames().keys()
	folderContents = filter( lambda f: not f.startswith('.'), os.listdir(showDir))

	XORContent = XOR(folderContents, showNames)
	
	multipleEpisodeRegex = 'complete|season|\.\S[0-9]{1,2}\.'
	
	# print(set(folderContents) ^ set(showNames))
	
	for file in XORContent:
		if re.findall(multipleEpisodeRegex, file.lower()):
			print(file, process.extractOne(file, showNames))


def findStrayEpisodes(show, season, episode):
	showList = os.listdir(showDir)

	singleEpisodeRegex = re.sub(' ', '.', show) + '.S' + season + 'E'
	# Complete season folder : Show + Season | Complete + first(number after show)
	multipleEpisodeRegex = 'complete|season'

	for file in showList:
		if re.findall(multipleEpisodeRegex, file.lower()) and show in file:
			print(file)

		if singleEpisodeRegex in file:
			episodeNumber = int(file[len(singleEpisodeRegex):len(singleEpisodeRegex)+2])

			folderContents = os.listdir(showDir + file)

			for item in folderContents:
				if (item[-3:] in subExtensions or item[-3:] in mediaExtensions) and \
				(episodeNumber in list(range(1, int(episode) + 1))):
					fileDir = showDir + file + '/' + item
					print(item)
					item = removeUploader(item)
					episodeFolderDir = showDir + show + '/' + show + ' Season ' + season + '/' + \
						show + ' S' + season + 'E' + '{:02}'.format(episodeNumber) + '/'

					moveEpisode(fileDir, episodeFolderDir + item)

			pprint(os.listdir(showDir + file))
			if input('Remove contents?  [Y/n]  ') != 'n':
				shutil.rmtree(showDir + file)



def parse(show, season, episode):
	verifyConnectedDirectory()

	show, fuzzyHit = getShowNames(show)
	if fuzzyHit != 100:
		if (input('Did you mean:\t' + show + '  [Y/n]  ') == 'n'):
			parse(input('Show query: '), season, episode)
			exit(0)

	foundSeasons = getSeasons(show)
	if season not in foundSeasons:
		if (input('Create season:\t' + season + ' [Y/n]  ') == 'n'):
			exit(0)
		else:
			createEpisodeFolders(show, season, episode, True)
			exit(0)
	
	createEpisodeFolders(show, season, episode)
	findStrayEpisodes(show, season, episode)


def main():
	print(addShowToDB('Pokemon GO'))
	exit(0)
	if argv[-1].endswith('seasonedFolders.py'):
		findStray()
		exit(0)

	elif not argv[-1].isdigit() or not argv[-2].isdigit():
		print("   Missing sesason- or episode number.\nRequired input: [show name] [season nr] [episode nr]")
		exit(0)
	show = ' '.join(argv[1:-2])
	season = '{:02}'.format(int(argv[-2]))
	episode = '{:02}'.format(int(argv[-1]))

	parse(show, season, episode)


if __name__ == '__main__':
	main()
