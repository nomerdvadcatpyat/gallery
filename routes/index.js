const { static } = require('express');
var express = require('express');
var router = express.Router();
const Image = require('../models/image');

/* GET home page. */
router.get('/', function(req, res, next) {
  Image.find( {}, function(err, data) {
    if(err) console.log(err);

    const column_1 = [];
    const column_2 = [];
    const column_3 = [];

    let curColumn = 0;
    data.forEach( jsonPic => {
      if(curColumn == 0) column_1.push({ path: jsonPic.path, alt: jsonPic.alt, additionInfo: jsonPic.additionInfo });
      else if(curColumn == 1) column_2.push({ path: jsonPic.path, alt: jsonPic.alt, additionInfo: jsonPic.additionInfo });
      else if(curColumn == 2) column_3.push({ path: jsonPic.path, alt: jsonPic.alt, additionInfo: jsonPic.additionInfo });

      curColumn = (++curColumn) % 3;
    });
    res.render('index', { column_1: column_1, column_2: column_2, column_3: column_3 });
  })

});

module.exports = router;
