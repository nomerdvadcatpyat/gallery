const express = require('express');
const router = express.Router();
const dbapi = require('../utils/dbAPI.js');

router.get('/:login', (req, res) => {
  const galleryOwner = req.params.login;
  res.render('account', { userLogin: req.session.userLogin,
                          galleryOwner });
});

module.exports = router;