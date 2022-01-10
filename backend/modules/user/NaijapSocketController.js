const _ = require('lodash');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../Controller');
const ChatModel = require('../../model/ChatModel');
const UserModel = require('../../model/UserModel');
const NaijapModel = require('../../model/NaijapModel');
const ConnectionModel = require('../../model/ConnectionModel');
const NaijapNotificationModel = require('../../model/NaijapNotificationModel');

class NaijapSocketController extends Controller {
  constructor() { super() }

  /****************************************************************/
  /*******       Add A User To A Socket Room           ************/
  /****************************************************************/
  async addUserToRoom(Payload) {
    const Naijap = new NaijapModel();
    try {
        //#! In order to reduce IO we will return the user object alone...
        await Naijap.joinRoom(Payload);
        return Payload;
      } catch (e) {
        const ErrorObject = {
          errorName: e.name,
          errorMessage: e.message
        };
        return ErrorObject
    }
  }

  /****************************************************************/
  /*******     Create A Connection Notification        ************/
  /****************************************************************/
  async createConnectionNotification(Payload) {
    const User = new UserModel();
    const Naijap = new NaijapModel();
    const Response = {  };
    const NaijapNotification = new NaijapNotificationModel();
    try {
      const Message = `${Payload.follower} wants to make a connection with you.`;
      //#! Create the notification and send an instance to the user...
      let user = await User.findUserByStageName(Payload.following);
      let notification = await NaijapNotification.create({
        userId: user._id.toString(),
        type: 'new_connection',
        document_id: Payload.connectionId,
        message: Message,
      });
      let userSocketsId = await Naijap.fetchUserByStageName(Payload.following);
      // Send a notification back to the user..
      notification.timestamp = notification._id.getTimestamp();
      Response.stageName = user.stageName;
      Response.notification = notification;
      Response.socket = userSocketsId;
      return Response;

    } catch (e) {
      const ErrorObject = {
        errorName: e.name,
        errorMessage: e.message
      };
      return ErrorObject
    }
  }

  /****************************************************************/
  /*******       Approve A Users Connection           *************/
  /****************************************************************/
  async approveConnection(Payload) {
    const Response = {};
    const User = new UserModel();
    const NaijapNotification = new NaijapNotificationModel();
    try {
      const Initiate = Payload.initiate;
      const Receiver = Payload.receiver;

      const Message = `${Payload.initiateStageName} has approved your connection request.`;
      const Packet = {
        userId: Receiver,
        type: 'approved_connection',
        document_id: Payload.connId,
        message: Message
      }

      let userModel = await User.findUserById(Initiate);
      let notification = await NaijapNotification.create(Packet);
      let sockets = {};

      notification.timestamp = notification._id.getTimestamp();

      let user = {
        id: Initiate,
        avatar: userModel.avatar || ''
      }

      notification.user = user;

      Response.receivers = {
        receiverStageName: Payload.receiverStageName,
        initiateStageName: Payload.initiateStageName
      }

      Response.sockets = sockets;
      Response.notification = notification;
      return Response;

    } catch (e) {
      const ErrorObject = {
        errorName: e.name,
        errorMessage: e.message
      };
      return ErrorObject
    }
  }

  /****************************************************************/
  /*******       Create A Coment Notification         *************/
  /****************************************************************/
  async createCommentNotification(payload) {
    const User = new UserModel();
    const Response = { };
    const NaijapNotification = new NaijapNotificationModel();

    // Notification payload.........
    let NotificationPayload = {
      userId: payload.userId,
      type: 'comment',
      document_id: payload.docId,
      message: payload.message
    }

    // Create the document and send a response back to the browser....
    try {
      let notification = await NaijapNotification.create(NotificationPayload);
      let Initiate = await User.findUserByStageName(payload.postInitiateStageName);

      notification.timestamp = notification._id.toString();

      // Attach the receiver and initiate to the payload....
      Response.receivers = {
        receiverStageName: payload.postOwnerStageName,
        initiateStageName: payload.postInitiateStageName,
        receiversAvatar: Initiate.avatar || '',
      }
      Response.notification = notification;
      Response.sockets = null;

      return Response;
    } catch (e) {
      const ErrorObject = {
        errorName: e.name,
        errorMessage: e.message
      };
      return ErrorObject
    }
  }

  /****************************************************************/
  /*******       Create A Chat Notification         ***************/
  /****************************************************************/
  async createChatNotification(payload) {
    const Response = {};
    const Chat = new ChatModel();
    const User = new UserModel();

    try {

      let sender = await User.findUserByStageName(payload.sender);
      let receiver =await User.findUserById(payload.receiver);

      let messageId = payload.messageId;
      let senderId = sender._id.toString();
      let receiverId = receiver._id.toString();
      // let's search using this credentials...
      let message = await Chat.fetchCurrentMessage();

      Response.timestamp = message._id.getTimestamp();
      Response.sender = sender.stageName;
      Response.receiver = receiver.stageName;
      Response.message = message;
      Response.socket = [];
      return Response;
    } catch (e) {
      const ErrorObject = {
        errorName: e.name,
        errorMessage: e.message
      };
      return ErrorObject
    }

  }
}

const Naijap = new NaijapSocketController();
module.exports = Naijap;
