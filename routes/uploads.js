const {Router} = require('express');
const {check} = require('express-validator');

const {validateFields, validateFileUpload} = require('../middlewares');
const {uploadFiles, updateImg, showImg, updateImgCloudinary} = require("../controllers/uploads");
const {collectionsAllowed} = require("../helpers");

const router = Router();

router.post('/', [
    validateFileUpload
], uploadFiles);

router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'Id no válido').isMongoId(),
    check('collection').custom(collection => collectionsAllowed(collection, ['users', 'products'])),
    validateFields
], updateImgCloudinary);
// Contolador para actulizar imagen local
/*], updateImg);*/

router.get('/:collection/:id', [
    check('id', 'Id no válido').isMongoId(),
    check('collection').custom(collection => collectionsAllowed(collection, ['users', 'products'])),
    validateFields
], showImg);

module.exports = router;