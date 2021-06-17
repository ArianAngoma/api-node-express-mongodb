const {Router} = require('express');
const {check} = require('express-validator');
const {validateJWT, validateFields, isAdminRole} = require('../middlewares');
const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/products');

const {
    categoryExistsById,
    productExistsById,
    isStateCategoryTrue,
    isStateProductTrue,
    existsProductByName
} = require("../helpers/db-validators");

const router = Router();

router.get('/', [
    validateJWT
], getProducts)

router.get('/:id', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExistsById),
    check('id').custom(isStateProductTrue),
    validateFields
], getProduct)

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name').custom(existsProductByName),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('category', 'No es id de Mongo válido').isMongoId(),
    check('category').custom(categoryExistsById),
    validateFields
], createProduct)

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExistsById),
    check('id').custom(isStateProductTrue),
    check('name').custom(existsProductByName),
    validateFields
], updateProduct)

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExistsById),
    check('id').custom(isStateProductTrue),
    check('id').custom(productExistsById),
    validateFields
], deleteProduct)

module.exports = router;