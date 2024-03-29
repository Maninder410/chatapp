const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const port = 4500 || process.env.PORT;
app.use(cors());//cors is used for inter communicaiton 
//between url
const users = [{}];
app.get('/',(req,res)=>{
    res.send("HELL IS WORKING");
})
const io = socketIO(server);
io.on("connection",(socket)=>{
    console.log('new connection');
    socket.on('joined',({user})=>{//this receives the data
        users[socket.id] = user;
console.log(`${user} has joined`);
socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} joined`})//throw message to everyone execept the one that has joined
socket.emit(`welcome `,{user:"Admin",message:`Welcome to the lit chat,${users[socket.id]}`})
    })
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`});
        console.log(`User left`);
    })
})

server.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
})