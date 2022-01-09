import {MongoClient, ObjectId} from 'mongodb';
import Model from './Model';
import  Jwt from 'jsonwebtoken';
/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc SettingModel: Provides Methods For ***************/
/******* fetching settings configurations ***********************/
/****************************************************************/
class TokenModel extends Model {
  constructor() {
    super();
  }
  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc TokenModel:  Creates A New Token *****************/
  /****************************************************************/
  async create(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_token').insertOne(payload).then((doc) => {
      return doc.ops;
    });
  }
  /****************************************************************/
  /******* Updates A New Token ************************************/
  /****************************************************************/
  async update(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_token').findOneAndUpdate({
      email: payload.email,
      type: 'registration'
    }, {
        $set: {
          token: payload.token
        }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc;
    });
  }
  /****************************************************************/
  /******* Finds And Retrieves A Token ****************************/
  /****************************************************************/
  async checkToken(token) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_token').findOne({ token: token }).then((doc) => {
      return doc;
    });
  }
}

module.exports = TokenModel;
