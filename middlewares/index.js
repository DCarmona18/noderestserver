const validate_fields = require('../middlewares/validate-fields');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validate_fields,
    ...validarJWT,
    ...validaRoles
};