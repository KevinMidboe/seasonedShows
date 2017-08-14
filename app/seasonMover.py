#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-07-11 19:16:23
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-07-11 19:16:23

import fire, re, os

class seasonMover(object):
	''' Moving multiple files to multiple folders with 
	identifer '''
	workingDir = os.getcwd()

	def create(self, name, interval):
		pass

	def move(self, fileSyntax, folderName):
		episodeRange = self.findInterval(fileSyntax)
			
		self.motherMover(fileSyntax, folderName, episodeRange)

	def findInterval(self, item):
		if (re.search(r'\((.*)\)', item) is None):
			raise ValueError('Need to declare an identifier e.g. (1..3) in: \n\t' + item)

		start = int(re.search('\((\d+)\.\.', item).group(1))
		end = int(re.search('\.\.(\d+)\)', item).group(1))

		return list(range(start, end+1))

	def removeUploadSign(self, file):
		match = re.search('-[a-zA-Z\[\]\-]*.[a-z]{3}', file)
		if match:
			uploader = match.group(0)[:-4]
			return re.sub(uploader, '', file)

		return file

	def motherMover(self, fileSyntax, folderName, episodeRange):
		# Call for sub of fileList
		# TODO check if range is same as folderContent
		for episode in episodeRange:
			leadingZeroNumber = "%02d" % episode
			fileName = re.sub(r'\((.*)\)', leadingZeroNumber, fileSyntax)

			oldPath = os.path.join(self.workingDir,fileName)
			newFolder = os.path.join(self.workingDir, folderName + leadingZeroNumber)
			newPath = os.path.join(newFolder, self.removeUploadSign(fileName))

			os.makedirs(newFolder)
			os.rename(oldPath, newPath)
			# print(newFolder)
			# print(oldPath + ' --> ' + newPath)

if __name__ == '__main__':
	fire.Fire(seasonMover)