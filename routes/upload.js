const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dbapi = require('../utils/dbAPI.js');
const config = require('../config');
const Jimp = require('jimp');
const multer = require('multer'); // модуль для сохранения картинок
const sizeOf = require('image-size');

const FULL_IMAGES_DIR = path.join(config.STATIC_DESTINATION, config.FULL_IMAGES_DESTINATION);
const MIN_IMAGES_DIR = path.join(config.STATIC_DESTINATION, config.MIN_IMAGES_DESTINATION);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(FULL_IMAGES_DIR));
  },
  filename: (req, file, cb) => {
    mkdirpath(FULL_IMAGES_DIR);
    cb(null, path.basename(file.originalname) + Date.now() + path.extname(file.originalname))
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
}).array('files'); // 'files' это name инпута из формы

router.post('/image', (req, res) => {
  upload(req, res, err => { // загружаем полноразмерную картинку

    req.files.forEach(file => console.log(file.filename));

    const descriptions = JSON.parse(req.body.descriptions);

    if(err || !req.files.length === 0) {
      let error = '';
      if(req.files.length === 0 && !err)
        error = "Вставьте картинку";
      else if(err.code === 'LIMIT_FILE_SIZE') 
        error = "Картинка не более 5mb";
      else if(err.code === 'EXTENTION') 
        error = 'Только jpeg и png';
      console.log(error);
      res.json({ ok: false, error });
    }
    else { // сжимаем картинки и затем пишем данные в бд
      mkdirpath(MIN_IMAGES_DIR);

      (async() => {
        const images = [];
        await Promise.all(req.files.map(async image => {

          for(let key in descriptions) {
            if(image.filename.startsWith(key)) {
              image.alt = descriptions[key];
              break;
            }
          }

          image.owner = req.session.userLogin;
          const resizedImage = await getResizedImage(image);
          images.push(resizedImage);
        }));
        dbapi
          .uploadImages(images)
          .then(() => res.json( { ok: true } ))
          .catch(err => console.log(err));
      })();

    }  
  });
});

async function getResizedImage(image) {
  return new Promise((resolve, reject) => {
    Jimp.read(image.path)
        .then(fullPic => {
          fullPic.resize(600, Jimp.AUTO)
              .write(path.join(MIN_IMAGES_DIR, image.filename), function(err, stdout) {
                  if (err) reject(err);
                  resolve({
                    fullImage: path.join(`/${config.FULL_IMAGES_DESTINATION}`, image.filename),
                    minImage: path.join(`/${config.MIN_IMAGES_DESTINATION}`, image.filename),
                    minImageHeight: sizeOf(path.join(__dirname, '..', MIN_IMAGES_DIR, image.filename)).height,
                    owner: image.owner,
                    alt: image.alt || '',
                    date_added: new Date()
                  });
              });
        })
        .catch(err => {
            console.log('jimp error', err);
        });
  });
}

function mkdirpath(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  } else {
    console.log("Directory already exist");
  }
}

module.exports = router;