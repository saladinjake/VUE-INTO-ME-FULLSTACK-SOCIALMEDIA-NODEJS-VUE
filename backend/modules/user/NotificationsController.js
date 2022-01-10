const _ = require('lodash');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../Controller');
const UserModel = require('../../model/UserModel');
const ConnectionModel = require('../../model/ConnectionModel');
const NotificationsModel = require('../../model/NaijapNotificationModel');

class NotificationsController extends Controller {
  constructor() { super() }

  /****************************************************************/
  /*******       Get Notifications          ***********************/
  /****************************************************************/
  async getNotifications(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);
    if (!User) {
      Response.status = 401;
      Response.message.push({ user: 'A user with this token could not be found and verified.' });
      res.status(401).json(Response);
      return;
    }

    try {
      const UserDb = new UserModel();
      const Connection = new ConnectionModel();
      const Notification = new NotificationsModel();
      const Notifications = await Notification.fetchNotifications(User._id);
      // check the type of notification and fetch some data along....
      if (Notifications.length > 0) {
        for (let i = 0; i < Notifications.length; i++) {
          switch (Notifications[i].type) {
            case 'new_connection':
              // fetch the user avatar...
              // This will fetch the connection and also the user record...
              // BUG: This will really slow down the loop for bigger record...
              let connection = await Connection.findConnection(Notifications[i].document_id);
              if (connection) {
                // Fetch the sender ID....
                let userDb = await UserDb.findUserById(connection.follower);
                if (userDb) {
                  Notifications[i].user = {
                    id: userDb._id,
                    avatar: userDb.avatar || ''
                  }
                }
              }
              break;
            default:
            break;
          }

          Notifications[i].timestamp = Notifications[i]._id.getTimestamp();
        }
        Notifications.meta = {};
        Response.status = 200;
        Response.data.push(Notifications);
        res.status(200).json(Response);
        return;
      }

      Response.status = 204;
      res.status(204).json(Response);
      return;
    } catch (e) {
      Response.status = 500;
      Response.message.push({
        server: {
          customMessage: `Sorry, an exception occurred and your request could not be completed. `,
          errorName: e.name,
          errorMessage: e.message
        }
      })
      res.status(500).json(Response);
      return;
    }
  }

  /****************************************************************/
  /*******       Delete Notifications          ********************/
  /****************************************************************/
  async deleteNotification(req, res) {
    const Response = { status: 20, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);
    if (!User) {
      Response.status = 401;
      Response.message.push({ user: 'A user with this token could not be found and verified.' });
      res.status(401).json(Response);
      return;
    }

    try {
      const Notification = new NotificationsModel();
      let deletedNotification = await Notification.deleteNotification(req.params.notificationId);
      if (deletedNotification) {
        Response.data.push(deletedNotification);
        res.status(200).json(Response);
        return;
      }

      Response.status = 500;
      res.status(500).json(Response);
      return;
    } catch (e) {
      Response.status = 500;
      Response.message.push({
        server: {
          customMessage: `Sorry, an exception occurred and your request could not be completed. `,
          errorName: e.name,
          errorMessage: e.message
        }
      });
      res.status(500).json(Response);
      return;
    }
  }

  /****************************************************************/
  /*******       Delete Notification Query          ***************/
  /****************************************************************/
  async deleteNotificationQueryMethod(req, res) {
    const Response = { status: 20, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);
    if (!User) {
      Response.status = 401;
      Response.message.push({ user: 'A user with this token could not be found and verified.' });
      res.status(401).json(Response);
      return;
    }

    try {
      const Notification = new NotificationsModel();
      let deletedNotification = await Notification.deleteNotificationQuery(req.body);

      if (deletedNotification) {
        Response.data.push(deletedNotification);
        res.status(200).json(Response);
        return;
      }

      Response.status = 500;
      res.status(500).json(Response);
      return;
    } catch (e) {
      Response.status = 500;
      Response.message.push({
        server: {
          customMessage: `Sorry, an exception occurred and your request could not be completed. `,
          errorName: e.name,
          errorMessage: e.message
        }
      });
      res.status(500).json(Response);
      return;
    }
  }
}

const Notifications = new NotificationsController();
module.exports = Notifications;
