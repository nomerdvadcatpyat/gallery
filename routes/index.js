var express = require('express');
var router = express.Router();
const dbapi = require('../utils/dbAPI.js');
const ColumnsGenerator = require('../utils/columnsGenerator'); 

const sizeOf = require('image-size');
const path = require('path');
const config = require('../utils/config');

/* GET home page. */
router.get('/', function(req, res, next) {

  dbapi.getImages({})
  .then(data => {
    const { column1, column2, column3 } = ColumnsGenerator.getColumns(data);
    res.render('index', { userLogin: req.session.userLogin, column1: column1.pics, col1Length: column1.pics.length,
                                                            column2: column2.pics, col2Length: column2.pics.length,
                                                            column3: column3.pics, col3Length: column3.pics.length,
                                                            count: column1.pics.length + column2.pics.length + column3.pics.length });
  })
  .catch(err => next(err));
});

module.exports = router;
