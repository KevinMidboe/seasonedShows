import Configuration from "../config/configuration.js";

const configuration = Configuration.getInstance();

class SMSUnexpectedError extends Error {
  constructor(errorMessage) {
    const message = "Unexpected error from sms provider.";
    super(message);

    this.errorMessage = errorMessage;
  }
}

export default async function sendSMS(message) {
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

  try {
    const url = `https://gatewayapi.com/rest/mtsms?token=${apiKey}`;
    const options = {
      method: "POST",
      headers: smsRequestHeaders,
      body: JSON.stringify(smsRequestBody)
    };

    return fetch(url, options).then(resp => resp.json());
  } catch (error) {
    throw new SMSUnexpectedError(error);
  }
}
