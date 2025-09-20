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

io.on('connection', (server) => {
    console.log("A connection established", server.id);
})


app.get("/", (req: Request,res: Response) => (
    res.json ({
        message: "Hello",
    })
));


server.listen(PORT, ()=> {
    console.log(`Server is running at localhost:${PORT}`);
})

