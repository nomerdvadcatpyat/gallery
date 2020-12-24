const express = require('express');
const router = express.Router();
const dbapi = require('../utils/dbAPI.js');
const ColumnsGenerator = require('../utils/columnsGenerator'); 

router.post('/', function(req, res) {
  /* получать в req.body текущие высоты каждой из колонок и количество картинок на странице(= count),
  брать из базы skip(count) limit(12) картинок, генерировать колонки и отдавать жсон вида 
  { 
    column1: {
      pics: [  { fullImage, minImage, alt, owner }, ... ],
      height: новая высота из ColumnsGenerator
    }, column2 и column3 аналогично 
  }
  */
  const count = req.body.count;
  console.log(req.body);
  dbapi.getImages({}, 12, +count)
  .then(data => {
    const { column1, column2, column3 } = ColumnsGenerator.getColumns(data, req.body.col1Height, req.body.col2Height, req.body.col3Height,
                                                                   +req.body.col1Length + 1, +req.body.col2Length + 1, +req.body.col3Length + 1);
    console.log(column1, column2, column3);
    res.json( {
      column1: {
        pics: column1.pics,
        height: column1.height
      },
      column2: {
        pics: column2.pics,
        height: column2.height
      },
      column3: {
        pics: column3.pics,
        height: column3.height
      }
    })
  })
  .catch(err => console.error(err));
});

module.exports = router;