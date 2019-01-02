const axios = require('axios');
const uuid = require('uuid');
const dialogflow = require('dialogflow');

// From DialogFlow Settings
const projectId = 'ash-nrbqyn';
const sessionId = uuid.v4();
const languageCode = 'en-US';

const config = {
  credentials: {
    // For some reason, heroku escapes the \n character into \\n, so undo that
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace('\\n', '\n'),
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

// Create dialogflow session
const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const {
  FACEBOOK_ACCESS_TOKEN
} = process.env;

const sendTextMessage = async (userId, text) => {
  return axios({
    method: 'post',
    url: `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
    data: {
      messaging_type: 'RESPONSE',
      recipient: {
        id: userId
      },
      message: {
        text
      }
    }
  });
};

module.exports = async (event) => {
  const userId = event.sender.id;
  const message = event.message.text;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode
      }
    }
  };
  try {
    console.log(process.env);
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    console.log(responses);
    await sendTextMessage(userId, result.fulfillmentText);
    console.log('Success!');
  } catch (error) {
    console.error('Error: ', error);
  }
};
