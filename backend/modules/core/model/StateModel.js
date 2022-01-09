import { ObjectId} from 'mongodb';
import Model from './Model';
/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc Country Class : CRUD Operations for **************/
/*******               States               *********************/
/****************************************************************/
class StateModel extends Model {
  constructor() {
    super();
  }

  /****************************************************************/
  /******* Creates A New State Resource ***************************/
  /****************************************************************/
  async create(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').insertOne(payload).then((doc) => {
      return doc.ops;
    });
  }

  /****************************************************************/
  /******* Creates A New State Resource ***************************/
  /****************************************************************/
  async update(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').findOneAndUpdate({
      _id: new ObjectId(payload.id)
    }, {
      $set: {
        slug: payload.slug,
        name: payload.name,
        status: payload.status,
        countrySlug: payload.countrySlug,
      }
    }, { returnOriginal: true }).then((doc) => {
      return doc.value;
    });
  }

  async updateStateStat(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').findOneAndUpdate({
      _id: new ObjectId(payload.id)
    }, {
      $set: {
        status: payload.status,
      }
    }, { returnOriginal: true }).then((doc) => {
      return doc.value;
    });
  }

  async updateStateStatusField(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').findOneAndUpdate({
      _id: new ObjectId(payload.id)
    }, {
      $set: {
        status: payload.status,
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async updateStatus(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').updateMany({
      countrySlug: payload.countrySlug
    }, {
      $set: {
        status: payload.status,
      }
    }).then((doc) => {
      return doc;
    });
  }

  async updateCountrySlug(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').findOneAndUpdate({
      countrySlug: payload.slug
    }, {
      $set: {
        countrySlug: payload.updated,
      }
    }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /******* Returns A List of active State Resource   **************/
  /****************************************************************/
  async fetchAll() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').find({ status: true }).toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /******* Returns A state Resource   *****************************/
  /******* By countrySlug And Name    *****************************/
  /****************************************************************/
  async findByCountrySlugAndName(countrySlug, name) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').findOne({ countrySlug: countrySlug, name: name }).then((doc) => {
      return doc;
    });
  }

  /****************************************************************/
  /******* Returns All state Resource *****************************/
  /*******      Using CountrySlug     *****************************/
  /****************************************************************/
  async findStatesByCountrySlug(countrySlug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').find({ $or: [ {countrySlug: countrySlug, status: true}, {countrySlug: countrySlug, status: "true"} ] }).toArray().then((doc) => {
      return doc;
    });
  }

  async fetchStates(countrySlug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').find().toArray().then((doc) => {
      return doc;
    });
  }

  async deleteStateViaCountry(countrySlug) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').deleteMany({ countrySlug: countrySlug }).then((docs) => {
      return docs;
    });
  }

  async deleteState(state) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_state').findOneAndDelete({ slug: state }).then((doc) => {
      return doc.value;
    });
  }
}


module.exports = StateModel;
