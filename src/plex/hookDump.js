const configuration = require("../config/configuration").getInstance();

function hookDumpController(req, res) {
  console.log(req);
}

module.exports = hookDumpController;
