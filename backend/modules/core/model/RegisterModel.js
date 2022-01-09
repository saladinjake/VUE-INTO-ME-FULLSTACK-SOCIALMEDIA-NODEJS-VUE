import {MongoClient, ObjectId} from 'mongodb';

import Model from './Model';
import  Jwt from 'jsonwebtoken';


/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc RegisterModel: Provides Methods For **************/
/******* fetching Creating New Users ****************************/
/****************************************************************/

class RegisterModel extends Model {
  constructor() {
    super();
  }

  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc RegisterModel: Registers A New User **************/
  /****************************************************************/
  async create(payload) {

    /****************************************************************/
    /******* Creates a db conn & and a user id **********************/
    /*******          for the jwt token        **********************/
    /****************************************************************/
    const dbConnection = await super.createConnection();
    const _ID = new ObjectId();
    const ConnectionId = super.generateRandomString(40) + Math.floor(Math.random(200, 900)) * 4 + '-' + Math.ceil(Math.random(1000, 8000) * 5) * Math.ceil(Math.random() * 20);
    const userToken = {
      web: {
        token: [] /****   contains the payload of the access type, and a generated connectionId *****/
      },
      mobile: {
        token: [] /****   contains the payload of the access type, and a generated connectionId *****/
      }
    };


    /****************************************************************/
    /******* Creates a new JWT Token for the vue web app ************/
    /****************************************************************/
    if (payload.userAgent === 'web') {
      let jwtToken = await Jwt.sign({
        data: {
          access: 'auth',
          type: payload.userAgent,
        }}, `kshjfiofiuens-naijap-djsdjhdh-secret-${ConnectionId}`, { expiresIn: '2days' });
      userToken.web.token.push({ jwt: jwtToken, connId: ConnectionId });
      /****************************************************************/
      /******* Creates and returns the just created user **************/
      /****************************************************************/
      payload._id = _ID;
      payload.status = 0; // 1... Active, 0.... Pending, 2..... Suspended
      payload.token = userToken;
      return dbConnection.collection('naijap_db_user').insertOne(payload).then((doc) => {
        return doc.ops;
      });
    }

    if (payload.userAgent === 'mobile') {
      let jwtToken = await Jwt.sign({
        data: {
          access: 'auth',
          type: payload.userAgent,
        }}, `kshjfiofiuens-naijap-djsdjhdh-secret-${ConnectionId}`, { expiresIn: '6months' });
      userToken.mobile.token.push({ jwt: jwtToken, connId: ConnectionId});
      /****************************************************************/
      /******* Creates and returns the just created user **************/
      /****************************************************************/
      payload._id = _ID;
      payload.status = 0; // 1... Active, 0.... Pending, 2..... Suspended
      payload.token = userToken;
      return dbConnection.collection('naijap_db_user').insertOne(payload).then((doc) => {
        return doc.ops;
      });
    }
  }

  /****************************************************************/
  /******* Checks if a user email exist ***************************/
  /****************************************************************/
  async checkUserByEmail(email) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({ email }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /******* Checks if a user phone exist ***************************/
  /****************************************************************/
  async checkUserByPhone(phone) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({ phone }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /******* Checks if a user phone exist ***************************/
  /****************************************************************/
  async checkUserByStageName(stageName) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({ stageName }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /*******    Update A User Status     ***************************/
  /****************************************************************/
  async updateUserStatus(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOneAndUpdate({
      email: payload.email
    }, {
      $set: {
        status: 1
      }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value;
    });
  }
}

module.exports = RegisterModel;
