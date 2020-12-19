const express = require('express');
const router = express.Router();
const path = require('path');
const dbapi = require('../dbAPI');
const config = require('../config');
const fs = require('fs');
const gm = require('gm');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');



router.get('/image', (req, res) => {
  res.render('upload', { userLogin: req.session.userLogin });
});


const multer = require('multer'); // модуль для сохранения картинок
const { stdout } = require('process');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(config.STATIC_DESTINATION, config.FULL_IMAGES_DESTINATION));
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, next) => {
    console.log(req);
    const ext = path.extname(file.originalname);
    if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const err = new Error('Extention');
      err.code = "EXTENTION"
      next(err);
    }
    next(null, true);
  }
}).single('file'); // 'file' это name инпута из формы

router.post('/image',
  (req, res) => { 
    upload(req, res, err => {
      if(err) {
        let error = '';
        if(err.code === 'LIMIT_FILE_SIZE') 
          error = "Картинка не более 5mb";
        if(err.code === 'EXTENTION') 
          error = 'Только jpeg и png';
        console.log(error);
        res.render('upload',{ error: error , alt: req.body['img-descr'] });
      }
      else {
        console.log('body1 ', req.body);
        console.log(req.file);
        console.log(req.session)
        gm(req.file.path)
        .resize(600)
        .write(path.join(req.file.destination, config.MIN_IMAGES_DESTINATION, req.file.filename), function(err, stdout) {
          if(err) console.log('image err', err);
          console.log('image std', stdout);

          dbapi.uploadImage({ 
            fullImage: path.join(`/${config.FULL_IMAGES_DESTINATION}`, req.file.filename), // В базу записываем относительно /public (статик директория для express)
            minImage: path.join(`/${config.FULL_IMAGES_DESTINATION + '/' + config.MIN_IMAGES_DESTINATION}`, req.file.filename),  
            alt: req.body['img-descr'],
            owner: req.session.userLogin })
          .then(data => {
            // console.log('add image in db', data)
            res.redirect('/');
          })
          .catch(err => console.log('err from add image in db', err));
        });
      }  
    });
  } 
);

module.exports = router;