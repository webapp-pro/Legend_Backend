export const sendEvent = (socket, eventName, data = {}) => {
    try {
      socket.emit(eventName, data);
    } catch (error) {
      logger.error('Socket Send Error : ' + error);
    }
};

export const sendBroadCastEvent = (socket, roomid, eventName, data = {}) => {
    try {
        socket.broadcast.to(roomid).emit(eventName, data);
    } catch (error) {
      logger.error('Socket BroadCast Error : ' + error);
    }
};

export const sendDataSocket = (socket, socketid, eventName, data = {}) => {
  try {
    socket.to(socket.id).emit('message', 'Hello, client!');
  } catch (error) {
    logger.error('Socket BroadCast Error : ' + error);
  }
};