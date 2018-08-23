const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const WebhookSchema = new Schema({
  asanaProjectId: {
    type: Number,
    required: true
  },
  workspaceId: {
    type: Number,
    required: true
  },
  projectType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Webhook = mongoose.model('webhook', WebhookSchema);
