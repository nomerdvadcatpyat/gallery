const express = require('express');
const router = express.Router();
const path = require('path');
const Sharp = require('sharp'); // модуль для сжатия изображений
const mkdirp = require('mkdirp'); // модуль для создания папок
const multer = require('multer'); // модуль для обработки файлов
const config = require('../config');
const diskStorage = require('../utils/diskStorage');
const sharp = require('sharp');
const dbapi = require('../dbAPI');

const rs = () => 
  Math.random()
  .toString(36)
  .slice(-3);

const storage = diskStorage({
  destination: (req, file, cb) => {
    // const dir = '/' + rs() + '/' + rs();
    const dir = '/' + rs();
    console.log(dir);
    req.dir = '/' + config.IMAGES_DESTINATION + dir; // Записываем расположение относительно папки со статикой, тк нужно будет рендерить кратинку с помощью этого пути

    console.log(config.STATIC_DESTINATION + '/' + config.IMAGES_DESTINATION  + dir);
    mkdirp(config.STATIC_DESTINATION + '/' + config.IMAGES_DESTINATION  + dir )
    .then(path => cb(null, path))
    .catch(err => cb(err, null));
  },
  filename: (req, file, cb) => {
    const userId = req.session.userId;
    const fileName = Date.now().toString(36) + path.extname(file.originalname);
    const imagePath = req.dir + '/' + fileName;

    console.log(userId, fileName, imagePath);
    console.log('body ', req.body);

    dbapi.uploadImage({ path: imagePath, alt: req.body.alt, owner: userId })
    .then(data => {
      console.log('add image in db', data)
    })
    .catch(err => console.log('err from add image in db', err));

    cb(null, fileName)
  }, 
  sharp: (req, res, cb) => {
    const resizer = Sharp()
    .resize(1024, 768, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFormat('jpg')
    .jpeg({
      quality: 40,
      progressive: true
    });
    cb(null, resizer);
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
    console.log('err', err)
    if(err) {
      if(err.code === 'LIMIT_FILE_SIZE') {
        error = "Картинка не более 5mb"
      }
      if(err.code === 'EXTENTION') {
        error = 'Только jpeg и png'
      }
    }
    console.log(error);
    res.json({
      ok: !error,
      error
    })
  });
});

module.exports = router;