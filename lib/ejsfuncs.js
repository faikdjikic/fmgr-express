const ejs = require('ejs');
function renderFile(filePath, data, options = {}) {
    return new Promise((resolve, reject) => {

        ejs.renderFile(filePath, data, options, function (err, str) {
            if (err) {
                resolve({ ErrorCode: 5001, Sucess: false, ErrorDesc: err.message })
            } else {
                resolve({ ErrorCode: 0, Sucess: true, result: str });
            }
        });
    });
}
module.exports = {renderFile};