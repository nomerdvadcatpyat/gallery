const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/test',
  SESSION_SECRET: process.env.SESSION_SECRET || 'some-string',
  FULL_IMAGES_DESTINATION: process.env.FULL_IMAGES_DESTINATION || 'images/full',
  MIN_IMAGES_DESTINATION: process.env.MIN_IMAGES_DESTINATION || 'images/resized',
  STATIC_DESTINATION: process.env.STATIC_DESTINATION || 'public'
}