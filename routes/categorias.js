const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');

const { isValidRole, existEmail, existUserById, existeCategoria } = require('../helpers/db-validators');

const {validate_fields, validarJWT, isAdminRole, hasRole} = require('../middlewares');

const router = Router();

// url/api/categorias

// Obtener todas las categorias - público
router.get('/', obtenerCategorias);

// Obtener una categoría por id
// Middleware check id
router.get('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeCategoria),
    validate_fields
], obtenerCategoria);

// Crear una nueva categoría - privado, cualquier role
router.post('/', [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validate_fields,
    validarJWT
], crearCategoria);

// actualizar - privado - cualquier role
router.put('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria),
    validate_fields,
    validarJWT
], actualizarCategoria);

// borrar categoría solo si es admin - privado
router.delete('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validate_fields,
    validarJWT,
    hasRole('ADMIN_ROLE')
], borrarCategoria);

module.exports = router;