const { Router } = require('express');
const { check } = require('express-validator');

const {login} = require('../controllers/auth');
const { validate_fields } = require('../middlewares/validate-fields');
const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La constraseña es obligatorio').not().isEmpty(),
    validate_fields
], login);

module.exports = router;