#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-04 14:06:53
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 11:48:47

import tweepy, sqlite3
from pasteee import Paste
from pprint import pprint

dbPath = "shows.db"

consumer_key, consumer_secret = 'yvVTrxNtVsLkoHxKWxh4xvgjg', '39OW6Q8fIKDXvTPPCaEJDULcYaHC5XZ3fe7HHCGtdepBKui2jK'
access_token, access_token_secret = '3214835117-OXVVLYeqUScRAPMqfVw5hS8NI63zPnWOVK63C5I', 'ClcGnF8vW6DbvgRgjwU6YjDc9f2oxMzOvUAN8kzpsmbcL'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
apiUser = api.me()
apiUsername, apiUserID = apiUser.screen_name, apiUser.id_str


def tweetNewEpisode(episode):
	createPasteee()

def unpackEpisode(episode):
	episodeDict = dict.fromkeys(['original', 'full_path', 'name', 'season', 'episode',\
		'media_items', 'subtitles', 'trash', 'tweet_id', 'verified'])
	
	for i, key in enumerate(episodeDict.keys()):
		episodeDict[key] = episode[i]

	return episodeDict

def 

def updateTweetID(episodeDict, id):
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('UPDATE stray_episodes SET tweet_id = ' + id + ' WHERE original is ' + episodeDict['original'])

	conn.commit()
	conn.close()

def getUntweetedEpisodes():
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('SELECT * FROM stray_episodes WHERE tweet_id is NULL')

	for episode in c.fetchall():
		tweetNewEpisode(episode)

	conn.close()
	exit(0)
	return episode




def lastTweet(user, count=1):
	return api.user_timeline(screen_name=user,count=count)

def checkReply():
	originalTweet = lastTweet('pi_midboe')[0]
	originalID, lastText = originalTweet.id_str, originalTweet.text

	tweets = lastTweet('KevinMidboe', 10)
	
	for tweet in tweets:
		tweetID = tweet.in_reply_to_status_id_str
		if tweetID == originalID:
			print(tweet.text)

def unpackEpisodes():
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('SELECT * FROM stray_episodes WHERE tweet_id IS NULL and verified IS 0')

	content = c.fetchall()
	conn.close()
	return content


def tweet(tweetString):
	if not lastTweet('pi_midboe')[0].text.startswith(tweetString):
		paste = Paste(unpackEpisodes(), private=False, desc="My first paste", views=2)
		tweetString += paste['raw']
		response = api.update_status(status=tweetString)
		print('\n', response.id_str)

def main():
	episode = getUntweetedEpisodes()
	print(episode)
	tweet('@KevinMidboe\nAdded episode: \nNew Girl S06E16\n\nDetails: ')
	# unpackEpisodes()
	checkReply()


if __name__ == '__main__':
	main()