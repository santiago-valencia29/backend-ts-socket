import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from "../classes/usuario";

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente:Socket, io:socketIO.Server) =>{
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);


}


export const desconectar = (cliente: Socket, io:socketIO.Server) => {
    cliente.on('disconnect', () => {
        console.log('cliente desconectado');

        usuariosConectados.borrarUsuario(cliente.id);

        io.emit('usuarios-activos',usuariosConectados.getLista());

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

        usuariosConectados.actualizarNombre(cliente.id,payload.nombre);

        io.emit('usuarios-activos',usuariosConectados.getLista());

        //retornando ej: info o un error
        callback({
            ok:true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        })
    });
}

//obtener Usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', () => {


        io.to(cliente.id).emit('usuarios-activos',usuariosConectados.getLista()); //solo emite a la persona que se conecta 'io.to'

        //retornando ej: info o un error
        // callback({
        //     ok:true,
        //     mensaje: `Usuario ${payload.nombre}, configurado`
        // })
    });
}
