#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-03-04 16:50:09
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-03-05 13:07:08

import tweepy, sqlite3
from pasteee import Paste
from pprint import pprint

dbPath = "shows.db"

consumer_key, consumer_secret = 'yvVTrxNtVsLkoHxKWxh4xvgjg', '39OW6Q8fIKDXvTPPCaEJDULcYaHC5XZ3fe7HHCGtdepBKui2jK'
access_token, access_token_secret = '3214835117-OXVVLYeqUScRAPMqfVw5hS8NI63zPnWOVK63C5I', 'ClcGnF8vW6DbvgRgjwU6YjDc9f2oxMzOvUAN8kzpsmbcL'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)


def unpackEpisode(episode):
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()
	
	cursor = c.execute('SELECT * FROM stray_episodes')
	columnNames = [description[0] for description in cursor.description]
	
	conn.close()
	
	episodeDict = dict.fromkeys(columnNames)
	
	for i, key in enumerate(episodeDict.keys()):
		episodeDict[key] = episode[i]

	return episodeDict


def prettifyEpisode(episode):
	returnString = ''
	for key, value in episode.items():
		returnString += key + ': ' + str(value) + '\n'

	return returnString

def createPasteee(episode):
	return Paste(prettifyEpisode(episode), private=False, desc="My first paste", views=10)

def tweetString(episode):
	tweetString = '@KevinMidboe\nAdded episode:\n' + episode['name'] + ' S' + episode['season']\
	 + 'E' + episode['episode'] + '\nDetails: '
	return tweetString

# TODO What if error when tweeting, no id_str
def tweet(tweetString):
	response = api.update_status(status=tweetString)
	return response.id_str


def updateTweetID(episodeDict, id):
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('UPDATE stray_episodes SET tweet_id = ' + id + ' WHERE original is "' + episodeDict['original'] + '"')

	conn.commit()
	conn.close()

def tweetEpisode(episode):
	pasteee = createPasteee(episode)
	tweet_id = tweet(tweetString(episode) + pasteee['raw'])
	updateTweetID(episode, tweet_id)


def tweetNewEpisodes():
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('SELECT * FROM stray_episodes WHERE tweet_id is NULL')

	for row in c.fetchall():
		episode = unpackEpisode(row)
		tweetEpisode(episode)

	conn.close()



def getLastTweets(user, count=1):
	return api.user_timeline(screen_name=user,count=count)

def verifyByID(id):
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	c.execute('UPDATE stray_episodes SET verified = 1 WHERE tweet_id is "' + id + '"')

	conn.commit()
	conn.close()

def parseReply(tweet):
	if b'\xf0\x9f\x91\x8d' in tweet.text.encode('utf-8'):
		print('👍')
		verifyByID(tweet.in_reply_to_status_id_str)

def getReply(tweet):
	conn = sqlite3.connect(dbPath)
	c = conn.cursor()

	tweetID = tweet.in_reply_to_status_id_str
	c.execute('SELECT * FROM stray_episodes WHERE tweet_id is ' + tweetID + ' AND verified is 0')
	row = c.fetchone()

	if row:
		episode = unpackEpisode(row)
		conn.close()
		
		parseReply(tweet)

	conn.close()
	
def checkForReply():
	for tweet in getLastTweets('KevinMidboe', 10):
		if tweet.in_reply_to_status_id_str != None:
			getReply(tweet)


def main():
	tweetNewEpisodes()
	checkForReply()

if __name__ == '__main__':
	main()