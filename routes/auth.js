const { Router } = require('express');
const { check } = require('express-validator');

const {login, googleSignIn, renovarToken} = require('../controllers/auth');
const { validate_fields, validarJWT } = require('../middlewares');
const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La constraseña es obligatorio').not().isEmpty(),
    validate_fields
], login);

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validate_fields
], googleSignIn);

router.get('/', validarJWT, renovarToken );

module.exports = router;