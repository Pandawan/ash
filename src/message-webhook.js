const processMessage = require('./process-message');

module.exports = async (req, res, next) => {
  if (req.body.object === 'page') {
    for (const entry of req.body.entry) {
      for (const event of entry.messaging) {
        if (event.message && event.message.text) {
          await processMessage(event);
        }
      }
    }
    res.status(200).end();
  }
};
