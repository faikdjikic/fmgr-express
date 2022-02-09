const ejsFn=require('./ejsfuncs');
const fsFn=require('./fsfuncs');
const path = require("path");
module.exports=async function uploadFile(req,config,rootDir) {

    const allowExtensions = config.allowExtensions || ["jpg", "jpeg", "png", "gif"];
    const overwrite = config.overwrite || false;
    const extension = req.file.originalname.split(".").reverse()[0];
    const size = req.file.size;
    if(config.allowSize>0 && size>config.allowSize){
        const fDel = await fsFn.fileDelete(req.file.path);
        if (fDel.ErrorCode != 0) console.log(`Error uploading ${req.file.originalname}: ${fDel.ErrorCode}\n${fDel.ErrorDesc}`);
        return { ErrorCode: 403, ErrorDesc: `File too large! Maximum file size is ${config.allowSize} bytes.`, Success: false };
    }
    if (!allowExtensions.includes(extension)) {
        const fDel = await fsFn.fileDelete(req.file.path);
        if (fDel.ErrorCode != 0) console.log(`Error uploading ${req.file.originalname}: ${fDel.ErrorCode}\n${fDel.ErrorDesc}`);
        return { ErrorCode: 403, ErrorDesc: `Forbidden file type "${extension}"`, Success: false };
    }
    const reqUrl = req.url;
    let newPath = `${rootDir}${reqUrl}${reqUrl.charAt(reqUrl.length - 1) == "/" ? "" : "/"}${req.file.originalname}`;
    const ifExists = await fsFn.fileExists(newPath);
    if (overwrite && ifExists) {
        const fDel = await fsFn.fileDelete(newPath);
        if (fDel.ErrorCode != 0) {
            fDel.fileName = req.file.originalname;
            //resolve(fDel);
            return fDel;
        }
    }

    while (await fsFn.fileExists(newPath)) {
        const rndName = Math.random().toString(36).substring(2, 9);
        const newName = req.file.originalname.split(".");
        newName.splice(newName.length - 1, 0, rndName);
        newPath = `${rootDir}${reqUrl}${reqUrl.charAt(reqUrl.length - 1) == "/" ? "" : "/"}${newName.join(".")}`
    }
    const renamedFile = await fsFn.fileRename(req.file.path, newPath, rootDir);
    if (renamedFile.ErrorCode == 0) {
        const fProps = await fsFn.fileStats(newPath);
        let fileType = config.fileTypes.filter(ftype => {
            let extArr = renamedFile.fileName.split(".");
            return ftype.extensions.includes(extArr[extArr.length - 1])
        });
        let fName = renamedFile.fileName.split("/").reverse()[0];
        let fURLArr = renamedFile.fileName.split("/").reverse();
        fURLArr[0] = encodeURIComponent(fURLArr[0]);
        fURL = fURLArr.reverse().join("/");
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