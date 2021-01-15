const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/user.js');
const Image = require('../models/image');
const config = require('../config');

const mongoUri = config.DATABASE_URL;
mongoose.connect(mongoUri);
mongoose.Promise = global.Promise;
exports.connection = mongoose.connection;
this.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Image API
exports.getImages = function(condition, limitCount, skipCount) {
   return new Promise( (resolve, reject) => { 
     Image
    .find(condition)
    .sort({date_added: -1})
    .skip(skipCount)
    .limit(limitCount)
    .exec((err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
}

exports.uploadImage = function ({ fullImage, minImage, minImageHeight, alt, owner }) {
  return new Promise((resolve, reject) => {
    Image.create({ fullImage, minImage, minImageHeight, alt, owner, date_added: new Date() }, function(err, data) {
      console.log('create data', data);
      if(err) {
        console.log(err);
        reject(err);
      }
      resolve(data);
    })
  });
}

// User API
exports.createUser = function(userData){
    const user = {
        login: userData.login,
        password: hash(userData.password)
    }
    return new Promise((resolve, reject) => {
        User.create(user, function(err, data) {
            console.log('create data', data);
            if(err) {
                console.log(err);
                reject(err);
            }
            resolve(data);
        })
    });
}
 

exports.getUser = function(condition) {
    return new Promise((resolve, reject) => {
        User.findOne(condition, function(err, data) {
            if(err) reject(err);
            resolve(data);
        })
    });
}
 
exports.checkUser = function(userData) {
  return new Promise((resolve, reject) => {
    User
    .findOne({login: userData.login})
    .then(doc => {
      console.log(doc);
      if(doc === null) resolve(null);
      if ( doc.password == hash(userData.password) ) {
          console.log("User password is ok");
          resolve(doc);
      }
      resolve(null);
    })
    .catch(err => reject(err));
  });
}
 
function hash(text) {
    return crypto.createHash('sha1')
    .update(text).digest('base64');
}