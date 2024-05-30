const fs = require('fs');
const path = require('path');

function deleteFile(file) {
    return new Promise((resolve, reject) => {
        const projectRoot = path.resolve(__dirname, '../');
        const filePath = path.join(projectRoot, 'uploads', file.originalname);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        } else {
            resolve(true);
        }
    });
}

module.exports = {
    deleteFile
};
