import { ObjectId } from 'mongodb';
import Model from './Model';
/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc PostActivity Class : CRUD Operations for *********/
/*******            Activities             *********************/
/****************************************************************/

class PostActivityModel extends Model {
  constructor() { super() }

  /****************************************************************/
  /***************     Add Likes Views Fav To Post     ************/
  /****************************************************************/
  async addLikesViewsFavToPost(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_posts_activity').insertOne({ postId: payload.postId, userId: payload.userId, type: payload.type, comment: null }).then((doc) => {
      return doc.ops[0];
    });
  }

  /****************************************************************/
  /***************  Delete Likes Views Fav To Post     ************/
  /****************************************************************/
  async deleteLikesViewsFavFromPost(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_posts_activity').findOneAndDelete({ postId: payload.postId, userId: payload.userId, type: payload.type, comment: null }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /*****************  Add Comments To Post     ********************/
  /****************************************************************/
  async addCommentsToPost(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_posts_activity').insertOne({ postId: payload.postId, userId: payload.userId, type: payload.type, comment: payload.comment }).then((doc) => {
      return doc.ops[0];
    });
  }

  /****************************************************************/
  /*****************  Delete Comments     *************************/
  /****************************************************************/
  async deleteComments(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_posts_activity').insertOne({ postId: payload.postId, userId: payload.userId, type: payload.type, comment: payload.comment }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /*****************  Find Activities     *************************/
  /****************************************************************/
  async findActivity(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_posts_activity').findOne(payload).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /*****************  Find All Comments     ***********************/
  /****************************************************************/
  async findAllComments(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_posts_activity').find({
      postId: payload.postId,
      type: 'comment',
    }).toArray().then((docs) =>{
      return docs;
    });
  }

  async findUserFavs(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_posts_activity').find({
      userId: Payload.userId,
      type: 'favourite'
    }).toArray().then((docs) => {
      return docs;
    });
  }
}

module.exports = PostActivityModel;
