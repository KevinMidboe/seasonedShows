#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-04-05 18:40:11
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-04-05 18:51:32
import os, hashlib
from functools import reduce
import time, glob

dirHash = None

def directoryChecksum():
	dirList = os.listdir('/Volumes/media/tv')
	concat = reduce(lambda x, y: x + y, dirList, "")
	
	m = hashlib.md5()
	m.update(bytes(concat, 'utf-16be'))
	return m.digest()

def blober():
	for filename in glob.iglob('/Volumes/media/tv/*'):
		pass

def main():
	start_time = time.time()
	if dirHash is None:
		blober()
	print("--- %s seconds ---" % (time.time() - start_time))


if __name__ == '__main__':
	main()