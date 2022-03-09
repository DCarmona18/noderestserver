const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req, res = response, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer usuario que corresponde a uid
        const usuario = await Usuario.findById(uid);
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe'
            });
        }


        // Verificar si el usuario está activo
        if (!usuario.status) {
            return res.status(401).json({
                msg: 'Token no válido - usuario inactivo'
            });
        }

        req.usuario = usuario;
    } catch (error) {
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

    next();
};

module.exports = {validarJWT};