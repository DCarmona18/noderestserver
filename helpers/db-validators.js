const { Categoria, Usuario, Role, Producto } = require('../models');

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

const existUserById = async(id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error('El id no existe');
    }
};

const existeCategoria = async(id = '') => {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error('La categoria no existe');
    }
};

const existeProducto = async(id = '') => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error('La categoria no existe');
    }
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    if(!colecciones.includes(coleccion)){
        throw new Error(`La colección ${coleccion} no es permitida. ${colecciones} `);
    }

    return true;
};

module.exports = {
    isValidRole,
    existEmail,
    existUserById,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
};