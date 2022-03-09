const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosRoute = '/api/usuarios';
        this.authRoute = '/api/auth';

        // Connect db
        this.connectDB();

        // Middleware
        this.middlewares();

        // Rutas de mi applicación
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Public directory
        this.app.use( express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosRoute, require('../routes/usuarios'));
        this.app.use(this.authRoute, require('../routes/auth'));
    }

    listen(){
        this.app.listen(this.port, () => {console.log('Servidor coriendo en puerto: ', this.port)})
    }
}

module.exports = Server;