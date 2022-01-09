
import Model from './Model';
/****************************************************************/
/******* @author saladin jake victor juwa ********************************/
/******* @desc SettingModel: Provides Methods For ***************/
/******* fetching settings configurations ***********************/
/****************************************************************/
class SettingModel extends Model {
  constructor() {
    super();
  }

  /****************************************************************/
  /*****************      Create Settings        ******************/
  /****************************************************************/
  async createSettings(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_settings').updateOne({
      key: payload.key
    }, {
      $set: payload
    }, { upsert: true }).then((doc) => {
      return doc.value;
    })
  }

  /****************************************************************/
  /*****************      Fetch Settings        *******************/
  /****************************************************************/
  async fetchSettings() {
    const dbConnection = await this.createConnection();
    return dbConnection.collection('naijap_db_settings').find({}).toArray()
    .then((docs) => {
      return docs;
    });
  }

  async fetchSetting(key) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_settings').findOne({
      key: key
    }).then((doc) => {
      return doc;
    });
  }
}


module.exports = SettingModel;
