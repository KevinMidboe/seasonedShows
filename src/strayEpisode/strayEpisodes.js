/*
* @Author: KevinMidboe
* @Date:   2017-04-12 16:57:55
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-04-12 17:05:28
*/

const assert = require('assert');
const establishedDatabase = require('src/database/database');

class StayEpisodes {

	constructor(database) {
		this.databse = database || establishedDatabase;
		this.queries = {
			'read': 'SELECT name, season, episode FROM stray_eps WHERE id = ?',
			'readEpisode': 'SELECT * FROM stray_eps WHERE id = ?',
			'updateEpisode': 'UPDATE stray_eps SET name = ?, season = ?, episode = ?, video_files = ?, \
				subtitles = ?, trash = ?, verified = ? WHERE id = ?',
		};
	}

	read(episodeId) {
		return this.database.get(this.queries.read, episodeId).then((row) => {
			assert.notEqual(row, undefined)
		})
	}
}