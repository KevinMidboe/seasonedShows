#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from langdetect import detect

def main():
	f = open('/Volumes/media/movies/The Man from UNCLE (2015)/The.Man.from.U.N.C.L.E.2015.1080p.nl.srt', 'r', encoding = "ISO-8859-15")
	print(detect(f.read()))
	f.close()
	print(f.close())

if __name__ == '__main__':
	main()