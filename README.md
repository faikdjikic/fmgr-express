# fmgr-express
File manager for CKEditor in express.js
## Installation

Install with npm

```
npm i fmgr-express

or

npm i git@github.com:faikdjikic/fmgr-express.git
```
## Usage
```javascript
const options={
    fmRootDir: '/public/assets',
    fmRootUrl: '/assets',
    locale: 'en-US',
    overwrite: false, 
    maxsize: '5M',
    maxfiles: 10
    }
const filemanager = require("fmgr-express")(options);
const app = express();
app.use('/filemanager',filemanager);
```
## Using with CKEditor
```javascript
//add to CKEditor's config.js following lines
config.filebrowserBrowseUrl='/filemanager/';
config.filebrowserImageBrowseUrl='/filemanager/?type=image';
config.filebrowserUploadUrl='/filemanager/';
config.filebrowserImageUploadUrl='/filemanager/?type=image';
config.filebrowserWindowWidth='1200'; //set your own value for window width
config.filebrowserWindowHeight='800'; //set your own value for window height
```
## Using with custom input and fancybox
```html
<input type="text" name="MainImage" id="MainImage">
    <a
    href="javascript:void(0)"
    onclick="$.fancybox.open(
    {
        src: '/filemanager/?tElement=MainImage&cb=closeFancyBox',
        type: 'iframe',
        iframe:{
            css:{
                width : '75%',
                height: '100%'
            }
        }
    });">
    Select image
    </a>
    <script>
    function closeFancyBox(){
	    $.fancybox.close();
    }
    </script>
```
## Using with custom input and vanilla JS
```html
<input type="text" name="MainImage" id="MainImage">
    <a
    href="javascript:void(0)"
    onclick="window.open('/filemanager/?tElement=MainImage');">
    Select image
    </a>
```
## :warning: **Warning!!!**
Filemanager does not implement access control by itself. Please use proper middleware to limit user access and avoid abuse.
This is sample code for basic authentication using passport:
```javascript

const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const options={
    fmRootDir: '/public/assets',
    fmRootUrl: '/assets',
    locale: 'en-US',
    overwrite: false, 
    maxsize: '5M',
    maxfiles: 10
    }
const filemanager = require("fmgr-express")(options);
const app = express();
app.use(passport.initialize());
passport.use(new Strategy({ realm: loginfn.getRealm },
  function (username, password, cb) {
    findByUsername(username, function (err, user) {
      if (err) { return cb(err); }
      if (!user) return cb(null, false);
      if (user.password != password) return cb(null, false);
      return cb(null, user);
    });
  }));
app.use('/filemanager',
  passport.authenticate('basic', { session: false }),
  filemanager
);
```
## Default values (*to change these values modify options object*)
```javascript

module.exports = {
    fmRootDir: '/public/assets', //assets directory path relative to wwwroot
    fmRootUrl: '/assets', //assets directory url
    locale: 'de-DE', //locale for file dates
    overwrite: false, 
    /*
    * If overwrite is set to true, existing file will be overwritten, 
    * otherwise the new file will be renamed on upload
    */
    maxsize:'20M', 
    /**************************************************************************************
    * Sets the maximum size for single file, default 2M. 
    * Use K for kilobytes, M for megabytes and G for gigabytes. 
    * Default unit is M. 
    * To disable size limit set maxsize to 0
    */
    maxfiles: 20, //maximum number of files that can be uploaded at once
    allowExtensions: ["svg", "jpg", "jpeg", "gif", "png", "xls", "xlsx", "ppt", "pptx", 
    "pps", "ppsx", "zip", "doc", "docx", "mp3", "ogg", "oga", "mogg", "wav", "webm", "ogv", 
    "ogg", "mng", "avi", "mp4", "mpg", "mpeg", "pdf"], 
    /* The list of file extensions that are allowed for upload */
    
    /**************************************************************************************
    * fileTypes array groups files by extensions, 
    * define file icon (except for images where image itself is used as an icon). 
    * fileTypes type properties are used for filtering by type 
    * (e.g. /filemanager/?type=word,excel,pdf).
    */
    fileTypes: [
        {
            type: "image",
            extensions: ["svg", "jpg", "jpeg", "gif", "png"],
            icon: "file-item-img"
        },
        {
            type: "archive",
            extensions: ["7z", "ace", "afa", "alz", "apk", "arc", "arj", "ark", "b1", "b6z", 
            "ba", "bh", "bz2", "cab", "car", "cdx", "cfs", "cpt", "dar", "dd", "dgc", "dmg", 
            "ear", "gca", "genozip", "gz", "ha", "hki", "ice", "jar", "kgb", "lha", "lz", "lzh", 
            "lzx", "pak", "paq6", "paq7", "paq8", "partimg", "pea", "phar", "pim", "pit", "qda", 
            "rar", "rk", "s7z", "sda", "sea", "sen", "sfx", "shk", "sit", "sitx", "sqx", "tbz2", 
            "tgz", "tlz", "txz", "uc", "uc0", "uc2", "uca", "ucn", "ue2", "uha", "ur2", "war", 
            "wim", "xar", "xp3", "xz", "yz1", "Z", "zip", "zipx", "zoo", "zpaq", "zst", "zz"],
            icon: "fa-file-archive"
        },
        {
            type: "word",
            extensions: ["doc", "docm", "docx", "dot", "dotm", "dotx"],
            icon: "fa-file-word"
        },
        {
            type: "excel",
            extensions: ["xlsx", "xlsm", "xlsb", "xltx", "xltm", "xls", "xlt", "xlam", "xla", 
            "xlw", "xlr"],
            icon: "fa-file-excel"
        },
        {
            type: "powerpoint",
            extensions: ["pptx", "pptm", "ppt", "potx", "potm", "pot", "ppsx", "ppsm", "pps", 
            "ppa", "ppam"],
            icon: "fa-file-powerpoint"
        },
        {
            type: "sound",
            extensions: ["3gp", "aa", "aac", "aax", "act", "aiff", "alac", "amr", "ape", "au", 
            "awb", "dss", "dvf", "flac", "gsm", "iklax", "ivs", "m4a", "m4b", "m4p", "mmf", "mp3", 
            "mpc", "msv", "nmf", "ogg", "oga", "mogg", "opus", "ra", "rm", "raw", "rf64", "sln", 
            "tta", "voc", "vox", "wav", "wma", "wv", "8svx", "cda"],
            icon: "fa-file-audio"
        },
        {
            type: "video",
            extensions: ["webm", "mkv", "flv", "flv", "vob", "ogv", "ogg", "drc", "gifv", "mng", 
            "avi", "MTS", "M2TS", "TS", "mov", "qt", "wmv", "yuv", "rm", "rmvb", "viv", "asf", 
            "amv", "mp4", "m4p", "m4v", "mpg", "mp2", "mpe", "mpv", "mpeg", "m2v", "m4v", "svi", 
            "3gp", "3g2", "mxf", "roq", "nsv", "flv", "f4v", "f4p", "f4a", "f4b"],
            icon: "fa-file-video"
        },
        {
            type: "pdf",
            extensions: ["pdf"],
            icon: "fa-file-pdf"
        },
        {
            type: "file",
            extensions: ["*"],
            icon: "fa-file"
        },

    ]
}
```
