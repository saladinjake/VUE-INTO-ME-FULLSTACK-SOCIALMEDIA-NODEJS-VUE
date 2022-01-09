import { ObjectId} from 'mongodb';

import Model from './Model';

/****************************************************************/
/******* ChatModel: CRUD Operations for the app chat*************/
/****************************************************************/

class TransactionsModel extends Model {
  constructor() {
    super();
  }

  async createTransaction(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_transactions').insertOne(Payload).then((doc) => {
      return doc.ops[0];
    });
  }

  async checkTransaction(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_transactions').findOne({
      reference: Payload.reference
    }).then((doc) => {
      return doc;
    });
  }

  async fetchTransactions() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_transactions').find().toArray().then((docs) => {
      return docs;
    })
  }
}

module.exports = TransactionsModel;
