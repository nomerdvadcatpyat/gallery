const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        path: String,
        alt: String,
        owner: String
    }
);

ImageSchema
.virtual('url')
.get( function () {
    return '/image/' + this._id;
});

module.exports = mongoose.model('Image', ImageSchema);