const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo } = require('../controllers/uploads');

const { validate_fields } = require('../middlewares/validate-fields');
const router = Router();

router.post('/', cargarArchivo);

module.exports = router;