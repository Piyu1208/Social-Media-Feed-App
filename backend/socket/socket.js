import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_BASE_URL,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected.");

        
        socket.on("register", (userId) => {
            socket.userId = userId;

            addUser(userId, socket.id);

            console.log(`${userId} registerd`);
        });

        socket.on("disconnect", () => {
            if (socket.userId) {
                removeUser(socket.userId);
            }

            console.log("User disconnected.");
        });
    });

    return io;
}

export const getIO = () => io;


const onlineUsers = new Map();

export const addUser = (userId, socketId) => {
    onlineUsers.set(userId, socketId);
};

export const removeUser = (userId) => {
    onlineUsers.delete(userId);
};

export const getSocketId = (userId) => {
    return onlineUsers.get(userId);
};