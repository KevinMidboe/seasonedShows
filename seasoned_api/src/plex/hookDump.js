const configuration = require('src/config/configuration').getInstance();

function hookDumpController(req, res) {
   console.log(req);
}

module.exports = hookDumpController;
