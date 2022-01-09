
import  { ObjectId } from 'mongodb';
import Model from './Model';

/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc Country Class : CRUD Operations for **************/
/*******            Countries               *********************/
/****************************************************************/

class ContinentModel extends Model {
  constructor() {
    super();
  }

  /****************************************************************/
  /******* Creates A New Country Resource *************************/
  /****************************************************************/
  async create(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_continent').insertOne(payload).then((doc) => {
      return doc.ops;
    });
  }

  /****************************************************************/
  /******* Creates A New Continent Document ***********************/
  /****************************************************************/
  async fetchAll() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_continent').find().toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /******* Fetches A Single Continent Document ********************/
  /****************************************************************/
  async fetchOne(continentName) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_continent').findOne({ name: continentName }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /******* Updates A Single Continent Document ********************/
  /****************************************************************/
  async update(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_continent').findOneAndUpdate({
      _id: new ObjectId(payload.id)
    }, {
      $set: {
        name: payload.name,
        slug: payload.slug
      }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value;
    });
  }

  async updateStatus(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_continent').findOneAndUpdate({
      _id: new ObjectId(payload.id)
    }, {
      $set: {
        status: payload.status
      }
    }, {
      returnOriginal: false
    }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /******* Returns A Country Resource *****************************/
  /****************************************************************/
  async findBySlug(slug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_continent').findOne({ slug: slug }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /******* Deletes A Single Continent Document ********************/
  /****************************************************************/
  async deleteContinent(slug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_continent').findOneAndDelete({
      slug: slug
    }).then((doc) => {
      return doc.value;
    });
  }
}

module.exports = ContinentModel;
