const express = require('express');
const router = express.Router();
const path = require('path');
const dbapi = require('../dbAPI');
const config = require('../config');

const multer = require('multer'); // модуль для обработки файлов

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, path.join(config.STATIC_DESTINATION, config.IMAGES_DESTINATION));
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
    let error = '';
    if(err) {
      if(err.code === 'LIMIT_FILE_SIZE') {
        error = "Картинка не более 5mb"
      }
      if(err.code === 'EXTENTION') {
        error = 'Только jpeg и png'
      }
    }
    console.log('body1 ', req.body);
    console.log(req.file);
    console.log(req.session)
    console.log(error);

    dbapi.uploadImage({ path: path.join(`/${config.IMAGES_DESTINATION}`, req.file.filename), alt: req.body.alt, owner: req.session.userLogin })
    .then(data => {
      console.log('add image in db', data)
    })
    .catch(err => console.log('err from add image in db', err));

    res.json({
      ok: !error,
      error
    })
  });

  console.log('body2 ', req.body);
});

module.exports = router;