import {MongoClient, ObjectId} from 'mongodb';

import Model from './Model';
import  Jwt from 'jsonwebtoken';
/*****************************************************************/
/******* @author saladin jake victor juwa *********************************/
/******* @desc UserModel: Provides Methods For ******************/
/******* Authenticating Creating New Users ***********************/
/****************************************************************/
class UserModel extends Model {
  constructor() {  super() }
  /****************************************************************/
  /******* Get A User By His / Her Jwt Token **********************/
  /****************************************************************/
  async getUserByToken(payload) {
    try {

      if (payload.client === 'web') {
        const User = await this.getWebToken(payload);
        if (User) {
          return User;
        }

        return false;
      }

      if (payload.client === 'mobile') {
        const Token = await this.getWebToken(payload.token);

        if (Token) {
          return Token;
        }

        return false;
      }

      return false;
    } catch (e) {
      // Let's not get too verbose!!!
      return false;
    }
  }

  /****************************************************************/
  /*******    Get A User By His / Her ID     **********************/
  /****************************************************************/
  async findUserById(userID) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({ _id: new ObjectId(userID) }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /***************** Find User By Stage name     ******************/
  /****************************************************************/
  async findUserByStageName(stageName) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({ stageName }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /*******           Fetch All Users         **********************/
  /****************************************************************/
  async fetchAllUsers() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').find().toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /*******           Update A User           **********************/
  /****************************************************************/
  async updateUserAccount(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOneAndUpdate({
      email: Payload.email
    }, {
      $set: Payload
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value;
    });
  }

  async updateUserCountryAndStatus(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').updateMany({
      country: Payload.country,
    }, {
      $set: {
        status: payload.status,
        country: Payload.updated,
      }
    }, {
      returnOriginal: false
    }).then((docs) => {
      return docs;
    });
  }

  async updateUserStateAndStatus(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').updateMany({
      state: Payload.state
    }, {
      $set: {
        status: Payload.status,
        state: Payload.updated
      }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value;
    });
  }

  async updateUserState(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').updateMany({
      state: Payload.state
    }, {
      $set: {
        state: Payload.updated
      }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /*******           Update A User By Fields           ************/
  /****************************************************************/
  async updateUserByFields(payload, userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOneAndUpdate({
      _id: userId
    }, {
      $set: {
        [payload.key]: payload.value
      }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /*******          Fetch User Statustics           ***************/
  /****************************************************************/
  async fetchUserStats(value) {
    let dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').countDocuments({ status: value }).then((docsLength) => {
      return docsLength;
    })
  }

  /****************************************************************/
  /**************          Fetch All User           **************/
  /****************************************************************/
  async fetchAllUsersStats() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').countDocuments().then((docsLength) => {
      return docsLength;
    });
  }

  async fetchLastUsers(limit) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').find().sort({ _id: -1 }).limit(limit).toArray().then((docs) => {
      return docs;
    });
  }

  async fetchUserViaStatus(value) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').find({ status: value }).sort({ _id: -1 }).toArray().then((docs) => {
      return docs;
    });
  }

  async fetchUserProfile(emailAddress) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({ email: emailAddress }).then((doc) => {
      return doc;
    });
  }

  async updateUserStatus(id, status) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        status: parseInt(status)
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async searchUser(title) {
    const dbConnection = await super.createConnection();
  return dbConnection.collection('naijap_db_user').find({ stageName: /.*title.*/ })
    .toArray().then((docs) => {
      return docs;
    });
  }
}

module.exports = UserModel;
