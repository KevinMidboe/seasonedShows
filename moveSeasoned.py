#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-04-12 23:27:51
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-04-13 12:11:34

import sys, sqlite3, json, os
import env_variables as env

class episode(object):
	def __init__(self, id):
		self.id = id
		self.getVarsFromDB()

	def getVarsFromDB(self):
		c = sqlite3.connect(env.db_path).cursor()
		c.execute('SELECT parent, name, season, episode, video_files, subtitles, trash FROM stray_eps WHERE id = ?', (self.id,))
		returnMsg = c.fetchone()
		self.parent = returnMsg[0]
		self.name = returnMsg[1]
		self.season = returnMsg[2]
		self.episode = returnMsg[3]
		self.video_files = json.loads(returnMsg[4])
		self.subtitles = json.loads(returnMsg[5])
		self.trash = json.loads(returnMsg[6])
		c.close()

	def query(self, dType):
		queries = {
			'parent': [env.show_dir, self.parent],
			'season': [env.show_dir, self.name, self.name + ' Season ' + "%02d" % self.season],
			'episode': [env.show_dir, self.name, self.name + ' Season ' + "%02d" % self.season, \
				self.name + ' S' + "%02d" % self.season + 'E' + "%02d" % self.episode],
		}
		return queries[dType]

	def typeDir(self, dType, create=False, mergeItem=None):
		url = '/'.join(self.query(dType))
		if create and not os.path.isdir(url):
			os.makedirs(url)
		if mergeItem:
			return '/'.join([url, str(mergeItem)])
		return url


def moveStray(strayId):
	ep = episode(strayId)

	for item in ep.video_files:
		os.rename(ep.typeDir('parent', mergeItem=item[0]), ep.typeDir('episode', mergeItem=item[1], create=True))

	for item in ep.subtitles:
		os.rename(ep.typeDir('parent', mergeItem=item[0]), ep.typeDir('episode', mergeItem=item[1], create=True))

	for item in ep.trash:
		os.remove(ep.typeDir('parent', mergeItem=item))
	os.rmdir(ep.typeDir('parent'))

if __name__ == '__main__':
	moveStray(sys.argv[-1])