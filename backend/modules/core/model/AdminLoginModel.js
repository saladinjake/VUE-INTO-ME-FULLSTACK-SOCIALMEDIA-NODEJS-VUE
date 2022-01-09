import { ObjectId } from'mongodb';
import Jwt from 'jsonwebtoken';
import Model from './Model';
/****************************************************************/
/******************** Admin Login Model *************************/
/****************************************************************/
class AdminLoginModel extends Model {
  constructor() { super() }
  /****************************************************************/
  /********************  login: Logs in an admin ******************/
  /****************************************************************/
  async create(payload) {
    let connectionId = super.generateRandomString(40) + Math.floor(Math.random(200, 900)) * 4 + '-' + Math.ceil(Math.random(1000, 8000) * 5) * Math.ceil(Math.random() * 20);
    let jwtToken = await Jwt.sign(
      {
        data: {
          access: 'admin-auth',
        }
      },
      `kshjfiofiuens-naijap-djsdjhdh-secret-${connectionId}`,
      {
        expiresIn: '1day'
      }
    );

    // Attach the jwtToken to the payload...
    payload.connectionId = connectionId;
    payload.token = jwtToken;
    payload.lastSeen = global.Date();

    // Initiate the database connection and send the data...
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_admin').insertOne(payload)
      .then((doc) => {
        return doc.ops;
    });
  }

  async update(payload, id) {
    // Initiate the database connection and send the data...
    const dbConnection = await super.createConnection();
    if (payload.password) {
      return dbConnection.collection('naijap_db_admin').findOneAndUpdate({
        _id: new ObjectId(id)
      }, {
        $set: {
          userName: payload.userName,
          roles: payload.roles,
          password: payload.password,
          status: payload.status
        }
      }, { returnOriginal: false }).then((doc) => {
          return doc.value;
      });
    }

    return dbConnection.collection('naijap_db_admin').findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        userName: payload.userName,
        roles: payload.roles,
        status: payload.status
      }
    }, { returnOriginal: false }).then((doc) => {
        return doc.value;
    });
  }

  /****************************************************************/
  /********************  login: Logs in an admin ******************/
  /****************************************************************/
  async fetchCredentials(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_admin').findOne({ userName: payload.userName, status: 'active' })
      .then((doc) => {
        return doc;
      });
  }

  /****************************************************************/
  /**********  UserName: Checks if a username is still valid ******/
  /****************************************************************/
  async checkUserName(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_admin').findOne({ userName: payload.userName })
      .then((doc) => {
        return doc;
    });
  }

  /****************************************************************/
  /********************  login: Logs in an admin ******************/
  /****************************************************************/
  async login(payload) {
    let connectionId = super.generateRandomString(40) + Math.floor(Math.random(200, 900)) * 4 + '-' + Math.ceil(Math.random(1000, 8000) * 5) * Math.ceil(Math.random() * 20);
    let jwtToken = await Jwt.sign(
      {
        data: {
          access: 'admin-auth',
        }
      },
      `kshjfiofiuens-naijap-djsdjhdh-secret-${connectionId}`,
      {
        expiresIn: '1day'
      }
    );

    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_admin').findOneAndUpdate({
      userName: payload.userName
    }, {
      $set: {
        connectionId: connectionId,
        token: jwtToken,
        lastSeen: global.Date()
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /********************  Fetches An Admin Token *******************/
  /****************************************************************/
  async fetchToken(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_admin').findOne({ token: payload.token, status: 'active' })
      .then((doc) => {
        return doc;
    });
  }

  async fetchAllAdmins() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_admin').find()
      .toArray().then((docs) => {
      return docs;
    });
  }

  async updateAdminStatus(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_admin').findOneAndUpdate({
      userName: payload.userName
    }, {
      $set: {
        status: payload.status
      }
    }).then((doc) => {
      return doc.value;
    });
  }

  async deleteAdmin(userName) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_admin').findOneAndDelete({
      userName: userName
    }).then((doc) => {
      return doc.value;
    });
  }
}

module.exports = AdminLoginModel;
