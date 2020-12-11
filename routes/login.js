const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('login page');
    res.redirect('../');
});
  
module.exports = router;
