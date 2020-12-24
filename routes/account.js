const express = require('express');
const router = express.Router();
const dbapi = require('../utils/dbAPI.js');
const ColumnsGenerator = require('../utils/columnsGenerator');

router.get('/:login', (req, res) => {
  const galleryOwner = req.params.login;
  dbapi.getImages({ owner: galleryOwner }, 10, 0)
  .then(userPics => {
    const { column1, column2, column3 } = ColumnsGenerator.getColumns(userPics);
    res.render('account', { userLogin: req.session.userLogin,
                            galleryOwner,
                            column1: column1.pics, col1Length: column1.pics.length, col1Height: column1.height,
                            column2: column2.pics, col2Length: column2.pics.length, col2Height: column2.height,
                            column3: column3.pics, col3Length: column3.pics.length, col3Height: column3.height,
                            count: column1.pics.length + column2.pics.length + column3.pics.length });
  });
});

module.exports = router;