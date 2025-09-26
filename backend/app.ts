import {createServer} from "node:http";
import express, { type Request, type Response } from "express";
import {Server} from "socket.io";

const PORT = 8000;

const app = express();
const server = createServer(app);

// socket instance:
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
    }
});

const ROOM="group";

io.on('connection', (socket) => {
    console.log("A connection established", socket.id);

    // ---JoinRoom---
    socket.on("joinRoom", async (userName: string)=> {
        console.log(`${userName} has joined the group - server`);
        
        await socket.join(ROOM)

        // send to all:
        // io.to(ROOM).emit("roomNotice", userName);

        // brodcast:
        socket.to(ROOM).emit("roomNotice", userName);
    });


    // ---ChatMessage
    socket.on("chatMessage", (msg: string) =>{
        // brodcast:
        socket.to(ROOM).emit("chatMessage", msg);
    })

    // ---Typing
    socket.on("typing", (userName: string) =>{
        // brodcast:
        socket.to(ROOM).emit("typing", userName);
    })

    // ---StopTyping
    socket.on("stopTyping", (userName: string) =>{
        // brodcast:
        socket.to(ROOM).emit("stopTyping", userName);
    })

})


app.get("/", (req: Request,res: Response) => (
    res.json ({
        message: "Hello",
    })
));


server.listen(PORT, ()=> {
    console.log(`Server is running at localhost:${PORT}`);
})

