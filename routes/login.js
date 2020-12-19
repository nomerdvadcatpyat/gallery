const express = require('express');
const router = express.Router();
const api = require('../utils/dbAPI');
const { use } = require('./register');

router.post('/', function(req, res, next) {
  const login = req.body.login;
  const pass = req.body.pass;

  let errFields = [];
  if(!login) errFields.push('sign-in-login');
  if(!pass) errFields.push('sign-in-pass');

  if(errFields.length > 0) {
     res.json({
      ok: false,
      error: 'Все поля должны быть заполнены',
      fields: errFields 
    });
  } else {
    api.checkUser({ login: login, password: pass})
    .then(user => {
      if(!user) {
        res.json({
          ok: false,
          error: 'Ошибка в логине или пароле.',
          fields: ['login', 'password']
        });
      } 
      else {
        console.log(user);
        req.session.userId = user.id;
        req.session.userLogin = user.login;
        res.json({
          ok: true
        });
      }
    })
    .catch(err => res.json({ ok: false, error: 'Внутренняя ошибка. Попробуйте позже.' }));
  }
});
  
module.exports = router;
