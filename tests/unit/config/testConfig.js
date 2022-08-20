const assert = require("assert");
const Config = require("../../../src/config/configuration");

describe('Config', () => {
  before(() => {
    this.backedUpEnvironmentVariables = Object.assign({}, process.env);
    this.backedUpConfigFields = Object.assign({}, Config.getInstance().fields);
  });

  after(() => {
    process.env = this.backedUpEnvironmentVariables;
    Config.getInstance().fields = this.backedUpConfigFields;
  });

  it('should retrieve section and option from config file', () => {
    Config.getInstance().fields = { 'webserver': { 'port': 1337 } };
    assert.equal(Config.getInstance().get('webserver', 'port'), 1337);
  });

  it('should resolve to environment variables if option is filtered with env', () => {
    Config.getInstance().fields = { 'webserver': { 'port': 'env|SEASONED_WEBSERVER_PORT' } };
    process.env.SEASONED_WEBSERVER_PORT = '1338';
    assert.equal(Config.getInstance().get('webserver', 'port'), 1338);
  });

  it('raises an exception if the environment variable does not exist', () => {
    Config.getInstance().fields = { 'webserver': { 'port': 'env|DOES_NOT_EXIST' } };
    process.env.SEASONED_WEBSERVER_PORT = '1338';
    assert.throws(() => Config.getInstance().get('webserver', 'port'), /empty/);
  });

  it('raises an exception if the environment variable is empty', () => {
    Config.getInstance().fields = { 'webserver': { 'port': 'env|SEASONED_WEBSERVER_PORT' } };
    process.env.SEASONED_WEBSERVER_PORT = '';
    assert.throws(() => Config.getInstance().get('webserver', 'port'), /empty/);
  });

  it('raises an exception if the section does not exist in the file', () => {
    Config.getInstance().fields = { 'webserver': { 'port': '1338' } };
    assert.throws(() => Config.getInstance().get('woops', 'port'), /does not exist/);
  });

  it('raises an exception if the option does not exist in the file', () => {
    Config.getInstance().fields = { 'webserver': { 'port': '1338' } };
    assert.throws(() => Config.getInstance().get('webserver', 'woops'), /does not exist/);
  });

  it('returns an array if field is an array', () => {
    Config.getInstance().fields = { 'bouncer': { 'whitelist': [1, 2, 3] } };
    assert.deepEqual(Config.getInstance().get('bouncer', 'whitelist'), [1, 2, 3]);
  });

  it('decodes field as base64 if base64| is before the variable', () => {
    Config.getInstance().fields = { 'webserver': { 'port': 'base64|MTMzOA==' } };
    assert.equal(Config.getInstance().get('webserver', 'port'), 1338);
  });

  it('decodes environment variable as base64 if BASE64= is before the variable', () => {
    Config.getInstance().fields = { 'webserver': { 'port': 'env|base64|SEASONED_WEBSERVER_PORT' } };
    process.env.SEASONED_WEBSERVER_PORT = 'MTMzOA==';
    assert.equal(Config.getInstance().get('webserver', 'port'), 1338);
  });
});
