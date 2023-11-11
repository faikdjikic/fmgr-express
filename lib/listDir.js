const fsFn = require('./fsfuncs');
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const { encode } = require('punycode');
module.exports = async function listDir(req, next, config, rootDir) {
    const baseUrl = req.baseUrl;
    const reqUrl = decodeURIComponent(req.url.split('?')[0]);
    const reqQuery = req.query;
    const allTypes = config.fileTypes.map(item => item.type != "file" ? item.type : "").filter(item => item != "");
    const activePath = reqUrl.split("/");
    const filterbytype = Array.isArray(req.query.type) ? req.query.type : req.query.type ? req.query.type.split(",") : [] || [];
    let listExt = [];
    if (filterbytype.length) {
        config.fileTypes.forEach(item => {
            if (filterbytype.includes(item.type.toLowerCase())) listExt = [...listExt, ...item.extensions];
        })
    }
    const activeDir = path.join(rootDir, ...activePath)
    config.baseUrl = baseUrl;
    config.reqUrl = reqUrl;
    config.reqQuery = reqQuery;
    config.activePath = activePath;
    config.activeDir = activeDir
    if (activeDir.substring(0, rootDir.length) != rootDir) {
        return { ErrorCode: 403, ErrorDesc: "Forbidden" };;
    }
    if (!await fsFn.fileExists(activeDir)) {
        let relPath=activePath.filter(item=>item!='').join("/");
        return { ErrorCode: 404.1,ErrorDesc:relPath==""?`Assets root directory does not exist! Please create directory ${config.fmRootDir}`:`Directory /${relPath} does not exist!`};
    }
    const getFStats = await fsFn.fileStats(activeDir);
    if (!getFStats.Stats.isDirectory()) {
        return { ErrorCode: 404,ErrorDesc:`File /${activePath.filter(item=>item!='').join("/")} is not a directory!` };
    }
    const getFiles = await fsFn.dirList(activeDir);
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
        const fStats = await fsFn.fileStats(path.join(activeDir, getFiles.Files[i]));
        if (fStats.ErrorCode != 0) return fStats;
        const fProps = fStats.Stats;
        listedFiles.push({
            name: getFiles.Files[i],
            extension: getFiles.Files[i].indexOf(".") > -1 ? getFiles.Files[i].split(".").reverse()[0] : "",
            icon: fileType.length == 0 ? fileIcon = config.fileTypes.find(ftype => ftype.type == "file").icon : fileIcon = fileType[0].icon,
            url: [config.fmRootUrl, ...(activePath.filter(item => item != "").map(part=>encodeURIComponent(part))), encodeURIComponent(getFiles.Files[i])].join("/"),
            props: fProps
        })
    }
    listedFiles.forEach(file => console.log(file.name, file.props.birthtime, file.props.size, file.props.isDirectory()));
    const data = {
        files: listedFiles.filter(item => !item.props.isDirectory() && (listExt.length > 0 ? listExt.includes(item.extension) : true)),
        dirs: listedFiles.filter(item => item.props.isDirectory()),
        path: activePath.filter(item => item != ""),
        locale: config.locale,
        baseUrl,
        reqUrl,
        reqQuery,
        allTypes,
        filterbytype,
        fmRootUrl: config.fmRootUrl,
        isSearch: false,
    }
    return { ErrorCode: 0, data };
}
