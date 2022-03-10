const { response } = require("express");
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate

const obtenerProductos = async(req, res = response) => {
    const{ limite = 5, desde = 0 } = req.query;
    const query = {estado:true};
    const productos = Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite)); 

    const total = Producto.countDocuments(query);

    // Ejecutar promesas de forma sincrona
    const [productosResp, totalResp]  = await Promise.all([productos, total]);

    res.json({
        totalResp,
        productosResp
    })
};

// obtenerProducto - populate
const obtenerProducto = async(req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario','nombre')
        .populate('categoria', 'nombre');
    if(!producto){
        res.status(404).json({
            msg: 'Producto no encontrada'
        });
    }

    res.json({
        producto
    })
};


const crearProducto = async(req, res = response) => {
    const { estado, usuario, ...body } = req.body;
    
    const productoDB = await Producto.findOne({ nombre:  body.nombre });

    if(productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    };

    const producto = new Producto(data);

    // Guardar db
    await producto.save();

    res.status(201).json({producto});
};

// actualizarProducto
const actualizarProducto = async(req, res = response) => {
    const { id } = req.params;
    const {_id, estado, usuario, ...body } = req.body;
    
    body.nombre = body.nombre.toUpperCase();
    body.usuario = req.usuario._id;

    /*if(body.nombre !== null) {
        const categoria = Producto.findOne({nombre: body.nombre});
        if(categoria && Producto._id !== id){
            return res.status(400).json({
                msg: `Ya existe una categoría con nombre ${body.nombre}`
            });
        }
    }*/

    const producto = await Producto.findByIdAndUpdate(id, body, {new: true});

    res.json({
        producto
    })
};
// borrarProducto - estado: false
const borrarProducto = async(req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false});
    res.json({
        producto
    })
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
};