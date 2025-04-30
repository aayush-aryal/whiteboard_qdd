import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRouter from "./routes/auth.js";
import cors from "cors"
import {Server} from "socket.io"
import { createServer } from 'node:http';
import http from "http"; 
import { SocketAddress } from "node:net";

dotenv.config();

const app = express();
const server=createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from your React frontend
    methods: ["GET", "POST"],
    credentials: true, // Allow sending cookies with requests
  },
});
const PORT = process.env.PORT || 5000;

// Enable CORS with credentials (cookies, etc.)
app.use(cors({
  origin: "http://localhost:5173",  // your React frontend's URL
  credentials: true  ,             // allow sending cookies
}));

// Parse incoming JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form submissions if needed

// ✅ Initialize session BEFORE passport
app.use(session({
  secret: "yourSuperSecretKey",  // 🔒 Replace with a strong, secure string in prod
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // 🔒 Set true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// ✅ Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Your routes
app.use("/users", userRoutes);
app.use("/auth", authRouter);


// Socket.io connection handler
io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId)=>{
    
    for (let room of socket.rooms) {
      if (room !== socket.id && room !== roomId) {
        socket.leave(room);
      }
    }
    
    socket.join(roomId);
    // take a random user from the room that isnt current user
    const clients=Array.from(io.sockets.adapter.rooms.get(roomId)|| [])
    const uniqueClient=clients.filter(id=>id!=socket.id)
    console.log(uniqueClient)
    if (uniqueClient.length>0){
      io.to(uniqueClient[0]).emit('request-board', {userId:socket.id})
      console.log(uniqueClient,"is sending their board")
    }
    
    console.log(`${socket.id} is requesting a new board`)
  
  })
  // Example: Listen for 'boardUpdate' and broadcast to all clients
  socket.on("boardUpdate", ({data,roomId}) => {
  
    socket.to(roomId).emit("boardUpdate", data);
    
    // console.log(`Board update received:${roomId}`);
  });


  socket.on("update-user-board", ({data,userId,roomId})=>{
    console.log("new board being sent to the other user by", socket.id)
    io.to(userId).emit("new-board-to-user",{data})
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Whiteboard App API");
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});