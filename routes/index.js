var express = require('express');
var router = express.Router();
const dbapi = require('../dbAPI.js');
const sizeOf = require('image-size');
const path = require('path');
const config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  dbapi.getImages({})
  .then(data => {
    const column1 = new Column();
    const column2 = new Column();
    const column3 = new Column();

    data.forEach( jsonPic => {
      console.log(jsonPic)
      const picHeight = sizeOf(path.join(__dirname, '..' , config.STATIC_DESTINATION, jsonPic.minImage)).height; // Почему то здесь он ожидает абсолютный путь
      switch(Column.getMinCloumn(column1, column2, column3)) {
        case column1:
          console.log('c1')
          column1.pics.push({ fullImage: jsonPic.fullImage, minImage: jsonPic.minImage, alt: jsonPic.alt, owner: jsonPic.owner }); 
          column1.height += picHeight;
          break;

        case column2: 
          console.log('c2')
          column2.pics.push({ fullImage: jsonPic.fullImage, minImage: jsonPic.minImage, alt: jsonPic.alt, owner: jsonPic.owner });
          column2.height += picHeight; 
          break;
        
        case column3: 
          console.log('c3')
          column3.pics.push({ fullImage: jsonPic.fullImage, minImage: jsonPic.minImage, alt: jsonPic.alt, owner: jsonPic.owner });
          column3.height += picHeight;
          break;
      }
    });
    res.render('index', { userLogin: req.session.userLogin, column1: column1.pics, column2: column2.pics, column3: column3.pics });
  })
  .catch(err => next(err));
});

class Column {
  constructor() {
    this.pics = [],
    this.height = 0
  }

  static getMinCloumn(...columns) {
    return columns.sort((c1,c2) => c1.height - c2.height)[0];
  }
}

module.exports = router;
