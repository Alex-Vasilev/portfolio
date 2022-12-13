const mongoose = require('mongoose');
const CONFIG = require('../../config');

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    text: Schema.Types.String,
    description: Schema.Types.String,
    name: Schema.Types.String,
    createDate: Schema.Types.String,
    updateDate: Schema.Types.String,
    categories: [Schema.Types.String],
  },
  {
    timestamps: true
  });

const Message = mongoose.model(CONFIG.DB_MODELS.POST, postSchema);
module.exports = Message;