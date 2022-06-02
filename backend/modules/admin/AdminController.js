const _ = require('lodash');
const CryptoJS = require("crypto-js");
const Validator = require('validator');

/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');
const AdminLoginModel = require('../core/model/AdminLoginModel');

class AdminController extends Controller {
  constructor() {
    super();
  }

  async fetchAdmin(req, res) {
    const Admin = new AdminLoginModel();
    const Response = { status: 200, message: [], data: [] };
    try {
      let admins = await Admin.fetchAllAdmins();
      if (admins) {
        for (let i = 0; i < admins.length; i++) {
          admins[i].humanTime = admins[i]._id.getTimestamp();
        }
        Response.status = 200;
        Response.data.push(admins);

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

  async updateAdmin(req, res) {
    let Payload = {};
    let { id, userName, password, roles, status } = req.body;

    const Response = { status: 200, message: [], data: [] };
    const User = new AdminLoginModel();

    // First Level verification.............
    if (userName === undefined || userName == '') {
      Response.status = 400;
      Response.message.push({ userName: 'Sorry, The userName field cannot be empty.' });
    }

    if (roles.length < 1) {
      Response.status = 400;
      Response.message.push({ roles: 'Sorry, The roles field cannot be empty.' });
    }

    try {
      const checkUserName = await User.checkUserName({ userName: userName });

      // Second Level verification..........
      if (checkUserName) {
        if (checkUserName.userName != userName) {
          Response.status = 409;
          Response.message.push({ userName: 'Sorry, An account with this User Name already exist.' });
        }
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      // Create Payload...........
      if (password.trim() !== '') {
        password = CryptoJS.AES.encrypt(password, 'kshjfiofiuens-djsdjhdh-secret-password').toString();

        Payload = {
          userName: userName,
          password: password,
          roles: roles,
          status: status
        }
      } else {
        Payload = {
          userName: userName,
          roles: roles,
          status: status
        }
      }


      // Filter Data..........
      let updatedAdmin = await User.update(Payload, id);

      // Return Payload.........
      Response.status = 200;
      Response.data.push(updatedAdmin);
      res.status(200).json(Response);
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

  async updateAdminStatus(req, res) {
    const User = new AdminLoginModel();
    const Response = { status: 200, message: [], data: [] };

    try {
      let payload = {
        userName: req.params.userName,
        status: req.params.status
      }

      let updatedStatus = await User.updateAdminStatus(payload);
      if (updatedStatus) {
        Response.status = 200;
        Response.data.push(updatedStatus);

        res.status(200).json(updatedStatus);
        return;
      }

      Response.status = 400;
      Response.message.push({ status: 'Sorry, An Unknown Error Occurred And The Admin Status Could Not Be Updated.' });

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

  async deleteAdmin(req, res) {
    const User = new AdminLoginModel();
    const Response = { status: 200, message: [], data: [] };
    try {
      let userName = req.params.userName;

      let deletedUser = await User.deleteAdmin(userName);
      if (deletedUser) {
        Response.status = 200;
        Response.data.push(deletedUser);

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.data.push({ admin: 'An Unknown Error Occurred And The Selected Admin Could Not Be Deleted.' });

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

  async updatePaymentSettings(req, res) {
    try {

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

module.exports = new AdminController();
