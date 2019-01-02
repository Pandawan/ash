const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');

const verifyWebhook = require('./src/verify-webhook');
const messageWebhook = require('./src/message-webhook');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', verifyWebhook);

app.post('/', asyncHandler(messageWebhook));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
