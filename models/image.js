const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        path: String,
        alt: String,
        additionInfo: String // для теста, потом заменить на овнера
        // owner: ... Реализовать потом (после сделанной авторизации), ссылка на документ владельца картинки в бд
    }
);

ImageSchema
.virtual('url')
.get( function () {
    return '/image/' + this._id;
});

module.exports = mongoose.model('Image', ImageSchema);