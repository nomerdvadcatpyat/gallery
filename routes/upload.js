const express = require('express');
const router = express.Router();
const path = require('path');
const dbapi = require('../dbAPI');
const config = require('../config');
const fs = require('fs');
const gm = require('gm');

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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const err = new Error('Extention');
      err.code = "EXTENTION"
      return cb(err);
    }
    cb(null, true);
  }
}).single('file'); // 'file' это name инпута из формы

router.post('/image', (req, res) => {
  upload(req, res, err => {
    if(err) {
      let error = '';
      if(err.code === 'LIMIT_FILE_SIZE') 
        error = "Картинка не более 5mb";
      if(err.code === 'EXTENTION') 
        error = 'Только jpeg и png';
      console.log(error);
      res.json({
        ok: false,
        error
      });
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
          alt: req.body.alt,
          owner: req.session.userLogin })
        .then(data => {
          // console.log('add image in db', data)
        })
        .catch(err => console.log('err from add image in db', err));

      });
  

  
      res.json({
        ok: true
      });
    }  
  });
});

module.exports = router;