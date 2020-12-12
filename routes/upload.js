const express = require('express');
const router = express.Router();
const path = require('path')

const multer = require('multer'); // модуль для обработки файлов

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, 'public/images');
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
    console.log(error);
    res.json({
      ok: !error,
      error
    })
  });
});

module.exports = router;