const express = require('express');
const router = express.Router();
const dbapi = require('../utils/dbAPI');
const ColumnsGenerator = require('../utils/columnsGenerator');

router.get('/:login', (req, res) => {
  const galleryOwner = req.params.login;
  dbapi.getImages({ owner: galleryOwner })
  .then(userPics => {
    const { column1, column2, column3 } = ColumnsGenerator.getColumns(userPics);
    console.log(column1, column1.pics.length)
    console.log(column2, column2.pics.length)
    console.log(column3, column3.pics.length)
    console.log(column1.pics.length + column2.pics.length + column3.pics.length)
    res.render('account', { userLogin: req.session.userLogin,
                            galleryOwner,
                            column1: column1.pics, col1Length: column1.pics.length,
                            column2: column2.pics, col2Length: column2.pics.length,
                            column3: column3.pics, col3Length: column3.pics.length,
                            count: column1.pics.length + column2.pics.length + column3.pics.length });
  });
});

module.exports = router;