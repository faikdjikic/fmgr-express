const ejsFn = require('./ejsfuncs');
const fsFn = require('./fsfuncs');
const path = require("path");
const { dirname } = require('path');
module.exports = async function makeDirectory(req, config, rootDir) {
    const baseUrl = req.baseUrl;
    const dirName = req.body.dirName;
    const reqUrl = req.url;
    let newPath = `${rootDir}${decodeURIComponent(reqUrl)}${reqUrl.charAt(reqUrl.length - 1) == "/" ? "" : "/"}${dirName}`;
    const ifExists = await fsFn.fileExists(newPath);
    if (ifExists) {
        const dirExists = { ErrorCode: -17, ErrorDesc: `Directory "${dirName}" already exists in ${reqUrl == '/' ? "assets root directory" : decodeURIComponent(reqUrl)}`, Success: false };
        return dirExists;
    }
    const mkDir = await fsFn.dirCreate(newPath, rootDir, config);
    if (mkDir.ErrorCode != 0) return mkDir;
    const dirStats = await fsFn.fileStats(newPath);
    if (dirStats.ErrorCode != 0) return dirStats;
    let dName = mkDir.directoryName.split("/").reverse()[0];
    let dURLArr = mkDir.directoryName.split("/").reverse();
    dURLArr[0] = encodeURIComponent(dURLArr[0]);
    dURL = dURLArr.reverse().join("/");
    const sDir = {
        name: dName,
        url: dURL,
        props: dirStats.Stats,
    }
    const data = {
        sDir,
        locale: config.locale,
        fmRootUrl: config.fmRootUrl,
        baseUrl
    }
    const renderSingle = await ejsFn.renderFile(path.join(__dirname, "..", "views", "singleDir.ejs"), data);
    if (renderSingle.ErrorCode == 0) {
        sDir.html = renderSingle.result;
        sDir.ErrorCode = 0;
        return sDir;
    } else {
        return renderSingle;
    }

}