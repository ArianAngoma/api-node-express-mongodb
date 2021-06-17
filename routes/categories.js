const {Router} = require('express');
const {check} = require('express-validator');
const {validateJWT, validateFields, isAdminRole} = require('../middlewares');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

const {categoryExistsById, isStateCategoryTrue, existsCategoryByName} = require("../helpers/db-validators");

const router = Router();

router.get('/', [
    validateJWT
], getCategories)

router.get('/:id', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExistsById),
    // check('id').custom(isStateCategoryTrue),
    validateFields
], getCategory)

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name').custom(existsCategoryByName),
    validateFields
], createCategory)

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExistsById),
    check('id').custom(isStateCategoryTrue),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name').custom(existsCategoryByName),
    validateFields
], updateCategory)

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExistsById),
    check('id').custom(isStateCategoryTrue),
    validateFields
], deleteCategory)

module.exports = router;