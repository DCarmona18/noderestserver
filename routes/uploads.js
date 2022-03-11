const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir, validate_fields } = require('../middlewares');

const router = Router();

router.post('/', cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','No es un id válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validate_fields
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id','No es un id válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validate_fields
], mostrarImagen)

module.exports = router;