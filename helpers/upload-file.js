const path = require('path');
const {v4: uuidv4} = require('uuid');

const uploadFile = ({file}, extensionsValid = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
    return new Promise((resolve, reject) => {
        const nameCut = file.name.split('.');
        const extension = nameCut[nameCut.length - 1];

        // Validar la extensión
        if (!extensionsValid.includes(extension)) return reject(`La extensión ${extension} no es permitida - ${extensionsValid}`);

        const nameTemporary = `${uuidv4()}.${extension}`;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemporary);

        file.mv(uploadPath, (err) => {
            if (err) return reject(err);
            resolve(nameTemporary);
        });
    })
}

module.exports = {
    uploadFile
}