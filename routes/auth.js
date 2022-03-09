const { Router } = require('express');
const { check } = require('express-validator');

const {login, googleSignIn} = require('../controllers/auth');
const { validate_fields } = require('../middlewares/validate-fields');
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

module.exports = router;