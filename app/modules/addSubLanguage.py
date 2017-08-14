#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-04 13:46:28
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-04 14:03:57

from langdetect import detect
from removeUploader import removeUploader

testFiles = ['subs/The.Man.from.U.N.C.L.E.2015.1080p-[eztv].srt', 
	'subs/The.Man.from.U.N.C.L.E.2015.1080p-[eztv]ENGLUISH.srt']

def detectLanguage(file):
	f = open(file, 'r', encoding= 'ISO-8859-15')
	language = detect(f.read())
	f.close()
	
	return removeUploader(file)[:-3] + language + '.srt'

def addLangExtension():
	for file in testFiles:
		print(detectLanguage(file))

if __name__ == '__main__':
	addLangExtension()