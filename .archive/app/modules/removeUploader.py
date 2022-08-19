#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-04 13:47:32
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-04 13:53:12

import re
testFile = '/Volumes/media/tv/New Girl/New Girl Season 06/New Girl S06E18/New.Girl.S06E18.Young.Adult.1080p.WEB-DL.DD5.1.H264-[eztv]-horse.mkv'

def removeUploader(file=testFile):
	match = re.search('-[a-zA-Z\[\]\-]*.[a-z]{3}', file)

	if match and input('Remove uploader:\t' + match.group(0)[:-4] + ' [Y/n]  ') != 'n':
		uploader, ext = match.group(0).split('.')
		# if ext not in subExtensions:
		# 	file = file.replace(uploader, '')
		# else:
		# 	file = file.replace(uploader, '.eng')
		file = file.replace(uploader, '')
	return file

if __name__ == '__main__':
	print(removeUploader())