#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-04-05 15:24:17
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-04-05 18:22:13
import os, hashlib
from functools import reduce

hashDir = '/Volumes/media/tv'

def main():
	dirList = os.listdir(hashDir)
	concat = reduce(lambda x, y: x + y, dirList, "")
	
	m = hashlib.md5()
	m.update(bytes(concat, 'utf-16be'))
	return m.digest()

if __name__ == '__main__':
	print(main())

# TODO The hash value should be saved in a global manner