const {Router} = require('express');
const {check} = require('express-validator');
const {validateFields, validateJWT} = require('../middlewares');
const {login, googleSignIn, renewToken} = require("../controllers/auth");

const router = Router();

// Inicio de sesión
router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El contraseña es obligatorio').not().isEmpty(),
    validateFields
], login);

// Inicio de sesion por google
router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validateFields
], googleSignIn);

router.get('/', [
    validateJWT
], renewToken)

module.exports = router;