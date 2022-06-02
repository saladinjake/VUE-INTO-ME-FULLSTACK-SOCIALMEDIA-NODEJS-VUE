const _ = require('lodash');
const Jwt = require('jsonwebtoken');

const Controller = require('../core/controllers/Controller');
const UserModel = require('../core/model/UserModel');
const CommunicationModel = require('../core/model/CommunicationModel');

class CommunicationController extends Controller {
  constructor() { super() }

  async fetchMessages(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Communication = new CommunicationModel();
      let messages = await Communication.fetchMessages();

      if (messages.length > 0) {
        for (let i = 0; i < messages.length; i++) {
          messages[i].humanTime = messages[i]._id.getTimestamp();
        }

        Response.status = 200;
        Response.data.push(messages);

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
      });
      res.status(500).json(Response);
      return;
    }
  }

  async replyMessages(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let email = req.body.email;
      let message = req.body.message;
      let type = req.body.type;

      if (type == 'non-subscriber') {
        Response.status = 200;
        Response.message.push({ message: 'Your Message Has Been Sent Successfully.' });

        res.status(200).json(Response);
        return;
      }

      // fetch subscriber messages........
      const Communication = new CommunicationModel();
      let subscriberMessages = await Communication.fetchMessage(email);

      if (subscriberMessages) {
        let savedMessages = subscriberMessages.messages;
        savedMessages.push({ from: 'admin', title: req.body.title, content: message });

        message = savedMessages;
      } else {
        message = [{ from: 'admin', title: req.body.title, content: message }];
      }

      // saved messages...
      let savedMessage = await Communication.replyMessage({
        email: email,
        message: message
      });

      if (savedMessage.result.ok) {
        Response.status = 200;
        Response.data.push(savedMessage);

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ message: 'Sorry, An Unexpected Error Occurred And Your Message Could Not Be Sent.' });

      res.status(400).json(Response);
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

  async deleteMessage(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let email = req.params.email;
      const Communication = new CommunicationModel();

      let deletedComunication = await Communication.deleteMessage({ email: email });
      if (deletedComunication) {
        Response.status = 200;
        Response.data.push(deletedComunication);

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ message: 'Sorry, An Unexpected Error Occurred And The Selected Message Could Not Be Deleted.' });

      res.status(400).json(Response);
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

module.exports = new CommunicationController();
