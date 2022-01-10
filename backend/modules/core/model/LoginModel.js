import {MongoClient, ObjectId} from 'mongodb';
import Jwt from 'jsonwebtoken';
import Model from './Model';
/*****************************************************************/
/******* @author saladin jake victor juwa *********************************/
/******* @desc LoginModel: Provides Methods For ******************/
/******* Authenticating Creating New Users ***********************/
/****************************************************************/
class LoginModel extends Model {
  constructor() {
    super();
  }
  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc LoginModel: Check A User Record ******************/
  /****************************************************************/
  async checkEmail(email) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user').findOne({ email: email }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc LoginModel: Check A User Record ******************/
  /****************************************************************/
  async login(payload) {
    const Token = payload.token;
    const ConnectionId = super.generateRandomString(40) + Math.floor(Math.random(200, 900)) * 4 + '-' + Math.ceil(Math.random(1000, 8000) * 5) * Math.ceil(Math.random() * 20);
    const dbConnection = await super.createConnection();
    /****************************************************************/
    /******* Creates a new JWT Token for the vue web app ************/
    /****************************************************************/
    if (payload.userAgent === 'web') {
      let jwtToken = await Jwt.sign({
        data: {
          access: 'auth',
          type: payload.userAgent,
        }}, `kshjfiofiuens-naijap-djsdjhdh-secret-${ConnectionId}`, { expiresIn: '2days' });
      Token.web.token.push({ jwt: jwtToken, connId: ConnectionId });
    }

    if (payload.userAgent === 'mobile') {
      let jwtToken = await Jwt.sign({
        data: {
          access: 'auth',
          type: payload.userAgent,
        }}, `kshjfiofiuens-naijap-djsdjhdh-secret-${ConnectionId}`, { expiresIn: '6months' });
      Token.mobile.token.push({ jwt: jwtToken, connId: ConnectionId});
    }

    /****************************************************************/
    /******* Update The Existing User Record ************************/
    /****************************************************************/
    return dbConnection.collection('naijap_db_user').findOneAndUpdate({
      email: payload.email,
    }, {
      $set: {
        token: Token,
        presence: 'online',
        lastSeen: global.Date()
      }
    }, {
      returnOriginal: false
    }).then((doc) => {      
      return doc.value;
    });
  }
}

module.exports = LoginModel;
