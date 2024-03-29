<h1 align="center">
  🌶 seasonedShows
</h1>

<h4 align="center"> Season your media library with the shows and movies that you and your friends want.</h4>

<p align="center">
  <a href="https://drone.schleppe.cloud/KevinMidboe/seasonedShows">
    <img src="https://drone.schleppe.cloud/api/badges/KevinMidboe/seasonedShows/status.svg"
         alt="Drone CI">
  </a>

  <a href="https://coveralls.io/github/KevinMidboe/seasonedShows?branch=api/v2">
    <img src="https://coveralls.io/repos/github/KevinMidboe/seasonedShows/badge.svg?branch=api/v2" alt="">
  </a>
  
  <a href="https://snyk.io/test/github/KevinMidboe/seasonedShows?targetFile=package.json">
    <img src="https://snyk.io/test/github/KevinMidboe/seasonedShows/badge.svg?targetFile=package.json" alt="">
  </a>
  
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="">
  </a>
</p>

<p align="center">
  <a href="#demo-documentation">D & D</a> •
  <a href="#about">About</a> •
  <a href="#key-features">Key features</a> •
  <a href="#installation">Installation</a> •
  <a href="#setup">Setup</a> •
  <a href="#running">Running</a> •
  <a href="#daemon">Setup daemon</a> •
  <a href="#contributing">Contributing</a>
</p>

## <a name="demo-documentation"></a> Demo & Documentation

📺 [DEMO](https://request.movie)  
📝 Documentation of the api.  
💖 Checkout my [fancy vue.js page](https://github.com/KevinMidboe/seasoned) for interfacing the api.

## <a name="about"></a> About

This is the backend api for [seasoned request] that allows for uesrs to request movies and shows by fetching movies from themoviedb api and checks them with your plex library to identify if a movie is already present or not. This api allows to search my query, get themoviedb movie lists like popular and now playing, all while checking if the item is already in your plex library. Your friends can create users to see what movies or shows they have requested and searched for.

The api also uses torrent_search to search for matching torrents and returns results from any site or service available from torrent_search. As a admin of the site you can query torrent_search and return a magnet link that can be added to a autoadd folder of your favorite torrent client.

## <a name="key-features"></a> Key features

### Code

- Uses [tmdb api](https://www.themoviedb.org/documentation/api) with over 350k movies and 70k tv shows
- Written asynchronously
- Uses caching for external requests
- Test coverage
- CI and dependency integrated
- Use either config file or env_variables

### Functionality

- Queries plex library to check if items exists
- Create admin and normal user accounts
- [torrent_search](https://github.com/KevinMidboe/torrent_search) to search for torrents
- Fetch curated lists from tmdb

## <a name="installation"></a> Installation

Before we can use seasonedShows we need to download node and a package manager. For instructions on how to install [yarn](https://yarnpkg.com/en/) or [npm](https://www.npmjs.com) package managers refer to [wiki: install package manager](https://github.com/KevinMidboe/seasonedShows/wiki/Install-package-manager). This api is written with express using node.js as the JavaScript runtime engine. To download node.js head over the the official [node.js download page](https://nodejs.org/en/download/).

### Install seasonedShows

After you have downloaded a package manager and node.js javascript engine, the following will guide you through how to download, install and run seasonedShows.

### macOS

- Open terminal
- Install git. This can be done by running `xcode-select --install` in your favorite terminal.
- Install a package manager, refer to this [wiki page] for yarn or [wiki page] for npm
- Type: `git clone git@github.com:KevinMidboe/seasonedShows.git`
- Type: `cd seasonedShows/`
- Install required packages
  - yarn: `yarn install`
  - npm: `npm install`
- Start server:
  - yarn: `yarn start`
  - npm: `npm run start`
- seasonedShows will now be running at http://localhost:31459
- To have seasonedShows run headless on startup, check out this wiki page to [install as a daemon].

### Linux

- Open terminal
- Install git
  - Ubuntu/Debian: `sudo apt-get install git-core`
  - Fedora: `sudo yum install git`
- Type: `git clone git@github.com:KevinMidboe/seasonedShows.git`
- Type: `cd seasonedShows/`
- Install required packages
  - yarn: `yarn install`
  - npm: `npm install`
- Start server:
  - yarn: `yarn start`
  - npm: `npm run start`
- seasonedShows will now be running at http://localhost:31459
- To have seasonedShows run headless on startup, check out this wiki page to [install as a daemon].

-- same --
(install yarn or npm in a different way)
After you have installed the required packages you will have a node_modules directory with all the packages required in packages.json.

### Requirements

- Node 18 < [wiki page]
- Plex library
- Optional:
  - redis
  - deluge
  - jackett

## <a name="setup"></a> Setup and configuration

Make a copy of configuration file in `configurations/` folder.

For use during development and with `yarn dev` command:

```bash
cp configurations/development.json.example configurations/development.json
```

For use during production and with `yarn start` command:

```bash
cp configurations/development.json.example configurations/production.json
```

Most important values to change here is adding [TMDB api key](https://developers.themoviedb.org/3/getting-started/introduction) and plex server IP.

### Optional setup

To allow authenticated or admin users add items [delugeClient](https://github.com/kevinmidboe/delugeClient) & [torrentSearch](https://github.com/KevinMidboe/torrent_search) can be setup to fetch and add magnet files. Both require python version >= 3.8 and can be downloaded using following pip command:

```bash
pip3 install delugeClient_kevin torrent_search
```

Both of these need to be configured, view their separate README's or find configuration files under `$HOME/.config/`.

## <a name="running"></a> Running/using

yarn/npm start. (can also say this above)
How to create service on linux. This means that

## <a name="daemon"></a> Setup a daemon

The next step is to setup seasonedShows api to run in the background as a daemon. I have written a [wiki page](https://github.com/KevinMidboe/seasonedShows/wiki/Install-as-a-daemon) on how to create a daemon on several unix distors and macOS.  
_Please don't hesitate to add your own system if you get it running on something that is not yet lists on the formentioned wiki page._

## <a name="contributing"></a> Contributing

- Fork it!
- Create your feature branch: git checkout -b my-new-feature
- Commit your changes: git commit -am 'Add some feature'
- Push to the branch: git push origin my-new-feature
- Submit a pull request

## Api documentation

The goal of this project is to create a full custom stack that can to everything surround downloading, organizing and notifiyng of new media. From the top down we have a website using [tmdb](https://www.themoviedb.com) api to search for from over 350k movies and 70k tv shows. Using [hjone72](https://github.com/hjone72/PlexAuth) great PHP reverse proxy we can have a secure way of allowing users to login with their plex credentials which limits request capabilites to only users that are authenticated to use your plex library.
seasonedShows is a intelligent organizer for your tv show episodes. It is made to automate and simplify to process of renaming and moving newly downloaded tv show episodes following Plex file naming and placement.

So this is a multipart system that lets your plex users request movies, and then from the admin page the owner can.

## Installation

There are two main ways of

## Architecture

The flow of the system will first check for new folders in your tv shows directory, if a new file is found it's contents are analyzed, stored and tweets suggested changes to it's contents to use_admin.

Then there is a script for looking for replies on twitter by user_admin, if caanges are needed, it handles the changes specified and updates dtabbase.

After approval by user the files are modified and moved to folders in resptected area. If error occours, pasteee link if log is sent to user.
