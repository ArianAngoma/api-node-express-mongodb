const {Router} = require('express');
const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields')
const {login} = require("../controllers/auth");

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El contraseña es obligatorio').not().isEmpty(),
    validateFields
], login);

module.exports = router;