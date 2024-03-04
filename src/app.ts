import express from "express";
import http from 'http';
import fs from 'fs';
import { Server as SocketIO} from 'socket.io';
import cors from 'cors';
const options = {
    key: fs.readFileSync('./config/cert.key'),
    cert: fs.readFileSync('./config/cert.crt')
};

const app = express();

app.use(cors({
    origin: '*'
}));
const server = http.createServer( app);
export const io = new SocketIO(server, {
    cors: {
        origin: '*'
    }
});



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log('showmind socket server is running...');
})

io.on('connection', (socket) => {
    console.log('connected!')

    socket.on('rooms', (data, cb: SocketRes) => {
        console.log(`[GET_ROOMS]`);
        cb({
            ok: true
        })
    });

    socket.on('joinRoom', (data, cb: SocketRes) => {
        console.log(`[JOIN_ROOM]`);
        const { rid, user } = data;
        socket.join(rid);
        cb({
            ok: true,
            user: user
        })
    });

    socket.on('joined', (data) => {
        const{ rid, user } = data; 
        socket.broadcast.to(rid).emit('joined', user);
    })

    socket.on('leaveRoom', (data, cb: SocketRes) => {
        console.log(`[LEAVE_ROOM]`);
        const { rid, user } = data;
        socket.leave(rid);
        cb({
            ok: true,
            user: user
        })
    });

    socket.on('leaved', (data) => {
        const { rid, user } = data;
        socket.broadcast.to(rid).emit('leaved', user);
    })

    socket.on('msg', (data) => {
        const { rid, msg, user } = data;
        io.to(rid).emit('msg', {msg, user});
    });

    socket.on('drawup', (data, cb) => {
        const { rid, curLine} = data;
        cb({
            ok: true,
        })
        io.to(rid).emit('sendLine', curLine);
    });

    socket.on('drawNew', (data) => {
        const { rid } = data;
        io.to(rid).emit('newLine');
    })
});