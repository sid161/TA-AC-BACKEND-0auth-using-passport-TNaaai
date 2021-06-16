var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Comment = require('./comment');

var articleSchema = new Schema(
  {
    title: String,
    description: String,
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number, default: 0 },

    commentId: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;