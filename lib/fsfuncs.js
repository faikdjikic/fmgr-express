const fs = require("fs");
//const config = require('./config');
module.exports = {
    fileExists: function (testPath) {
        return new Promise((resolve, reject) => {
            fs.access(testPath, fs.F_OK, (err) => {
                if (!err) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            });
        });
    },
    fileDelete: function (filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    resolve({ ErrorCode: err.errno, Success: false, ErrorDesc: err.message });
                } else {
                    resolve({ ErrorCode: 0, Success: true });
                }
            });
        });
    },

    fileStats: function (filePath) {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    resolve({ ErrorCode: err.errno, Success: false, ErrorDesc: err.message });
                } else {
                    resolve({ ErrorCode: 0, Success: true, Stats: stats });
                }
            });
        });
    },
    fileRename: function (oldPath, newFPath, rootDir, config) {
        return new Promise((resolve, reject) => {

            fs.rename(oldPath, newFPath, (err) => {
                if (err) {
                    resolve({ ErrorCode: err.errno, Sucess: false, ErrorDesc: err.message })
                } else {
                    resolve({ ErrorCode: 0, Sucess: true, fileName: config.fmRootUrl + newFPath.replace(rootDir, "") });
                }
            });
        });
    },
    dirCreate: function (newDPath, rootDir, config) {
        return new Promise((resolve, reject) => {

            fs.mkdir(newDPath, (err) => {
                if (err) {
                    resolve({ ErrorCode: err.errno, Sucess: false, ErrorDesc: err.message })
                } else {
                    resolve({ ErrorCode: 0, Sucess: true, directoryName: config.fmRootUrl + newDPath.replace(rootDir, "") });
                }
            });
        });
    },
    dirList: function (dirPath) {
        return new Promise((resolve, reject) => {

            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    resolve({ ErrorCode: err.errno, Sucess: false, ErrorDesc: err.message })
                } else {
                    resolve({ ErrorCode: 0, Sucess: true, Files: files });
                }
            });
        });
    },
}