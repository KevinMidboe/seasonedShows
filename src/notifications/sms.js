const request = require("request");
const configuration = require("../config/configuration").getInstance();

const sendSMS = message => {
  const apiKey = configuration.get("sms", "apikey");

  if (!apiKey) {
    console.warning("api key for sms not set, cannot send sms.");
    return null;
  }

  const sender = configuration.get("sms", "sender");
  const recipient = configuration.get("sms", "recipient");

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: `https://gatewayapi.com/rest/mtsms?token=${apiKey}`,
        json: true,
        body: {
          sender,
          message,
          recipients: [{ msisdn: `47${recipient}` }]
        }
      },
      function (err, r, body) {
        console.log(err || body);
        console.log("sms provider response:", body);
        resolve();
      }
    );
  });
};

module.exports = { sendSMS };
