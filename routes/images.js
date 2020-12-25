
const express = require('express');
const router = express.Router();
const dbapi = require('../utils/dbAPI.js');


router.get('/', (req, res) => {
  console.log(req.query)
  const condition = JSON.parse(req.query.condition);
  console.log(condition);
  dbapi.getImages(condition, +req.query.limit, +req.query.skip)
  .then(pics => {
    res.json(pics);
  })
  .catch(err => console.error(err));
});

module.exports = router;
