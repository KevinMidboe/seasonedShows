#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-04 14:56:30
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-04 15:27:02

from pasteee import Paste

def main():
	pasteText = """Some text to paste
	Some more text
	Foo bar baz
	"""
	paste = Paste(pasteText, private=False, desc="My first paste", views=15)
	print(paste)

if __name__ == '__main__':
	main()
