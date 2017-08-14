#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-02-23 21:41:40
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 19:35:10

from pasteee import Paste

def createPasteee():
	paste = Paste('Test pastee', views=10)
	print(paste)
	print(paste['raw'])

if __name__ == '__main__':
	createPasteee()