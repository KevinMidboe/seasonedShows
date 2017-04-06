#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-04-05 18:40:11
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-04-05 23:49:40
import os.path, hashlib, time, glob, sqlite3, re
from functools import reduce
from fuzzywuzzy import process
from time import sleep
import env

dirHash = None
childList = []

class mediaItem(object):
	def __init__(self, parent, childrenList):
		self.parent = parent
		self.children = childrenList
		self.seriesName = self.findSeriesName()
		self.season = self.getSeasonNumber()
		self.episode = self.getEpisodeNumber()
		self.videoFiles = []
		self.subtitles = []
		self.trash = []
		self.getMediaItems()
	

	def findSeriesName(self):
		find = re.compile("^[a-zA-Z. ]*")
		m = re.match(find, self.parent)
		if m:
			name, hit = process.extractOne(m.group(0), getShowNames().keys())
			if hit >= 90: 
				return name

	def getSeasonNumber(self):
		m = re.search('[sS][0-9]{1,2}', self.parent)
		if m:
			return re.sub('[sS]', '', m.group(0))

	def getEpisodeNumber(self):
		m = re.search('[eE][0-9]{1,2}', self.parent)
		if m:
			return re.sub('[eE]', '', m.group(0))

	def removeSignature(self, file):
		match = re.search('-[a-zA-Z\[\]\-]*.[a-z]{3}', file)
		if match:
			uploader = match.group(0)[:-4]
			if 'sdh' in uploader.lower():
				return re.sub(uploader, '.sdh', file)
			
			return re.sub(uploader, '', file)

		return ''

	def getMediaItems(self):
		for child in self.children:
			if child[-3:] in env.mediaExt and child[:-4] not in env.mediaExcluders:
				self.videoFiles.append([child, self.removeSignature(child)])
			elif child[-3:] in env.subExt:
				# print([child, removeSignature(child), getLanguage(showDir + folder + '/', child)])
				self.subtitles.append([child, self.removeSignature(child)])
				print(self.subtitles)
			else:
				self.trash.append(child)


def getDirContent(dir=env.show_dir):
	try:
		return [d for d in os.listdir(dir) if d[0] != '.']
	except FileNotFoundError:
		print('Error: "' + dir + '" is not a directory.')

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
		children = getDirContent(env.show_dir + parent)
		if children:
			childList.append(mediaItem(parent, children))
	except FileNotFoundError:
		# Log to error file
		print('"' + env.show_dir + parent + '" is not a valid directory.')

def getNewItems():
	newItems = XOR(getDirContent(), getShowNames())
	for item in newItems:
		filterChildItems(item)


def main():
	# TODO Verify env variables (showDir)
	start_time = time.time()
	if directoryChecksum():
		getNewItems()

	print("--- %s seconds ---" % (time.time() - start_time))


if __name__ == '__main__':
	while True:
		main()
		sleep(2)