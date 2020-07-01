import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from "socket.io";
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {
    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);

        this.escucharSockets();
    }

    public static get instance (){
        return this._instance || (this._instance = new this());
    }

    start(callback: VoidFunction) {
        this.httpServer.listen(this.port, callback);
    }

    private escucharSockets() { //privado porque funciona con la inicialización de la clase
        console.log('Escuchando conexiones -sockets');

        this.io.on('connection', cliente => {
            // console.log('cliente conectado');
            console.log(cliente.id);

            // cliente.on('disconnect',()=>{
            //     console.log('Cliente Desconectado');
            // }) :

            //conectar cliente
            socket.conectarCliente(cliente, this.io);


            //configurar usuario
            socket.configurarUsuario(cliente, this.io);

            //Obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io)

            //mensajes
            socket.mensaje(cliente, this.io);

            //desconectar
            socket.desconectar(cliente, this.io);

        });
    }
}