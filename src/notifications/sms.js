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
    console.warning("api key for sms not set, cannot send sms."); // eslint-disable-line no-console
    return Promise.resolve(null);
  }

  const sender = configuration.get("sms", "sender");
  const recipient = configuration.get("sms", "recipient");
  const smsRequestHeaders = { "Content-Type": "application/json" };
  const smsRequestBody = {
    sender,
    message,
    recipients: [{ msisdn: `47${recipient}` }]
  };

  return new Promise((resolve, reject) => {
    fetch(`https://gatewayapi.com/rest/mtsms?token=${apiKey}`, {
      body: JSON.stringify(smsRequestBody),
      headers: smsRequestHeaders
    })
      .then(resp => resp.json())
      .then(response => resolve(response))
      .catch(error => reject(new SMSUnexpectedError(error)));
  });
};

module.exports = { sendSMS };
