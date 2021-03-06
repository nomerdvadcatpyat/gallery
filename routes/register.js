const express = require('express');
const router = express.Router();
const api = require('../utils/dbAPI.js');


router.post('/', function(req, res, next) {
  const login = req.body.login;
  const pass = req.body.pass;
  const rePass = req.body.rePass;

  const error = findErrorInFields(login, pass, rePass);
  if(error) res.json(error); 
  else {
    api.getUser({ login: login})
    .then(user => {
      if(!user) {
        api.createUser({
          login: login,
          password: pass
        })
        .then(user => {
          req.session.userId = user.id;
          req.session.userLogin = user.login;
          res.json({ok: true});
        })
        .catch(err => res.json(err));
      }
      else {
        res.json({
          ok: false,
          error: 'Пользователь с таким логином уже существует',
          fields: ['login']
        });
      }
    });
  }
});

function findErrorInFields(login, pass, rePass) {
  let result;
  let errFields = [];
  if(!login) errFields.push('login');
  if(!pass) errFields.push('pass');
  if(!rePass) errFields.push('rePass');

  if(errFields.length > 0) {
    result = {
      ok: false,
      error: 'Все поля должны быть заполнены',
      fields: errFields 
    }
  } else if(!/^[a-zA-Z0-9]+$/.test(login)) {
    result = {
      ok: false,
      error: 'Логин должен содержать только латинские буквы и цифры',
      fields: ['login']
    };
  } else if(login.length < 3 || login.length > 16) {
    result = {
      ok: false,
      error: 'Длина логина должа быть от 3 до 16 символов',
      fields: ['login']
    };
  } else if(pass.length < 5) {
    result = {
      ok: false,
      error: 'Пароль должен содержать минимум 5 символов',
      fields: ['pass']
    };
  } else if(pass != rePass) {
    result = {
      ok: false,
      error: 'Пароли не совпадают',
      fields: ['pass', 'rePass']
    };
  } 
  return result;
}

module.exports = router;