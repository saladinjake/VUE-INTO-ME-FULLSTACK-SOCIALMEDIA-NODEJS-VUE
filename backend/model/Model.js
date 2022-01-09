const {MongoClient, ObjectId} = require('mongodb');
const MongoConfig = require('../config/mongoDB');
const DbConnector = require('../server');

/****************************************************************/
/******* @author Ilori Stephen A ********************************/
/******* @desc Model Base Class : Povides resuable **************/
/******* Methods for woking with our database *******************/
/****************************************************************/

class Model {
  /****************************************************************/
  /************ Constructor: Loads Up The Model Config ************/
  /****************************************************************/
  constructor() {
    this.url = MongoConfig.mongoDbUrl;
    this.db = MongoConfig.mongoDatabase;
  }

  /****************************************************************/
  /******** Db Connection: Creates A New Connection Promise *******/
  /****************************************************************/
  async dbConnector() {
    const Client = await new MongoClient(this.url, { useUnifiedTopology: true });
      const Database = new Promise((resolve, reject) => {
        Client.connect((err) => {
          if (err) {
            reject(err);
          }

          resolve(Client.db(this.db));
        });
    });

    return Database;
  }


  /****************************************************************/
  /******** Db Connection: Uses The Created Database Connection ***/
  /****************************************************************/
  async createConnection() {
    return await DbConnector.connector;
  }

  /****************************************************************/
  /*************      Generate Random String    *******************/
  /****************************************************************/
  generateRandomString(length) {
     var result = '';
     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  /****************************************************************/
  /*****************      Get Web Token      **********************/
  /****************************************************************/
  async getWebToken(payload) {
    const dbConnection = await this.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({
        'token.web.token.jwt': payload.token
      }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /*****************      Get Mobile Token      *******************/
  /****************************************************************/
  async getMobileToken(payload) {
    const dbConnection = await this.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({
        'token.mobile.token.jwt': payload.token
      }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /*****************      Fetch Last  Token      ******************/
  /****************************************************************/
  async fetchLastPost(collection) {
    const dbConnection = await this.createConnection();
    return dbConnection.collection(collection).find().sort({'_id':-1}).limit(1).toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /*****************      Fetch Timestamp      ********************/
  /****************************************************************/
  fetchTimestamp(docId) {
    let DocId = new ObjectId(docId)
    return DocId.getTimestamp();
  }

  /****************************************************************/
  /*****************      Convert Document Id      ****************/
  /****************************************************************/
  convertDocumentId(docId) {
    let DocId = new ObjectId(docId);
    return DocId.toString();
  }
}

module.exports = Model;
