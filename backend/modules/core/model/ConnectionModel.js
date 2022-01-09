
import  { ObjectId } from 'mongodb';
import Model from './Model';
/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc Connection Class : CRUD Operations for ***********/
/*******            Connections             *********************/
/****************************************************************/
class ConnectionModel extends Model {
  constructor() { super() }

  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc Create: Create A New Connection ******************/
  /****************************************************************/
  async create(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').insertOne(payload).then((doc) => {
      return doc.ops[0]
    });
  }

  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc Update: Update An Existing Connection ************/
  /****************************************************************/
  async updateConnection(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').findOneAndUpdate({
      _id: new ObjectId(payload.id)
    }, {
      $set: {
        status: payload.status
      }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value
    });
  }

  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc Fetch Connections: Fetch An Existing Connection **/
  /****************************************************************/
  async fetchConnections(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').find({
      follower: new ObjectId(payload.id).toString(),
      status: true
    }).toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /**************       Check Connection     **********************/
  /****************************************************************/
  async checkConnection(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').findOne(payload).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /****************      Find Connection     **********************/
  /****************************************************************/
  async findConnection(connectionId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').findOne({ _id: new ObjectId(connectionId) }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /****************      Fetch My Pending Connection    ***********/
  /****************************************************************/
  async fetchMyPendingConnections(userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').find({ following: new ObjectId(userId).toString(), status: false }).toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /****************      Fetch Approved Connection    *************/
  /****************************************************************/
  async fetchApprovedConnections(userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').find({ follower: new ObjectId(userId).toString(), status: true }).sort({ _id: -1 }).toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /********      Fetch Approved Connection Request    *************/
  /****************************************************************/
  async fetchApprovedConnectionRequest(userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').find({ following: new ObjectId(userId).toString(), status: true }).sort({ _id: -1 }).toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc Fetch Connections: Fetch An Existing Connection **/
  /****************************************************************/
  async fetchMyConnections(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').find({
      following: new ObjectId(payload.id).toString(),
      status: true
    }).toArray().then((docs) => {
      return docs;
    })
  }

  /****************************************************************/
  /******* @author saladin jake victor juwa ********************************/
  /******* @desc Delete: Delete An Existing Connection ************/
  /****************************************************************/
  async deleteConnection(payload) {
    //!# When a user disapproves a connection, this gets deleted automatically.
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_connection').findOneAndDelete({ _id: new ObjectId(payload.id) }).then((doc) => {    
      return doc.value
    });
  }
}

module.exports = ConnectionModel;
