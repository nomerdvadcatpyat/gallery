const express = require('express');
const router = express.Router();
const path = require('path');
const dbapi = require('../utils/dbAPI.js');
const config = require('../config');
const multer = require('multer'); // модуль для сохранения картинок
const sizeOf = require('image-size');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3-transform');
const url = require('url');
const https = require('https');
const sharp = require('sharp');

const s3 = new aws.S3({ 
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY
});

const storage = multerS3({
  s3: s3,
  bucket: 'galllery',
  acl: 'public-read-write',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, path.basename(file.originalname) + Date.now() + path.extname(file.originalname))
  },
  shouldTransform: function (req, file, cb) {
    cb(null, /^image/i.test(file.mimetype))
  },
  transforms: [{
    id: 'original',
    key: function (req, file, cb) {
      cb(null, path.basename(file.originalname) + Date.now()  + path.extname(file.originalname))
    },
    transform: function (req, file, cb) {
      cb(null, sharp().jpeg())
    }
  }, {
    id: 'thumbnail',
    key: function (req, file, cb) {
      cb(null, path.basename(file.originalname) + Date.now() + '-min' + path.extname(file.originalname)) 
    },
    transform: function (req, file, cb) {
      cb(null, sharp().resize({ width: 600 }).jpeg())
    }
  }]
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

    const descriptions = JSON.parse(req.body.descriptions);

    if(err || !req.files.length === 0) {
      let error = '';
      if(req.files.length === 0 && !err)
        error = "Вставьте картинку";
      else if(err.code === 'LIMIT_FILE_SIZE') 
        error = "Картинка не более 5mb";
      else if(err.code === 'EXTENTION') 
        error = 'Только jpeg и png';
      res.json({ ok: false, error });
    }
    else { // сжимаем картинки и затем пишем данные в бд
      (async() => {
        const images = [];
        await Promise.all(req.files.map(async image => {

          for(let key in descriptions) {
            if(image.originalname.startsWith(key)) {
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
  const minImageUrl = image.transforms.find(img => img.id === 'thumbnail').location
  const minImageHeight = await getMinImageHeight(minImageUrl);

  return new Promise((resolve, reject) => {
      resolve({
        fullImage: image.transforms.find(img => img.id === 'original').location,
        minImage: minImageUrl,
        minImageHeight: minImageHeight,
        owner: image.owner,
        alt: image.alt || '',
        date_added: new Date()
      });
  });
}

async function getMinImageHeight(imgUrl) {
  return new Promise((res, rej) => {
    const options = url.parse(imgUrl);

    https.get(options, function (response) {
      const chunks = []
      response.on('data', function (chunk) {
        chunks.push(chunk)
      }).on('end', function() {
        const buffer = Buffer.concat(chunks)
        res(sizeOf(buffer).height);
      })
    })
  });
}

module.exports = router;