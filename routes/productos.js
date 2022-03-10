const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/Productos');

const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const {validate_fields, validarJWT, isAdminRole, hasRole} = require('../middlewares');

const router = Router();

// url/api/categorias

// Obtener todas las categorias - público
router.get('/', obtenerProductos);

// Obtener una categoría por id
// Middleware check id
router.get('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validate_fields
], obtenerProducto);

// Crear una nueva categoría - privado, cualquier role
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un Id valido de categoría').isMongoId(),
    check('categoria').custom(existeCategoria),
    validate_fields,
], crearProducto);

// actualizar - privado - cualquier role
router.put('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProducto),
    check('categoria','No es un Id valido de categoría').isMongoId(),
    check('categoria').custom(existeCategoria),
    validate_fields,
    validarJWT
], actualizarProducto);

// borrar categoría solo si es admin - privado
router.delete('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validate_fields,
    validarJWT,
    hasRole('ADMIN_ROLE')
], borrarProducto);

module.exports = router;