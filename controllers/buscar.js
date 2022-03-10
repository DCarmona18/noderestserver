const { response } = require("express");
const { ObjectId} = require('mongoose').Types;
const {Usuario, Categoria, Role, Producto} = require('../models')
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{nombre: regexp}, {correo: regexp}],
        $and: [{status: true}]
    });

    return res.json({
        results: usuarios
    });
};

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        $or: [{nombre: regexp}],
        $and: [{estado: true}]
    })
    .populate('usuario', 'nombre');

    return res.json({
        results: categorias
    });
};

const buscarProductos = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or: [{nombre: regexp}, {descripcion: regexp}],
        $and: [{estado: true}]
    })
    .populate('categoria','nombre');

    return res.json({
        results: productos
    });
};

const buscar = (req, res = response) => {

    const { colleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(colleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (colleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'roles':
            
            break;
    
        default:
            return res.status(500).json({
                msg: `Se me olvidó ahcer esta búsqueda`
            });
            break;
    }
};

module.exports = {
    buscar
};