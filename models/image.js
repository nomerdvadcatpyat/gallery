const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    path: {
      type: String,
      required: true
    },
    alt: String,
    owner: String
    // owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User'
    // }
  }
);

ImageSchema
.virtual('url')
.get( function () {
    return '/image/' + this._id;
});

module.exports = mongoose.model('Image', ImageSchema);