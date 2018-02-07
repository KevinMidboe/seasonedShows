const assert = require('assert');
const PythonShell = require('python-shell');

async function find(searchterm, callback) {
   const options = {
      pythonPath: '/usr/bin/python3',
      // pythonPath: '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
      args: [searchterm, '-s', 'piratebay', '--print'],
   };

   PythonShell.run('../app/torrent_search/torrentSearch/search.py', options, callback);
   // PythonShell does not support return
}


async function callPythonAddMagnet(magnet, callback) {
   const options = {
      pythonPath: '/usr/bin/python',
      // pythonPath: '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
      args: [magnet],
   };

   PythonShell.run('../app/magnet.py', options, callback);
}

async function SearchPiratebay(query) {
   return await new Promise((resolve, reject) => find(query, (err, results) => {
      if (err) {
         /* eslint-disable no-console */
         console.log('THERE WAS A FUCKING ERROR!');
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
   return await new Promise(resolve => callPythonAddMagnet(magnet, (err, results) => {
      if (err) {
         /* eslint-disable no-console */
         console.log(err);
      }
      /* eslint-disable no-console */
      console.log(results);
      resolve({ success: true });
   }));
}

module.exports = { SearchPiratebay, AddMagnet };
