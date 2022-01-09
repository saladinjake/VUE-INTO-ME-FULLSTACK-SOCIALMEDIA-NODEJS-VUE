import {MongoClient, ObjectId} from 'mongodb';

import Model from './Model';
/*****************************************************************/
/******* @author saladin jake victor juwa *********************************/
/******* @desc NaijapModel: Saves Sockets Users ******************/
/****************************************************************/

class NaijapModel extends Model {
  constructor () { super(); }

  /****************************************************************/
  /************************     Join Room      ********************/
  /****************************************************************/
  async joinRoom(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_sockets_user').insertOne(Payload).then((doc) => {
      return doc.ops[0];
    });
  }

  /****************************************************************/
  /*********     Get Curent User By Socket ID      ****************/
  /****************************************************************/
  async getCurrentUserBySocketId(socketId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_sockets_user').findOne({
      socketId
    }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /******    Get Current User By Stage Name      ******************/
  /****************************************************************/
  async getCurrentUserByStageName(stageName) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_sockets_user').findOne({stageName}).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /***********     Fetch User By Stage Name    ********************/
  /****************************************************************/
  async fetchUserByStageName(stageName) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_sockets_user').find({stageName}).toArray().then((docs) => {      
      return docs;
    });
  }
}

module.exports = NaijapModel;
