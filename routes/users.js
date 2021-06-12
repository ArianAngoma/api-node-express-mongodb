const {Router} = require('express');
const {check} = require('express-validator');
const {usersGet, usersPost, usersPut, usersDelete} = require('../controllers/users');

/*const {validateFields} = require('../middlewares/validate-fields');
const {isAdminRole, hasRole} = require("../middlewares/validate-roles");
const {validateJWT} = require("../middlewares/validate-jwt");*/
const {validateFields, validateJWT, isAdminRole, hasRole} = require('../middlewares');

const {isValidRole, emailExists, userExistsById} = require("../helpers/db-validators");

const router = Router();

router.get('/', usersGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 carácter').isLength({min: 6}),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExists),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    validateFields
], usersPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistsById),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExists),
    check('role').custom(isValidRole),
    validateFields
], usersPut);

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], usersDelete);

module.exports = router;