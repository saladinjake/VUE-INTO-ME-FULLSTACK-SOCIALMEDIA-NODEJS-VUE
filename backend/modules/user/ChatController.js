const _ = require('lodash');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const ChatModel = require('../core/model/ChatModel');
const UserModel = require('../core/model/UserModel');
const Controller = require('../core/controllers/Controller');
const ConnectionModel = require('../core/model/ConnectionModel');

class ChatController extends Controller {
  constructor() { super() }

  /****************************************************************/
  /****************** Send A Chat Message: Initiate  **************/
  /****************************************************************/
  async createChat(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Chat = new ChatModel();

    let { messageId, receiverId, chat, type, audio, video, picture } = req.body;
    let user = await super.validateHeaders(req, UserModel, _);

    if (!user) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      // Main logic goe here...
      let User = new UserModel();
      let receiver = await User.findUserByStageName(receiverId);

      if (!receiver) {
        Response.status = 401;
        Response.message.push({ user: 'An unexpected error occurred and your messages could not be sent.' });

        res.status(401).json(Response);
        return;
      }

      let payload = {
        chatId: user._id.toString() + receiver._id.toString(),
        messageId: messageId,
        sender: user._id.toString(),
        receiver: receiver._id.toString(),
        type: 'message',
        chat: chat,
        picture: picture,
        audio: audio,
        video: video,
        recording: '',
        docs: ''
      }

      // check if the chat id exists...
      let checkChatIdOne = await Chat.checkChatId({ chatId: payload.chatId });
      let checkChatIdTwo = await Chat.checkChatId({ chatId: receiver._id.toString() + user._id.toString() });

      if (checkChatIdOne) {
        // create the chat under this id...
        let chatMessage = await Chat.saveMessage(payload);

        Response.status = 201;
        Response.data.push(chatMessage);

        res.status(201).json(Response);
        return;
      }

      if (checkChatIdTwo) {
        //create the chat under this Id...
        payload.chatId = receiver._id.toString() + user._id.toString();

        let chatMessage = await Chat.saveMessage(payload);

        Response.status = 201;
        Response.data.push(chatMessage);

        res.status(201).json(Response);
        return;
      }

      if (!checkChatIdOne && !checkChatIdTwo) {
        let chatMessage = await Chat.saveMessage(payload);

        Response.status = 201;
        Response.data.push(chatMessage);

        res.status(201).json(Response);
        return;
      }
    } catch (e) {
      Response.status = 500;
      Response.message.push({
          server: {
              customMessage: `Sorry, an exception occurred and your request could not be completed. `,
              errorName: e.name,
              errorMessage: e.message
          }
      })
      res.status(500).json(Response);
      return;
    }
  }

  /****************************************************************/
  /****************** Recent Chats  *******************************/
  /****************************************************************/
  async RecentChats(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
        let Chat = new ChatModel();
        let userModel = new UserModel();
        let recentChats = await Chat.fetchRecentChats({ sender: User._id.toString(), receiver: User._id.toString() });

        if (recentChats.length < 1) {
          Response.status = 204;
          Response.message.push({ chats: 'Sorry, There are no chats to follow.' });

          res.status(204).json(Response);
          return;
        }

        if (recentChats.length > 0) {
          // append both their picture to it...
          for (let i = 0; i < recentChats.length; i++) {
            recentChats[i].senderProfile = await userModel.findUserById(recentChats[i].sender);
            recentChats[i].receiverProfile = await userModel.findUserById(recentChats[i].receiver);
            recentChats[i].timestamp = recentChats[i]._id.getTimestamp();
          }

          Response.status = 204;
          Response.data.push(recentChats);

          res.status(204).json(Response);
          return;
        }
    } catch (e) {
      Response.status = 500;
      Response.message.push({
          server: {
              customMessage: `Sorry, an exception occurred and your request could not be completed. `,
              errorName: e.name,
              errorMessage: e.message
          }
      })
      res.status(500).json(Response);
      return;
    }
  }

  /****************************************************************/
  /******************  Chat List  *********************************/
  /****************************************************************/
  async chatList(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      // fetch all of the users connection and check to see if they messages or not...
      const Chat = new ChatModel()
      const Connection = new ConnectionModel();

      let userModel = new UserModel();
      let usersConnectionOne = await Connection.fetchConnections(User._id);
      let usersConnectionTwo = await Connection.fetchApprovedConnectionRequest(User._id);

      let chatPackets = [];

      // check the first connection...
      if (usersConnectionOne.length > 0) {

        for (let i = 0; i < usersConnectionOne.length; i++) {
          // check if their is a last message better the two parties...
          let chatExist = await Chat.fetchLastMessage({ sender: User._id.toString(), receiver: usersConnectionOne[i].following });

          // move this into the chatPackets...
          if (chatExist) {
            if (chatExist.sender == User._id.toString()) {
              usersConnectionOne[i].senderProfile = User;
              usersConnectionOne[i].receiverProfile = await userModel.findUserById(chatExist.receiver);
            } else {
              usersConnectionOne[i].senderProfile = await userModel.findUserById(chatExist.sender);
              usersConnectionOne[i].receiverProfile = User;
            }

            usersConnectionOne[i].timestamp = chatExist._id.getTimestamp();
            usersConnectionOne[i].chat = chatExist;

            chatPackets.push(usersConnectionOne[i]);
          } else {
            usersConnectionOne[i].senderProfile = User;
            usersConnectionOne[i].receiverProfile = await userModel.findUserById(usersConnectionOne[i].following);
            usersConnectionOne[i].timestamp = null;
            usersConnectionOne[i].chat = {};

            chatPackets.push(usersConnectionOne[i]);
          }
        }

      }

      // check the second connection list...
      if (usersConnectionTwo.length > 0) {
        for (let i = 0; i < usersConnectionTwo.length; i++) {
          // check if their is a last message better the two parties...
          let chatExist = await Chat.fetchLastMessage({ sender: User._id.toString(), receiver: usersConnectionTwo[i].follower });

          // move this into the chatPackets...
          if (chatExist) {
            if (chatExist.sender == User._id.toString()) {
              usersConnectionTwo[i].senderProfile = User;
              usersConnectionTwo[i].receiverProfile = await userModel.findUserById(chatExist.receiver);
            } else {
              usersConnectionTwo[i].senderProfile = await userModel.findUserById(chatExist.sender);
              usersConnectionTwo[i].receiverProfile = User;
            }

            usersConnectionTwo[i].timestamp = chatExist._id.getTimestamp();
            usersConnectionTwo[i].chat = chatExist;

            chatPackets.push(usersConnectionTwo[i]);
          } else {
            usersConnectionTwo[i].senderProfile = User;
            usersConnectionTwo[i].receiverProfile = await userModel.findUserById(usersConnectionTwo[i].follower);
            usersConnectionTwo[i].timestamp = null;
            usersConnectionTwo[i].chat = {};

            chatPackets.push(usersConnectionTwo[i]);
          }
        }

      }

      if (chatPackets.length > 0) {
        Response.status = 200;
        Response.data.push(chatPackets);

        res.status(200).json(Response);
        return;
      }

      if (chatPackets.length < 1) {
        Response.status = 400;
        Response.data.push(chatPackets);

        res.status(400).json(Response);
        return;
      }
    } catch (e) {
      Response.status = 500;
      Response.message.push({
          server: {
              customMessage: `Sorry, an exception occurred and your request could not be completed. `,
              errorName: e.name,
              errorMessage: e.message
          }
      })
      res.status(500).json(Response);
      return;
    }
  }

  /****************************************************************/
  /******************  Chat History  ******************************/
  /****************************************************************/
  async chatHistory(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      let Chat = new ChatModel()
      let messageHistory = await Chat.fetchMessages(req.params.chatId);

      if (messageHistory.length < 1) {
        Response.status = 204;
        Response.message.push({ user: 'No chats found...' });

        res.status(204).json(Response);
        return;
      }

      if (messageHistory.length > 0) {
        let userModel = new UserModel();
        for (let i = 0; i < messageHistory.length; i++) {
          messageHistory[i].senderProfile = await userModel.findUserById(messageHistory[i].sender);
          messageHistory[i].receiverProfile = await userModel.findUserById(messageHistory[i].receiver);
          messageHistory[i].timestamp = messageHistory[i]._id.getTimestamp();
        }

        Response.status = 200;
        Response.data.push(messageHistory);

        res.status(200).json(Response);
        return;
      }
    } catch (e) {
      Response.status = 500;
      Response.message.push({
          server: {
              customMessage: `Sorry, an exception occurred and your request could not be completed. `,
              errorName: e.name,
              errorMessage: e.message
          }
      })
      res.status(500).json(Response);
      return;
    }
  }

  /****************************************************************/
  /******************  Update Chat  *******************************/
  /****************************************************************/
  async updateChat(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);

    if (!User) {
      Response.status = 401;
      Response.message.push({ user: 'A user with this token could not be found and verified.' });
      res.status(401).json(Response);
      return;
    }

    try {
        const Chat = new ChatModel();
        let user = new UserModel();

        let receiverId = await user.findUserByStageName(req.params.receiverId);
        let updatedChats = await Chat.markAsRead(receiverId._id.toString(), req.params.chatId);

        if (updatedChats.modifiedCount.length > 0) {
          Response.status = 200;
          Response.message.push({ status: 'updated' });

          res.status(200).json(Response);
          return;
        }

        if (updatedChats.modifiedCount < 1) {
          Response.status = 200;
          Response.message.push({ status: 'no-update' });

          res.status(200).json(Response);
          return;
        }
    } catch (e) {
      Response.status = 500;
      Response.message.push({
          server: {
              customMessage: `Sorry, an exception occurred and your request could not be completed. `,
              errorName: e.name,
              errorMessage: e.message
          }
      })
      res.status(500).json(Response);
      return;
    }
  }
}

module.exports = new ChatController();
