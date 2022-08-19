const request = require("request");
const configuration = require("../config/configuration").getInstance();

class SMSUnexpectedError extends Error {
  constructor(errorMessage) {
    const message = "Unexpected error from sms provider.";
    super(message);

    this.errorMessage = errorMessage;
  }
}

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
        const smsError = new SMSUnexpectedError(err || body);
        console.error(smsError.message);
        resolve();
      }
    );
  });
};

module.exports = { sendSMS };
