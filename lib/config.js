module.exports = {
    fmRootDir: '/public/assets',
    fmRootUrl: '/assets',
    locale: 'de-DE',
    overwrite: false,
    maxsize:'2M',
    allowExtensions: ["svg", "jpg", "jpeg", "gif", "png", "xls", "xlsx", "ppt", "pptx", "pps", "ppsx", "zip", "doc", "docx", "mp3", "ogg", "oga", "mogg", "wav", "webm", "ogv", "ogg", "mng", "avi", "mp4", "mpg", "mpeg", "pdf"],
    fileTypes: [
        {
            type: "image",
            extensions: ["svg", "jpg", "jpeg", "gif", "png"],
            icon: "file-item-img"
        },
        {
            type: "archive",
            extensions: ["7z", "ace", "afa", "alz", "apk", "arc", "arj", "ark", "b1", "b6z", "ba", "bh", "bz2", "cab", "car", "cdx", "cfs", "cpt", "dar", "dd", "dgc", "dmg", "ear", "gca", "genozip", "gz", "ha", "hki", "ice", "jar", "kgb", "lha", "lz", "lzh", "lzx", "pak", "paq6", "paq7", "paq8", "partimg", "pea", "phar", "pim", "pit", "qda", "rar", "rk", "s7z", "sda", "sea", "sen", "sfx", "shk", "sit", "sitx", "sqx", "tbz2", "tgz", "tlz", "txz", "uc", "uc0", "uc2", "uca", "ucn", "ue2", "uha", "ur2", "war", "wim", "xar", "xp3", "xz", "yz1", "Z", "zip", "zipx", "zoo", "zpaq", "zst", "zz"],
            icon: "fa-file-archive"
        },
        {
            type: "word",
            extensions: ["doc", "docm", "docx", "dot", "dotm", "dotx"],
            icon: "fa-file-word"
        },
        {
            type: "excel",
            extensions: ["xlsx", "xlsm", "xlsb", "xltx", "xltm", "xls", "xlt", "xlam", "xla", "xlw", "xlr"],
            icon: "fa-file-excel"
        },
        {
            type: "powerpoint",
            extensions: ["pptx", "pptm", "ppt", "potx", "potm", "pot", "ppsx", "ppsm", "pps", "ppa", "ppam"],
            icon: "fa-file-powerpoint"
        },
        {
            type: "sound",
            extensions: ["3gp", "aa", "aac", "aax", "act", "aiff", "alac", "amr", "ape", "au", "awb", "dss", "dvf", "flac", "gsm", "iklax", "ivs", "m4a", "m4b", "m4p", "mmf", "mp3", "mpc", "msv", "nmf", "ogg", "oga", "mogg", "opus", "ra", "rm", "raw", "rf64", "sln", "tta", "voc", "vox", "wav", "wma", "wv", "8svx", "cda"],
            icon: "fa-file-audio"
        },
        {
            type: "video",
            extensions: ["webm", "mkv", "flv", "flv", "vob", "ogv", "ogg", "drc", "gifv", "mng", "avi", "MTS", "M2TS", "TS", "mov", "qt", "wmv", "yuv", "rm", "rmvb", "viv", "asf", "amv", "mp4", "m4p", "m4v", "mpg", "mp2", "mpe", "mpv", "mpeg", "m2v", "m4v", "svi", "3gp", "3g2", "mxf", "roq", "nsv", "flv", "f4v", "f4p", "f4a", "f4b"],
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