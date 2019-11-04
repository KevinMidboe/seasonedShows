const fetch = require('node-fetch');

class Tautulli {
  constructor(apiKey, ip, port) {
    this.apiKey = apiKey;
    this.ip = ip;
    this.port = port;
  }

  buildUrlWithCmdAndUserid(cmd, user_id) {
    const url = new URL('api/v2', `http://${this.ip}:${this.port}`)
    url.searchParams.append('apikey', this.apiKey)
    url.searchParams.append('cmd', cmd)
    url.searchParams.append('user_id', user_id)

    return url
  }

  getPlaysByDays(plex_userid, days) {
    const url = this.buildUrlWithCmdAndUserid('get_plays_by_date', plex_userid)
    url.searchParams.append('time_range', days)

    return fetch(url.href)
      .then(resp => resp.json())
  }

  watchTimeStats(plex_userid) {
    const url = this.buildUrlWithCmdAndUserid('get_user_watch_time_stats', plex_userid)
    url.searchParams.append('grouping', 0)

    return fetch(url.href)
      .then(resp => resp.json())
}

  viewHistory(plex_userid) {
    const url = this.buildUrlWithCmdAndUserid('get_history', plex_userid)
    
    url.searchParams.append('start', 0)
    url.searchParams.append('length', 50)

    console.log('fetching url', url.href)

    return fetch(url.href)
      .then(resp => resp.json())
  }
}

module.exports = Tautulli;
