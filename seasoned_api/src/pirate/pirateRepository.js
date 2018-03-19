const assert = require('assert');
const http = require('http');
const { URL } = require('url');
const PythonShell = require('python-shell');

function getMagnetFromURL(url) {
   return new Promise((resolve, reject) => {
      const options = new URL(url);
      if (options.protocol.includes('magnet'))
         resolve(url)

      http.get(options, (res) => {
         if (res.statusCode == 301) {
            resolve(res.headers.location)
         }
      });
   });
}

async function find(searchterm, callback) {
   const options = {
      pythonPath: '/usr/bin/python3',
      // pythonPath: '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
      args: [searchterm, '-s', 'jackett', '-f', '--print'],
   };

   PythonShell.run('../torrent_search/torrentSearch/search.py', options, callback);
   // PythonShell does not support return
}


async function callPythonAddMagnet(url, callback) {
   getMagnetFromURL(url)
   .then((magnet) => {
      const options = {
         pythonPath: '/usr/bin/python',
      	 // pythonPath: '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
      	 args: [magnet],
      };

      PythonShell.run('../app/magnet.py', options, callback);
   })
   .catch((err) => {
      console.log(err);
      throw new Error(err);
   })
}

async function SearchPiratebay(query) {
   return await new Promise((resolve, reject) => find(query, (err, results) => {
      if (err) {
         /* eslint-disable no-console */
         console.log('THERE WAS A FUCKING ERROR!\n', err);
         reject(Error('There was a error when searching for torrents'));
      }
      if (results) {
         /* eslint-disable no-console */
         console.log('result', results);
         resolve(JSON.parse(results, null, '\t'));
      }
   }));
}

async function AddMagnet(magnet) {
   return await new Promise((resolve, reject) => callPythonAddMagnet(magnet, (err, results) => {
      if (err) {
         /* eslint-disable no-console */
         console.log(err);
	 reject(Error('Enable to add torrent', err)) 
      }
      /* eslint-disable no-console */
      console.log('result/error:', err, results);
      resolve({ success: true });
   }));
}

module.exports = { SearchPiratebay, AddMagnet };
