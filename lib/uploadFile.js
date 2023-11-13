const ejsFn = require('./ejsfuncs');
const fsFn = require('./fsfuncs');
const path = require("path");
module.exports = async function uploadFile(reqFile, reqUrl, config, rootDir) {

    const allowExtensions = config.allowExtensions || ["jpg", "jpeg", "png", "gif"];
    const overwrite = config.overwrite || false;
    const extension = reqFile.originalname.split(".").reverse()[0];
    const size = reqFile.size;
    if (config.allowSize > 0 && size > config.allowSize) {
        const fDel = await fsFn.fileDelete(reqFile.path);
        if (fDel.ErrorCode != 0) console.log(`Error uploading ${reqFile.originalname}: ${fDel.ErrorCode}\n${fDel.ErrorDesc}`);
        return { ErrorCode: 403, ErrorDesc: `File  "${reqFile.originalname}" too large! Maximum file size is ${config.allowSize} bytes.`, Success: false };
    }
    if (!allowExtensions.map(ext => ext.toLowerCase()).includes(extension.toLowerCase())) {
        const fDel = await fsFn.fileDelete(reqFile.path);
        if (fDel.ErrorCode != 0) console.log(`Error uploading ${reqFile.originalname}: ${fDel.ErrorCode}\n${fDel.ErrorDesc}`);
        return { ErrorCode: 403, ErrorDesc: `Forbidden file type "${extension}"`, Success: false };
    }
    //const reqUrl = req.url;
    let newPath = `${rootDir}${reqUrl}${reqUrl.charAt(reqUrl.length - 1) == "/" ? "" : "/"}${reqFile.originalname}`;
    const ifExists = await fsFn.fileExists(newPath);
    if (overwrite && ifExists) {
        const fDel = await fsFn.fileDelete(newPath);
        if (fDel.ErrorCode != 0) {
            fDel.fileName = reqFile.originalname;
            //resolve(fDel);
            return fDel;
        }
    }

    while (await fsFn.fileExists(newPath)) {
        const rndName = Math.random().toString(36).substring(2, 9);
        const newName = reqFile.originalname.split(".");
        newName.splice(newName.length - 1, 0, rndName);
        newPath = `${rootDir}${reqUrl}${reqUrl.charAt(reqUrl.length - 1) == "/" ? "" : "/"}${newName.join(".")}`
    }
    const renamedFile = await fsFn.fileRename(reqFile.path, newPath, rootDir);
    if (renamedFile.ErrorCode == 0) {
        const fProps = await fsFn.fileStats(newPath);
        let fileType = config.fileTypes.filter(ftype => {
            let extArr = renamedFile.fileName.split(".");
            return ftype.extensions.map(ext => ext.toLowerCase()).includes(extArr[extArr.length - 1].toLowerCase())
        });
        const fName = renamedFile.fileName.split("/").reverse()[0];
        const fURL = renamedFile.fileName.split("/").map(part=>encodeURIComponent(part)).join("/");
        const sFile = {
            name: fName,
            icon: fileType.length == 0 ? fileIcon = config.fileTypes.find(ftype => ftype.type == "file").icon : fileIcon = fileType[0].icon,
            url: fURL,
            props: fProps.Stats
        }
        const data = {
            sFile,
            locale: config.locale,
        }
        const renderSingle = await ejsFn.renderFile(path.join(__dirname, "..", "views", "singleFile.ejs"), data);
        if (renderSingle.ErrorCode == 0) {
            sFile.html = renderSingle.result;
            sFile.ErrorCode = 0;
            return sFile;
        } else {
            return renderSingle;
        }
    } else {
        return renamedFile;
    }

}