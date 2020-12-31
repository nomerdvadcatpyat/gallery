const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dbapi = require('../utils/dbAPI.js');
const config = require('../config');
const gm = require('gm');
const multer = require('multer'); // модуль для сохранения картинок
const sizeOf = require('image-size');

const FULL_IMAGES_DIR = path.join(config.STATIC_DESTINATION, config.FULL_IMAGES_DESTINATION);
const MIN_IMAGES_DIR = path.join(config.STATIC_DESTINATION, config.MIN_IMAGES_DESTINATION);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(FULL_IMAGES_DIR));
  },
  filename: (req, file, cb) => {
    console.log(file);
    mkdirpath(FULL_IMAGES_DIR);
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const err = new Error('Extention');
      err.code = "EXTENTION"
      return cb(err);
    }
    cb(null, true);
  }
}).single('file'); // 'file' это name инпута из формы

router.post('/image', (req, res) => {
  upload(req, res, err => { // загружаем полноразмерную картинку
    if(err || !req.file) {
      let error = '';
      if(!req.file)
        error = "Вставьте картинку"
      else if(err.code === 'LIMIT_FILE_SIZE') 
        error = "Картинка не более 5mb";
      else if(err.code === 'EXTENTION') 
        error = 'Только jpeg и png';
      console.log(error);
      res.json({ ok: false, error });
    }
    else { // сжимаем картинку и затем пишем данные в бд
      console.log( MIN_IMAGES_DIR, req.file.filename);
      console.log(req.file)

      mkdirpath(MIN_IMAGES_DIR);

      gm(req.file.path)
      .resize(600)
      .write(path.join(MIN_IMAGES_DIR, req.file.filename), function(err, stdout) {
        if(err) console.log('image err', err);

        dbapi.uploadImage({ 
          fullImage: path.join(`/${config.FULL_IMAGES_DESTINATION}`, req.file.filename), // В базу записываем относительно /public (статик директория для express)
          minImage: path.join(`/${config.MIN_IMAGES_DESTINATION}`, req.file.filename),  
          minImageHeight: sizeOf(path.join(__dirname, '..' , MIN_IMAGES_DIR, req.file.filename)).height,
          alt: req.body.alt,
          owner: req.session.userLogin })
        .then(data => {
          res.json({
            ok: true
          });
        })
        .catch(err => console.log('err from add image in db', err));
      });
    }  
  });
});

function mkdirpath(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  } else {
    console.log("Directory already exist");
  }
}

module.exports = router;