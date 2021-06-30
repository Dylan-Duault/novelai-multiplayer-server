import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

let rooms : any = [];
io.on("connection", (socket: Socket) => {

    socket.on("login", data => {
        socket.join(data.accessKey);
    });

    socket.on("room", room => {
        socket.join(room);
        if (rooms[room]) {
            console.log(rooms[room].text);
            socket.emit('editing', rooms[room].text);
        }
    });

    socket.on("editing", data => {
        rooms[data.room] = {text: data.text};
        socket.broadcast.to(data.room).emit('editing', data.text);
    });

});

httpServer.listen(3000);