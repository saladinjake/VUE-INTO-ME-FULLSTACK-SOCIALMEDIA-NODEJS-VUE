const _ = require('lodash');
const CryptoJS = require("crypto-js");
const Validator = require('validator');

/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../Controller');
const AdminLoginModel = require('../../model/AdminLoginModel');

class AdminLoginController extends Controller {
  constructor() { super(); }

  /****************************************************************/
  /************   Logs In An Administrator To The Application   ***/
  /****************************************************************/
  async login(req, res) {
    const Login = new AdminLoginModel();
    const { userName, password } = req.body;
    const Response = { status: 200, message: [], data: [] };

    if (userName === undefined || userName == '') {
        Response.status = 400;
        Response.message.push({ userName: 'Sorry, Please, this Field cannot be empty.' });
    }

    if (password === undefined || password == '') {
        Response.status = 400;
        Response.message.push({ password: 'Sorry, The Password field is required.' });
    }

    try {
      /****************************************************************/
      /*******      Check If The Mail Exist    ************************/
      /****************************************************************/
      let user = await Login.fetchCredentials({ userName: userName });
      if (!user || user === null || user == undefined) {
        Response.status = 204;
        Response.message.push({ user: 'Sorry, This account did not pass first level verification.' });

        res.status(400).json(Response);
        return;
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /*******      Decode And Compare The Password    ****************/
      /****************************************************************/
      const HashedPassword = CryptoJS.AES.decrypt(user.password, 'kshjfiofiuens-djsdjhdh-secret-password').toString(CryptoJS.enc.Utf8);
      if (HashedPassword !== password) {
        Response.status = 400;
        Response.message.push({ error: 'Please, Check the User name And Password then try again.' });

        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /********************      Login The User   *********************/
      /****************************************************************/
      const User = await Login.login({ userName: userName });
      if (!User || User == undefined || User == null) {
          Response.status = 204;
          res.status(204).json(Response);
          return;
      }

      Response.status = 200;
      Response.data.push(_.omit(User, ['_id', 'connectionId']));
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
      console.log(e);
      res.status(500).json(Response);
      return;
    }
  }

  /****************************************************************/
  /********************   Create A New Admin   ********************/
  /****************************************************************/
  async create(req, res) {
    let { userName, password, status, roles } = req.body;
    const Response = { status: 200, message: [], data: [] };
    const User = new AdminLoginModel();

    // First Level verification.............
    if (userName === undefined || userName == '') {
      Response.status = 400;
      Response.message.push({ userName: 'Sorry, The userName field cannot be empty.' });
    }

    if (password.length <= 6) {
      Response.status = 400;
      Response.message.push({ password: 'Sorry, Please, use a stronger password.' });
    }

    if (roles.length < 1) {
      Response.status = 400;
      Response.message.push({ roles: 'Sorry, The roles field cannot be empty.' });
    }

    try {
      const checkUserName = await User.checkUserName({ userName: userName });

      // Second Level verification..........
      if (checkUserName) {
        Response.status = 409;
        Response.message.push({ userName: 'Sorry, An account with this User Name already exist.' });
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      // Create Payload...........
      password = CryptoJS.AES.encrypt(password, 'kshjfiofiuens-djsdjhdh-secret-password').toString();
      const Payload = {
        userName: userName,
        password: password,
        roles: roles,
        status: status,
      }

      // Filter Data..........
      let newUser = await User.create(Payload);
      newUser[0].humanTime = newUser[0]._id.getTimestamp();

      // Return Payload.........
      Response.status = 201;
      Response.data.push(newUser[0]);
      res.status(201).json(Response);
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

module.exports = new AdminLoginController();
