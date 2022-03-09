const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/usuarios');

const { isValidRole, existEmail, existUserById } = require('../helpers/db-validators');

const {validate_fields, validarJWT, isAdminRole, hasRole} = require('../middlewares');

const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 caracteres').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(existEmail),
    check('role').custom(isValidRole),
    validate_fields
], usuariosPost);

router.put('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existUserById),
    check('role').custom(isValidRole),
    validate_fields
], usuariosPut);

router.delete('/:id', [
    validarJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE','VENTAR_ROLE'),
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existUserById),
    validate_fields
], usuariosDelete);

module.exports = router;