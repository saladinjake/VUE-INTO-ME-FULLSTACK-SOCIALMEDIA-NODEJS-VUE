import  _ from 'lodash';
import  { ObjectId } from 'mongodb';
import Model from './Model';

/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc Country Class : CRUD Operations for **************/
/*******            Countries               *********************/
/****************************************************************/

class CategoryModel extends Model {
  constructor() {
    super();
  }

  async createForum(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_forum_categories').insertOne({
      name: data,
      slug: _.kebabCase(data)
    }).then((doc) => {
      return doc.ops[0];
    });
  }

  async createUserTypes(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user_type').insertOne({
      name: data,
      slug: _.kebabCase(data)
    }).then((doc) => {
      return doc.ops[0];
    });
  }

  async createMediaTypes(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_media_type_categories').insertOne({
      name: data,
      slug: _.kebabCase(data)
    }).then((doc) => {
      return doc.ops[0];
    });
  }

  async fetchAllForumTypes(name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_forum_categories').find().toArray().then((docs) => {
      return docs;
    });
  }

  async fetchAllMediaTypes(name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_media_type_categories').find().toArray().then((docs) => {
      return docs;
    });
  }

  async fetchAllUserTypes(name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user_type').find().toArray().then((docs) => {
      return docs;
    });
  }

  async fetchForumType(name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_forum_categories').findOne({
      name: name
    }).then((doc) => {
      return doc;
    });
  }

  async fetchMediaType(name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_media_type_categories').findOne({
      name: name
    }).then((doc) => {
      return doc;
    });
  }

  async fetchUserType(name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user_type').findOne({
      name: name
    }).then((doc) => {
      return doc;
    });
  }

  async updateForumCategory(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_forum_categories').findOneAndUpdate({
      _id: new ObjectId(data._id)
    }, {
      $set: {
        name: data.name,
        slug: _.kebabCase(data.name)
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async updateUserType(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user_type').findOneAndUpdate({
      _id: new ObjectId(data._id)
    }, {
      $set: {
        name: data.name,
        slug: _.kebabCase(data.name)
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async updateMediaType(data) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_media_type_categories').findOneAndUpdate({
      _id: new ObjectId(data._id)
    }, {
      $set: {
        name: data.name,
        slug: _.kebabCase(data.name)
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async deleteForumType(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_forum_categories').findOneAndDelete({ _id: new ObjectId(payload) }).then((doc) => {
      return doc.value
    });
  }

  async deleteMediaType(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_media_type_categories').findOneAndDelete({ _id: new ObjectId(payload) }).then((doc) => {
      return doc.value
    });
  }

  async deleteUserType(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_user_type').findOneAndDelete({ _id: new ObjectId(payload) }).then((doc) => {
      return doc.value
    });
  }
}

module.exports = CategoryModel;
