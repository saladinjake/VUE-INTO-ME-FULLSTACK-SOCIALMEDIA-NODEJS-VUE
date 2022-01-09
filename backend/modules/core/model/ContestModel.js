
import  { ObjectId } from 'mongodb';
import Model from './Model';

/****************************************************************/
/******* ChatModel: CRUD Operations for the app chat*************/
/****************************************************************/
class ContestModel extends Model {
  constructor() {
    super();
  }
  async createContest(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_contests').insertOne(data)
      .then((docs) => {
        return docs.ops[0]
    });
  }

  async fetchContests() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_contests').find().toArray()
      .then((docs) => {
        return docs;
    });
  }

  async fetchContestById(contestId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_contests').findOne({
      _id: new ObjectId(contestId)
    }).then((doc) => {
      return doc;
    });
  }

  async fetchOngoingContest() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_contests').findOne({ status: true })
    .then((doc) => {
      return doc;
    });
  }

  async fetchCompletedContest() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_contests').find({ status: false })
    .toArray()
    .then((docs) => {
      return docs;
    })
  }

  async markContestAsCompleted(contestId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_contests').findOneAndUpdate({
      _id: new ObjectId(contestId)
    }, {
      $set: {
        status: false
      }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value;
    });
  }

  async checkContest() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_contests').findOne({ status: true })
      .then((doc) => {
        return doc;
      });
  }
}

module.exports = ContestModel;
