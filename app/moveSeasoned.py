#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-04-12 23:27:51
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2018-05-13 19:17:17

import sys, sqlite3, json, os.path
import logging
import env_variables as env
import shutil

import delugeClient.deluge_cli as delugeCli

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

		self.queries = {
			'parent_input': [env.input_dir, self.parent],
			'season': [env.show_dir, self.name, self.name + ' Season ' + "%02d" % self.season],
			'episode': [env.show_dir, self.name, self.name + ' Season ' + "%02d" % self.season, \
				self.name + ' S' + "%02d" % self.season + 'E' + "%02d" % self.episode],
		}

	def typeDir(self, dType, create=False, mergeItem=None):
		url = '/'.join(self.queries[dType])
		print(url)
		if create and not os.path.isdir(url):
			os.makedirs(url)
			fix_ownership(url)
		if mergeItem:
			return '/'.join([url, str(mergeItem)])
		return url


def fix_ownership(path):
	pass
	# TODO find this from username from config
	# uid = 1000
	# gid = 112
	# os.chown(path, uid, gid)

def moveStray(strayId):
	ep = episode(strayId)

	for item in ep.video_files:
		try: 
			old_dir = ep.typeDir('parent_input', mergeItem=item[0])
			new_dir = ep.typeDir('episode', mergeItem=item[1], create=True)
			shutil.move(old_dir, new_dir)
		except FileNotFoundError:
			logging.warning(old_dir + ' does not exits, cannot be moved.')

	for item in ep.subtitles:
		try:
			old_dir = ep.typeDir('parent_input', mergeItem=item[0])
			new_dir = ep.typeDir('episode', mergeItem=item[1], create=True)
			shutil.move(old_dir, new_dir)
		except FileNotFoundError:
			logging.warning(old_dir + ' does not exits, cannot be moved.')

	for item in ep.trash:
		try:
			os.remove(ep.typeDir('parent_input', mergeItem=item))
		except FileNotFoundError:
			logging.warning(ep.typeDir('parent_input', mergeItem=item) + 'does not exist, cannot be removed.')
	
	fix_ownership(ep.typeDir('episode'))
	for root, dirs, files in os.walk(ep.typeDir('episode')):  
		for item in files:
			fix_ownership(os.path.join(ep.typeDir('episode'), item))
	

	# TODO because we might jump over same files, the dir might no longer 
	# be empty and cannot remove dir like this.
	try: 
		os.rmdir(ep.typeDir('parent_input'))
	except FileNotFoundError:
		logging.warning('Cannot remove ' + ep.typeDir('parent_input') + ', file no longer exists.')

	# Remove from deluge client
	logging.info('Removing {} for deluge'.format(ep.parent))
	deluge = delugeCli.Deluge()
	response = deluge.remove(ep.parent)
	logging.info('Deluge response after delete: {}'.format(response))



if __name__ == '__main__':
	abspath = os.path.abspath(__file__)
	dname = os.path.dirname(abspath)
	if (os.path.exists(os.path.join(dname, env.logfile))):
		logging.basicConfig(filename=env.logfile, level=logging.INFO)
	else:
		print('Logfile could not be found at ' + env.logfile + '. Verifiy presence or disable logging in config.')

	moveStray(sys.argv[-1])
