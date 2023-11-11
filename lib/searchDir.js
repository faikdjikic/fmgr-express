const { glob } = require('glob');
const path = require("path");
const fsFn = require('./fsfuncs');
const fs = require("fs");
const ejs = require('ejs');
module.exports = async function searchDir(req, next, config, rootDir) {
    const baseUrl = req.baseUrl;
    const reqUrl = req.url.split('?')[0];
    const reqQuery = req.query;
    let pattern = req.query.q || '*';
    const allTypes = config.fileTypes.map(item => item.type != "file" ? item.type : "").filter(item => item != "");
    const activePath = reqUrl.split("/");
    const activeDir = rootDir;
    let rootDirUrl = rootDir.replace(/\\/g, "/");
    if (rootDirUrl.charAt(rootDirUrl.length - 1) != "/") rootDirUrl += "/";
    config.baseUrl = baseUrl;
    config.reqUrl = reqUrl;
    config.reqQuery = reqQuery;
    config.activePath = activePath;
    config.activeDir = activeDir
    if (activeDir.substring(0, rootDir.length) != rootDir) {
        return { ErrorCode: 403, ErrorDesc: "Forbidden" };
    }
    const getFiles = await searchGlob(rootDir.replace(/\\/g, "/") + `/**/*${pattern}*`);
    // const getFiles = await fsFn.dirList(activeDir);
    if (getFiles.ErrorCode != 0) return getFiles;
    const listedFiles = [];
    for (let i = 0; i < getFiles.Files.length; i++) {
        let fileIcon;
        let fileType = config.fileTypes.filter(ftype => {
            let extArr = getFiles.Files[i].split(".");
            return ftype.extensions.map(ext => ext.toLowerCase()).includes(extArr[extArr.length - 1].toLowerCase())
        });
        if (fileType.length == 0) {
            fileIcon = config.fileTypes.find(ftype => ftype.type == "file").icon;
        } else {
            fileIcon = fileType[0].icon;
        }
        const fStats = await fsFn.fileStats(getFiles.Files[i]);
        if (fStats.ErrorCode != 0) return fStats;
        const fProps = fStats.Stats;
        const currentFile = getFiles.Files[i].indexOf(path.sep) > -1 ? getFiles.Files[i].split(path.sep).reverse()[0] : getFiles.Files[i];
        let currentFilePath = getFiles.Files[i].indexOf(path.sep) > -1 ? (getFiles.Files[i].split(path.sep).slice(0, -1).join("/") + "/").replace(rootDirUrl, "") : getFiles.Files[i].replace(rootDirUrl, "");
        if (currentFilePath.charAt(currentFilePath.length - 1) == "/") currentFilePath = currentFilePath.slice(0, -1);
        listedFiles.push({
            name: currentFile,
            extension: currentFile.indexOf(".") > -1 ? currentFile.split(".").reverse()[0] : "",
            icon: fileType.length == 0 ? fileIcon = config.fileTypes.find(ftype => ftype.type == "file").icon : fileIcon = fileType[0].icon,
            url: [config.fmRootUrl, currentFilePath.split('/').map(part=>encodeURIComponent(part)).join('/'), encodeURIComponent(currentFile)].filter(item => item != "").join("/"),
            props: fProps
        })
    }
    listedFiles.forEach(file => console.log(file.name, file.props.birthtime, file.props.size, file.props.isDirectory(), file.url));
    const data = {
        files: listedFiles.filter(item => !item.props.isDirectory()),
        dirs: listedFiles.filter(item => item.props.isDirectory()),
        path: [],
        locale: config.locale,
        baseUrl,
        reqUrl,
        reqQuery,
        allTypes,
        filterbytype: [],
        fmRootUrl: config.fmRootUrl,
        isSearch: pattern,
    }
    return { ErrorCode: 0, data };
}
async function searchGlob(pattern) {
    const files = await glob(pattern, { nocase: true });
    if (files.error) {
        return { ErrorCode: 500, files }
    } else {
        return { ErrorCode: 0, Files: files }
    }
    // return new Promise((resolve, reject) => {
    //     glob(pattern, { nocase: true }, function (er, files) {
    //         if (er) {
    //             console.log(er)
    //             resolve({ ErrorCode: 1, er, ErrorDesc: "Unable to perform search!" });
    //         } else {
    //             console.log(files)
    //             resolve({ ErrorCode: 0, Files: files });
    //         }
    //     });
    // });
}