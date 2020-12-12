var express = require('express');
var router = express.Router();
const api = require('../dbAPI.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  api.getImages({})
  .then(data => {
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
    res.render('index', { userLogin: req.session.userLogin, column_1: column_1, column_2: column_2, column_3: column_3 });
  })
  .catch(err => next(err));
});

module.exports = router;
