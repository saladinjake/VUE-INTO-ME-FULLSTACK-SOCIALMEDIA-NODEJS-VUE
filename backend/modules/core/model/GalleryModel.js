
import  { ObjectId } from 'mongodb';
import Model from './Model';

/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc Country Class : CRUD Operations for **************/
/*******            Countries               *********************/
/****************************************************************/

class GalleryModel extends Model {
  constructor() { super() }

  /****************************************************************/
  /******* Creates A New Gallery Resource *************************/
  /****************************************************************/
  async createGallery(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_gallery').insertOne(payload).then((doc) => {
      return doc.ops[0];
    });
  }

  /****************************************************************/
  /********* Fetch All Images From A User *************************/
  /****************************************************************/
  async fetchGalleries(userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_gallery').find({ userId: userId }).sort({ _id: -1 }).toArray().then((docs) => {      
      return docs;
    });
  }
}

module.exports = GalleryModel;
