import Model from './Model';
/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc Country Class : CRUD Operations for **************/
/*******               States               *********************/
/****************************************************************/
class UserTypeModel extends Model {
  constructor() {
    super();
  }
  /****************************************************************/
  /******* Creates A New UserType Resource ************************/
  /****************************************************************/
  async create(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user_type').insertOne(payload).then((doc) => {
      return doc.ops;
    });
  }

  /****************************************************************/
  /******* Returns all user type **********************************/
  /****************************************************************/
  async fetchAll() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user_type').find().toArray().then(async (docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /******* Checks if a user type exist ****************************/
  /****************************************************************/
  async fetchByName(name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user_type').findOne({ name }).then((doc) => {
      return doc;
    });
  }
}
module.exports = UserTypeModel;
