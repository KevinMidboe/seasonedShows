const config = require('src/config/configuration').getInstance();
const app = require('./app');

module.exports = app.listen(config.get('webserver', 'port'), () => {
   /* eslint-disable no-console */
   console.log('seasonedAPI');
   /* eslint-disable no-console */
   console.log(`Database is located at ${config.get('database', 'host')}`);
   /* eslint-disable no-console */
   console.log(`Webserver is listening on ${config.get('webserver', 'port')}`);
});
