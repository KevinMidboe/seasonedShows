#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-04 14:06:53
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-04 22:16:45

import tweepy
from pasteee import Paste

consumer_key, consumer_secret = 'yvVTrxNtVsLkoHxKWxh4xvgjg', '39OW6Q8fIKDXvTPPCaEJDULcYaHC5XZ3fe7HHCGtdepBKui2jK'
access_token, access_token_secret = '3214835117-OXVVLYeqUScRAPMqfVw5hS8NI63zPnWOVK63C5I', 'ClcGnF8vW6DbvgRgjwU6YjDc9f2oxMzOvUAN8kzpsmbcL'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
apiUser = api.me()
apiUsername, apiUserID = apiUser.screen_name, apiUser.id_str

pasteText = '''episode': '18',
 'full_path': '/Volumes/media/tv/New.Girl.S06E18.720p.HDTV.x264-FLEET',
 'media_items': [['New.Girl.S06E18.720p.HDTV.x264-FLEET.mkv', '-FLEET']],
 'name': 'New Girl',
 'original': 'New.Girl.S06E18.720p.HDTV.x264-FLEET',
 'season': '06',
 'subtitles': [['New.Girl.S06E18.720p.HDTV.x264-EZTV.srt', '-EZTV', 'nl'],
               ['New.Girl.S06E18.720p.HDTV.x264-FLEET.srt', '-FLEET', 'en']],
 'trash': ['Screens',
           'new.girl.s06e18.720p.hdtv.x264-fleet.nfo',
           'Torrent Downloaded From www.torrenting.me.txt']'''

def lastTweet(user, count=1):
	return api.user_timeline(screen_name=user,count=count)

def checkReply():
	originalTweet = lastTweet('pi_midboe')[0]
	originalID, lastText = originalTweet.id_str, originalTweet.text

	tweets = lastTweet('KevinMidboe', 40)
	
	for tweet in tweets:
		tweetID = tweet.in_reply_to_status_id_str
		if tweetID == originalID:
			print(tweet.text)

def tweet(tweetString):
	if not lastTweet('pi_midboe')[0].text.startswith(tweetString):
		paste = Paste(pasteText, private=False, desc="My first paste", views=2)
		tweetString += paste['raw']
		response = api.update_status(status=tweetString)
		print('\n', response.text)

def main():
	tweet('@KevinMidboe\nAdded episode: \nNew Girl S06E16\n\nDetails: ')
	checkReply()


if __name__ == '__main__':
	main()