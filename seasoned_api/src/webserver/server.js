const config = require('src/config/configuration').getInstance();
const app = require('./app');

module.exports = app.listen(config.get('webserver', 'port'), () => {
  console.log('seasonedAPI');
  console.log(`Database is located at ${config.get('database', 'host')}`);
  console.log(`Webserver is listening on ${config.get('webserver', 'port')}`);
})