import { ObjectId } from 'mongodb';
import Model from './Model';
/*****************************************************************/
/******* @author saladin jake victor juwa *********************************/
/******* @desc NaijapModel: Saves Sockets Users ******************/
/****************************************************************/
class NaijapNotificationModel extends Model {
  constructor() { super() }

  /****************************************************************/
  /*********     Create A New Notification     ********************/
  /****************************************************************/
  async create(Payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_notifications').insertOne(Payload).then((doc) => {
      return doc.ops[0];
    });
  }

  /****************************************************************/
  /*********     Fetch Notifications For A User     ***************/
  /****************************************************************/
  async fetchNotifications(userId) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_notifications').find({ userId: new ObjectId(userId).toString() }).sort({ _id: -1 }).toArray().then((docs) => {
      return docs;
    });
  }

  /****************************************************************/
  /***************     Delete Notification     ********************/
  /****************************************************************/
  async deleteNotification(notificationId, notificationType) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_notifications').findOneAndDelete({ _id: new ObjectId(notificationId) }).then((doc) => {
      return doc.value;
    });
  }

  /****************************************************************/
  /***************     Delete Notification Query    ***************/
  /****************************************************************/
  async deleteNotificationQuery(payload) {
    const dbConnection = await super.createConnection();
    return dbConnection.collection('naijap_db_notifications').findOneAndDelete(payload).then((doc) => {
      return doc.value;
    });
  }
}

module.exports = NaijapNotificationModel;
