const fs = require('fs');
module.exports = JSON.parse(fs.readFileSync('./utils/config.json', 'utf-8'));