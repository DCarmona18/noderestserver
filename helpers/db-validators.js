const Role = require('../models/role');
const Usuario = require('../models/usuario');

const isValidRole = async(role = '') => {
    const existeRole = await Role.findOne({role});
    if(!existeRole){
        throw new Error(`El role ${role} no existe en la base de datos`);
    }
};

const existEmail = async(correo = '') => {
    const existeCorreo = await Usuario.findOne({correo});
    if(existeCorreo){
        throw new Error('El correo ya está registrado');
    }
};

module.exports = {
    isValidRole,
    existEmail
};