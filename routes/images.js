
const express = require('express');
const router = express.Router();
const dbapi = require('../utils/dbAPI.js');


router.get('/', (req, res) => {
  const condition = JSON.parse(req.query.condition);
  dbapi.getImages(condition, +req.query.limit, +req.query.skip)
  .then(pics => {
    res.json(pics);
  })
  .catch(err => console.error(err));
});

module.exports = router;
