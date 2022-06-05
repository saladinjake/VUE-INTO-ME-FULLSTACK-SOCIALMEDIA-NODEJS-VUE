const AppSockets = require('../modules/user/NaijapSocketController');

const SocketsPath = function (Io) {
  // Io.set();
  Io.on('connect', socket => {
    //#! Listen or chat Messages...
    socket.on('joinRoom', (Payload) => {
      //#! Run when a user joins a room...
      //#! Use this room to send notifications like 1. Like, 2. Comment 3. Views greater than 50, 4. New Connection
      Payload.socketId = socket.id;
      // const User = AppSockets.addUserToRoom(Payload);
    });

    //#! Listen for coming connections...
    socket.on('newConnection', async (Payload) => {
      const Response = await AppSockets.createConnectionNotification(Payload);
      const Notification = Response.notification;
      Notification.stageName = Response.stageName;

      const Sockets = Response.socket;
      Io.emit('connectionMessage', Notification);
    });

    //#! Listen for Approved connections...
    socket.on('approveConnection', async (Payload) => {
      const Response = await AppSockets.approveConnection(Payload);
      const Notification = Response.notification;

      const Sockets = Response.sockets;
      Response.sockets = undefined;
      Io.emit('connectionApproved', Response);
    });

    //#! Listen for incoming comments....
    socket.on('newComment', async (Payload) => {
      const Response = await AppSockets.createCommentNotification(Payload);
      Io.emit('commentRecieved', Response);
    });

    socket.on('userPresence', async (Payload) => {
      const Response = {
        user: Payload.sender,
        presence: Payload.presence
      }

      // When this is sent, each user will have to check if they are friends with this user before any modification is allowed...
      Io.emit('newPresence', Response);
    });

    // Listen for chat keyboard events...
    socket.on('chatPress', async (Payload) => {
      const Response = {
        senderAvatar: Payload.senderAvatar,
        receiver: Payload.receiver,
        message: 'Typing...',
        sender: Payload.sender
      }

      // This messages goes to a specific receiver...
      Io.emit('incomingChat', Response);
    });

    // Do some custom realtime chat...
    socket.on('chatMessages', async (Payload) => {
      // This will have to make a trip to the backend to fetch the chat using the chatId...
      // const Response = await AppSockets.createChatNotification(Payload);
      // Io.emit('commentRecieved', Response);
      Io.emit('messageReceived', Payload);
    });

    socket.on('newLogin', stageName => {
      Io.emit('newLoginEntry', stageName);
    });

    socket.on('logout', stageName => {
      Io.emit('newLogOut', stageName);
    })

  });
}

module.exports = SocketsPath;
