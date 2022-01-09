import  _ from 'lodash';
import  { ObjectId } from 'mongodb';
import Model from './Model';


/****************************************************************/
/******* ChatModel: CRUD Operations for the app chat*************/
/****************************************************************/

class CommunicationModel extends Model {
  constructor() { super() }

  async fetchMessages() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_inbox').find()
      .toArray().then((docs) => {
        return docs;
    });
  }

  async fetchMessage(email) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_inbox').findOne({ email: email })
      .then((doc) => {
        return doc;
    });
  }

  async replyMessage(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_inbox').updateOne({
      email: data.email
    }, {
      $set: {
        messages: data.message
      }
    }, { upsert: true }).then((doc) => {
      return doc;
    });
  }

  async deleteMessage(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_inbox').findOneAndDelete({
      email: data.email
    }).then((doc) => {
      return doc.value;
    });
  }
}

module.exports = CommunicationModel;
