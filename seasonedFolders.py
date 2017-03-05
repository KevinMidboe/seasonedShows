#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-05 15:55:16
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 17:25:50

from time import sleep

from findStray import findStray
from tweetNewEpisodes import tweetNewEpisodes
from folderCreator import findVerified

def main():
	while True:
		findStray()
		tweetNewEpisodes()
		findVerified()
		sleep(10)

if __name__ == '__main__':
	main()
