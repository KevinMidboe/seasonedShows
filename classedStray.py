#!/usr/bin/env python3.6
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-04-05 18:40:11
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-04-07 11:28:59
import os.path, hashlib, time, glob, sqlite3, re, json, tweepy
from functools import reduce
from fuzzywuzzy import process
from langdetect import detect
from time import sleep
import env_variables as env

dirHash = None

class twitter(object):
	def __init__(self):
		if '' in [env.consumer_key, env.consumer_secret, env.access_token, env.access_token_secret]:
			print('not set')
		
		self.consumer_key = env.consumer_key
		self.consumer_secret = env.consumer_secret
		self.access_token = env.access_token
		self.access_token_secret = env.access_token_secret

		self.authenticate()

	def authenticate(self):
		auth = tweepy.OAuthHandler(self.consumer_key, self.consumer_secret)
		auth.set_access_token(self.access_token, self.access_token_secret)
		self.api_token = tweepy.API(auth)

	def api(self):
		return self.api_token

class strayEpisode(object):
	def __init__(self, parent, childrenList):
		self.parent = parent
		self.children = childrenList
		self._id = self.getID()
		self.showName = self.findSeriesName()
		self.season = self.getSeasonNumber()
		self.episode = self.getEpisodeNumber()
		self.videoFiles = []
		self.subtitles = []
		self.trash = []
		self.sortMediaItems()

		self.saveToDB()
		# self.notifyInsert()
	
	def getID(self):
		return hashlib.md5("b'{}'".format(self.parent).encode()).hexdigest()[:6]

	def findSeriesName(self):
		find = re.compile("^[a-zA-Z. ]*")
		m = re.match(find, self.parent)
		if m:
			name, hit = process.extractOne(m.group(0), getShowNames().keys())
			if hit >= 90: 
				return name
			else:
				# This should be logged or handled somehow
				pass

	def getSeasonNumber(self):
		m = re.search('[sS][0-9]{1,2}', self.parent)
		if m:
			return re.sub('[sS]', '', m.group(0))

	def getEpisodeNumber(self):
		m = re.search('[eE][0-9]{1,2}', self.parent)
		if m:
			return re.sub('[eE]', '', m.group(0))

	def uploaderSignature(self, file):
		match = re.search('-[a-zA-Z\[\]\-]*.[a-z]{3}', file)
		if match:
			uploader = match.group(0)[:-4]
			return re.sub(uploader, '', file)

		return ''

	def getSubtitlesLang(self, subFile):
		f = open('/'.join([env.show_dir, self.parent, subFile]), 'r', encoding='ISO-8859-15')
		language = detect(f.read())
		f.close()
		if 'sdh' in subFile.lower():
			return 'sdh.' + language
		return language

	def sortMediaItems(self):
		for child in self.children:
			if child[-3:] in env.mediaExt and child[:-4] not in env.mediaExcluders:
				self.videoFiles.append([child, self.uploaderSignature(child)])
			elif child[-3:] in env.subExt:
				self.subtitles.append([child, self.uploaderSignature(child), self.getSubtitlesLang(child)])
			else:
				self.trash.append(child)

	def notifyInsert(self):
		# Send unique id. (time)
		tweetObj = twitter()
		api = tweetObj.api()
		tweetString = 'Added episode:\n' + self.showName + ' S' + self.season\
	 		+ 'E' + self.episode + '\nDetails: \n https://kevinmidboe.com/seasoned/verified.html?id=' + self._id
		response = api.send_direct_message('kevinmidboe', text=tweetString)


	def saveToDB(self):
		# TODO Setup script
		conn = sqlite3.connect(env.db_path)
		c = conn.cursor()

		path = '/'.join([env.show_dir, self.parent])
		video_files = json.dumps(self.videoFiles)
		subtitles = json.dumps(self.subtitles)
		trash = json.dumps(self.trash)

		try:
			c.execute("INSERT INTO stray_eps ('id', 'parent', 'path', 'name', 'season', 'episode', 'video_files', 'subtitles', 'trash') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", \
				[self._id, self.parent, path, self.showName, self.season, self.episode, video_files, subtitles, trash])
		except sqlite3.IntegrityError:
			print('Episode already registered')

		conn.commit()
		conn.close()



def getDirContent(dir=env.show_dir):
	try:
		return [d for d in os.listdir(dir) if d[0] != '.']
	except FileNotFoundError:
		print('Error: "' + dir + '" is not a directory.')
		exit(0)

# Hashes the contents of media folder to easily check for changes.
def directoryChecksum():
	dirList = getDirContent()
	# Creates a string of all the list items.
	dirConcat = reduce(lambda x, y: x + y, dirList, "")
	
	m = hashlib.md5()
	m.update(bytes(dirConcat, 'utf-16be')) # String to byte conversion.
	global dirHash
	if dirHash != m.digest():
		dirHash = m.digest()
		return True
	return False

def getShowNames():
	conn = sqlite3.connect(env.db_path)
	c = conn.cursor()

	c.execute('SELECT show_names, date_added, date_modified FROM shows')

	returnList = {}
	for name, added, modified in c.fetchall():
		returnList[name] = [added, modified]

	conn.close()
	return returnList

def XOR(list1, list2):
	return set(list1) ^ set(list2)

def filterChildItems(parent):
	try:
		children = getDirContent('/'.join([env.show_dir, parent]))
		if children:
			strayEpisode(parent, children)
	except FileNotFoundError:
		# Log to error file
		print('Error: "' + '/'.join([env.show_dir, parent]) + '" is not a valid directory.')

def getNewItems():
	newItems = XOR(getDirContent(), getShowNames())
	for item in newItems:
		filterChildItems(item)


def main():
	# TODO Verify env variables (showDir)
	start_time = time.time()
	if directoryChecksum():
		getNewItems()

	print("--- %s seconds ---" % '{0:.4f}'.format((time.time() - start_time)))


if __name__ == '__main__':
	while True:
		main()
		sleep(2)