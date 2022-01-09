import { ObjectId } from 'mongodb';
import Model from './Model';

class AdvertModel extends Model {
  constructor() { super(); }
  async createAdvert(Payload) {
    Payload._id = new ObjectId();
    Payload.title = '';
    Payload.userId = '';
    Payload.country = '';
    Payload.banner = '';
    Payload.state = '';
    Payload.description = '';
    Payload.amount = '';
    Payload.views = 0;
    Payload.clicks = 0;
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').insertOne(Payload)
    .then((doc) => {
      return doc.ops[0];
    });
  }

  async checkAdvert(ref) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').findOne({
      tranxRef: ref
    }).then((doc) => {
      return doc;
    });
  }

  async fetchAdvert(id) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').findOne({
      _id: new ObjectId(id)
    }).then((doc) => {
      return doc;
    });
  }

  async fetchUserAdverts(userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').find({
      userId
    }).sort({ _id: -1 }).toArray().then((docs) => {
      return docs;
    });
  }

  async fetchActiveAdverts() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').find({ status: true })
    .sort({ _id: -1 }).toArray().then((docs) => {
      return docs;
    });
  }

  async fetchPendingAdverts() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').find({ status: false })
    .sort({ _id: -1 }).toArray().then((docs) => {
      return docs;
    });
  }

  async updateAdvertStatus(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').findOneAndUpdate({
    _id: new ObjectId(Payload._id),
    }, {
      $set: {
        status: Payload.status
      }
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async updateAdvert(id, Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').findOneAndUpdate({
      _id: new ObjectId(id),
    }, {
      $set: Payload
    }, { returnOriginal: false }).then((doc) => {
      return doc.value;
    });
  }

  async deleteAdvert(id) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert').findOneAndDelete({
      _id: new ObjectId(id)
    }).then((doc) => {
      return doc;
    });
  }
}

module.exports = AdvertModel;
