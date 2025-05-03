const connectedUsers = new Map();
let io = null;

export const addNewConnectedUser = ({ socketId, userId }) => {
    connectedUsers.set(socketId, { userId });
};

export const removeConnectedUser = ({ socketId }) => {
    if (connectedUsers.has(socketId)) {
        connectedUsers.delete(socketId);
    }
};

// get active connections of a particular user
export const getActiveConnections = (userId) => {
    // get user's socket ids(active socket connections)
    const activeConnections = [];

    connectedUsers.forEach((value, key) => {
        if (value.userId === userId) {
            activeConnections.push(key);
        }
    });

    return activeConnections;
};

export const getOnlineUsers = () => {
    const onlineUsers = [];

    connectedUsers.forEach((value, key) => {
        onlineUsers.push({
            userId: value.userId,
            socketId: key,
        });
    });

    return onlineUsers;
};

export const setServerSocketInstance = (ioInstance) => {
    io = ioInstance;
};

export const getServerSocketInstance = () => {
    return io;
};



// const { leaveAllRooms } = require("../socket/activeRooms");

// const { updateRooms } = require("./notifyConnectedSockets");

export const disconnectHandler = (socket, io) => {
    removeConnectedUser({ socketId: socket.id });

    // emit online users to all connected users
    io.emit("online-users", getOnlineUsers());

    // leaveAllRooms(socket.id)
    // updateRooms();
}

