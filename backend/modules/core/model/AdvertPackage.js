import { ObjectId } from 'mongodb';
import Model from './Model';

class AdvertPackage extends Model {
  constructor() { super(); }
  async createPackage(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert_package').insertOne(Payload)
    .then((doc) => {
      return doc.ops[0];
    });
  }

  async fetchPackages() {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert_package').find()
    .sort({ _id: -1 }).toArray().then((docs) => {
      return docs;
    });
  }

  async deletePackage(id) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_advert_package').findOneAndDelete({
      _id: new ObjectId(id)
    }).then((doc) => {
      return doc;
    });
  }
}

module.exports = AdvertPackage;
