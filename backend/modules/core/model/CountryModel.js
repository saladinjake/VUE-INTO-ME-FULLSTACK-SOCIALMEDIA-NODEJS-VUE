
import  { ObjectId } from 'mongodb';
import Model from './Model';

/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc Country Class : CRUD Operations for **************/
/*******            Countries               *********************/
/****************************************************************/

class CountryModel extends Model {
  constructor() {
    super();
  }


  /****************************************************************/
  /******* Creates A New Country Resource *************************/
  /****************************************************************/
  async create(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').insertOne(payload).then((doc) => {
      return doc.ops;
    });
  }

  /****************************************************************/
  /******* Creates A New Country Resource *************************/
  /****************************************************************/
  async updateStatus(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').findOneAndUpdate({
      _id: new ObjectId(payload.id)
    }, {
      $set: {
        status: payload.status
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async updateContinent(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').findOneAndUpdate({
      continentSlug: new ObjectId(payload.continentSlug)
    }, {
      $set: {
        continentSlug: payload.slug
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /******* Returns A Country Resource *****************************/
  /****************************************************************/
  async fetchAll() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').find().toArray().then((docs) => {
      return docs;
    });
  }

  async fetchApproved() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').find({ status: true }).toArray().then((docs) => {
      return docs;
    })
  }

  /****************************************************************/
  /******* Returns A Country Resource *****************************/
  /****************************************************************/
  async findByContinentSlugAndName(continentSlug, name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').findOne({ continentSlug: continentSlug, name: name }).then((doc) => {
      return doc;
    });
  }

  async findByContinentSlug(slug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').find({ continentSlug: slug }).toArray().then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /******* Returns A Country Resource *****************************/
  /****************************************************************/
  async findCountryBySlug(slug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').findOne({ slug }).then((doc) => {
      return doc;
    });
  }

  async deleteCountryViaContinent(slug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').deleteMany({
      continentSlug: slug
    }).then((docs) => {
      return docs;
    });
  }

  async deleteCountry(slug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_country').findOneAndDelete({
      slug: slug
    }).then((doc) => {
      return doc.value;
    });
  }

}


module.exports = CountryModel;
