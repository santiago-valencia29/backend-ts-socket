import { Socket } from "socket.io";
import socketIO from 'socket.io';


export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        console.log('cliente desconectado');
    })
}

// Escuhar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: { de: string, cuerpo: string }) => {
        console.log('mensaje recibido', payload);

        //emitir a todos los usuarios
        io.emit('mensaje-nuevo',payload);
    });
}

//Configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload: { nombre:string }, callback: Function) => {
        console.log('configurando Usuario', payload.nombre);

        //retornando ej: info o un error
        callback({
            ok:true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        })
    });
}