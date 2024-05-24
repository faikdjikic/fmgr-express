module.exports = function (options) {
  const express = require('express');
  const router = express.Router();
  const configOriginal = require('./lib/config');
  const path = require("path");
  const process = require("process");
  const appDir = process.cwd();
  const multer = require("multer");
  const upload = multer({ dest: "uploads" });
  const uploadFile = require('./lib/uploadFile');
  const makeDirectory = require('./lib/makeDir');
  const listDirectory = require('./lib/listDir');
  const searchDirectory = require('./lib/searchDir');
  const config = {};
  Object.assign(config, configOriginal);
  Object.keys(options).forEach(key => config[key] = options[key]);

  if (!config.maxsize) {
    config.allowSize = 2 * Math.pow(1024, 2);
    return;
  };
  let unitPow = 2;
  if (isNaN(config.maxsize)) {
    let maxSizeUnit = String(config.maxsize).substring(String(config.maxsize).length - 1).toUpperCase();
    let maxSizeValue = Number(String(config.maxsize).substring(0, String(config.maxsize).length - 1));
    if (maxSizeUnit == 'K') {
      unitPow = 1;
    } else if (maxSizeUnit == 'G') {
      unitPow = 3;
    }
    config.allowSize = maxSizeValue * Math.pow(1024, unitPow)
  } else {
    config.allowSize = config.maxsize * Math.pow(1024, unitPow);
  }

  /* Upload file or make directory. */
  router.post('*', upload.array('uFile'), async function (req, res, next) {
    const rootDirArr = config.fmRootDir.split("/");
    const rootDir = path.join(appDir, ...rootDirArr);
    if (req.files) {
      if (req.files.length > (config.maxfiles || 20)) {
        const message = `Too many files.\nMaximum of ${config.maxfiles || 20} files allowed.`
        res.json({ ErrorCode: 500, ErrorDesc: `Upload error: ${message}` });
        const { fileDelete } = require('./lib/fsfuncs');
        for (i = 0; i < req.files.length; i++) {
          fileDelete(req.files[i].path);
        }
        return;
      }
      const retVals = [];
      for (i = 0; i < req.files.length; i++) {
        const retVal = await uploadFile(req.files[i], decodeURIComponent(req.url), config, rootDir);
        retVals.push(retVal);
      }
      res.json({ ErrorCode: 0, files: retVals });
    } else if (req.body.dirName) {
      const retVal = await makeDirectory(req, config, rootDir);
      res.json(retVal);
    } else {
      res.json({ ErrorCode: 403, ErrorDesc: `No file received! You did not send valid multipart form data.`, Success: false });
      return;
    }

  });
  /* List directory or search files by pattern */
  router.get('*', async function (req, res, next) {
    const rootDirArr = config.fmRootDir.split("/");
    const rootDir = path.join(appDir, ...rootDirArr);
    let getDirList;
    if (req.query.q) {
      getDirList = await searchDirectory(req, next, config, rootDir);
    } else {
      getDirList = await listDirectory(req, next, config, rootDir);
    }
    if (getDirList.ErrorCode == 0) {
      getDirList.data.maxfiles = config.maxfiles;
      getDirList.data.maxsize = config.allowSize;
      getDirList.data.allowextensions = config.allowExtensions;
      res.render(path.join(__dirname, '.', 'views', 'index'), getDirList.data);
    } else {
      getDirList.baseUrl = config.baseUrl;
      res.render(path.join(__dirname, '.', 'views', 'error'), getDirList);
    }
  });
  router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code == 'LIMIT_UNEXPECTED_FILE') err.message = `Too manu files.\nMaximum of ${config.maxfiles || 20} files allowed.`
      return res.json({ ErrorCode: 500, ErrorDesc: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred.
      console.log('Unknown Error:', err);
      return res.json({ ErrorCode: err.code, ErrorDesc: err.message });
    }

    // No errors, pass to next middleware
    next();
  });
  return router;
}
