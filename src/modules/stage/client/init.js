
export class Init {

    static do(socket) {
        socket.emit('init');
        console.log('[debug] init状態');
    }
}