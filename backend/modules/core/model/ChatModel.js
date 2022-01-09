import  _ from 'lodash';
import  { ObjectId } from 'mongodb';
import Model from './Model';


/****************************************************************/
/******* ChatModel: CRUD Operations for the app chat*************/
/****************************************************************/

class ChatModel extends Model {
  constructor() {
    super();
  }

  async saveMessage(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_chats').insertOne({
      _id: new ObjectId(),
      chatId: payload.chatId,
      messageId: payload.messageId,
      sender: payload.sender,
      receiver: payload.receiver,
      type: payload.type,
      status: 'unread',
      chat: payload.chat,
      media: {
        picture: payload.picture,
        video: payload.video,
        audio: payload.audio,
        recording: payload.recording,
        docs: payload.docs
      }
    }).then((doc) => {
      return doc.ops[0];
    });
  }

  async fetchMessages(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_chats').find({
      chatId: payload.chatId
    }).toArray().then((docs) => {
      return docs;
    });
  }

  async fetchRecentChats(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_chats').find({ $or: [ { sender: payload.sender }, { receiver: payload.receiver } ] }).sort({ _id: -1 }).limit(10).toArray().then((docs) => {
      return docs;
    });
  }

  async fetchMessages(chatId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_chats').find({ chatId: chatId }).toArray().then((docs) => {
      return docs;
    });
  }

  async fetchLastMessage(payload) {
    const dbConnection = await super.createConnection();
    // return dbConnection.collection('naijap_db_chats').find({ sender: payload.sender, receiver: payload.receiver }).sort({ _id: -1 }).limit(1).toArray().then((docs) => {
    //   return docs[0];
    // });
    return dbConnection.collection('naijap_db_chats').find({ $or: [ { sender: payload.sender, receiver: payload.receiver }, { sender: payload.receiver, receiver: payload.sender } ] }).sort({ _id: -1 }).limit(1).toArray().then((docs) => {
      return docs[0];
    });
  }

  async fetchCurrentMessage(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_chats').findOne({ sender: payload.sender, receiver: payload.receiver, messageId: payload.messageId }).then((doc) => {
      return doc;
    });
  }

  async checkChatId(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_chats').findOne({
      chatId: payload.chatId
    }).then((doc) => {
      return doc;
    });
  }

  async markAsRead(receiverId, chatId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_chats').updateMany({
      chatId: chatId,
      receiver: receiverId,
      status: 'unread'
    }, {
      $set: {
        status: 'read'
      }
    }).then((docs) => {
      return docs;
    });
  }
}

module.exports = ChatModel;
