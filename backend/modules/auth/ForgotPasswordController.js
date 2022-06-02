const _ = require('lodash');
const CryptoJS = require("crypto-js");
const Validator = require('validator');

/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');
const TokenModel = require('../core/model/TokenModel');
const UserModel = require('../core/model/UserModel');
const LoginModel = require('../core/model/LoginModel');
const ForgotPasswordNotification = require('../../helpers/notification/ForgotPasswordNotification');

class ForgotPasswordController extends Controller {
  constructor() { super(); }

  /****************************************************************/
  /*******************      Check Email ***************************/
  /****************************************************************/
  async checkEmail(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Email = req.params.email;

    if (!Validator.isEmail(Email)) {
      Response.status = 400;
      Response.message.push({ email: 'Please, use a valid Email Address.' });
    }

    if (Email == '' || Email == undefined || Email == null || Email == 'undefined' || Email == 'null') {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, the Email Address field cannot be empty.' });
    }

    if (Response.status !== 200) {
      res.status(400).json(Response);
      return;
    }

    try {
      // Check if the Email actually exists...
      const EmailModel = new LoginModel();
      const FpassToken = new TokenModel();
      const User = await EmailModel.checkEmail(Email);

      if (!User) {
        Response.status = 400;
        Response.message.push({ email: 'Sorry, This Email Address could not be verified at our end.' });
        res.status(400).json(Response);
        return;
      }

      if (User.status == 0) {
        Response.status = 400;
        Response.message.push({ email: 'You have not Activated your Account yet. An activation address has been sent to your Email Address. Please, check your Email Address to continue.' });
        res.status(400).json(Response);
        return;
      }

      if (User.status == 2) {
        Response.status = 400;
        Response.message.push({ email: 'You violated our working terms and your account has been suspended. Please contact admin or support in order to continue.' });
        res.status(400).json(Response);
        return;
      }

      // Send a notification back to the user....
      const RandomString = super.generateRandomString(80);
      const Token = 'naijap_reg_' + CryptoJS.SHA256(RandomString);

      const MailPayload = {
        sender_name: 'Naijap',
        sender_email: 'juwavictor@gmail.com',
        receiver_name: User.lastName + ' ' + User.firstName,
        receiver_email: User.email,
        name: User.lastName + ' ' + User.firstName,
        subject: `Naijap Activation Link`,
        url: 'http://18.221.248.4:3000/api/forgot-password/' + User.email + '/' + Token,
        company_url: 'http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com',
        company_name: 'Naijap'
      }

      // Send Notification...
      const Notification = new ForgotPasswordNotification(MailPayload);
      // await Notification.sendMail();

      // Create Token..
      await FpassToken.create({ email: User.email, type: 'forgot-password', token: Token });
      Response.status = 200;
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
      })
      res.status(500).json(Response);
      return;

    }
  }

  /****************************************************************/
  /*******************      Validate Token  ***********************/
  /****************************************************************/
  async validateToken(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Email = req.params.email;
    const Token = req.params.token;

    // check if the email is valid or the Token is valid.
    if (Email == '' || Email == null || Email == undefined || Email == 'null' || Email == 'undefined') {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, the Email Address is required.' });
      res.status(400).json(Response);
      return;
    }

    if (Token == '' || Token == null || Token == undefined || Token == 'null' || Token == 'undefined') {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, the Token is required in order to continue.' });
      res.status(400).json(Response);
      return;
    }

    try {
      // check if the email exist...
      // Check if the Email actually exists...
      const EmailModel = new LoginModel();
      const User = await EmailModel.checkEmail(Email);

      if (!User) {
        Response.status = 400;
        Response.message.push({ email: 'Sorry, This Email Address could not be verified at our end.' });
        res.status(400).json(Response);
        return;
      }

      if (User.status == 0) {
        Response.status = 400;
        Response.message.push({ email: 'You have not Activated your Account yet. An activation address has been sent to your Email Address. Please, check your Email Address to continue.' });
        res.status(400).json(Response);
        return;
      }

      if (User.status == 2) {
        Response.status = 400;
        Response.message.push({ email: 'You violated our working terms and your account has been suspended. Please contact admin or support in order to continue.' });
        res.status(400).json(Response);
        return;
      }

      // check the token....
      let FpassToken = new TokenModel();
      let checkToken = await FpassToken.checkToken(Token);

      if (!checkToken) {
        Response.status = 400;
        Response.message.push({ email: 'Sorry, The Token passed in could not be validated. Please, try again later.' });
        res.status(400).json(Response);
        return;
      }

      // IDEA: Fix the token expiration later.....

      if (checkToken.email !== Email) {
        Response.status = 400;
        Response.message.push({ email: 'The Email Address could not be verified with this token.' });
        res.status(400).json(Response);
        return;
      }

      // since all went well, we can actually redirect the user back to the desired page now...
      res.redirect(`http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com/#/?action=password-reset&email=${Email}`);
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
  /*******************  Update Password  **************************/
  /****************************************************************/
  async changePassword(req, res) {
    const Response = { status: 200, message: [], data: [] };

    const Email = req.params.email;
    const Password = req.body.password;

    // check if the email is valid or the Token is valid.
    if (Email == '' || Email == null || Email == undefined || Email == 'null' || Email == 'undefined') {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, the Email Address is required.' });
      res.status(400).json(Response);
      return;
    }

    if (Password == '' || Password == null || Password == undefined || Password == 'null' || Password == 'undefined') {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, the Token is required in order to continue.' });
      res.status(400).json(Response);
      return;
    }

    if (Password.length < 7) {
      Response.status = 400;
      Response.message.push({ email: 'Please, use a stronger password.' });
      res.status(400).json(Response);
      return;
    }

    try {
      // Check if the Email actually exists...
      const EmailModel = new LoginModel();
      const User = await EmailModel.checkEmail(Email);

      if (!User) {
        Response.status = 400;
        Response.message.push({ email: 'Sorry, This Email Address could not be verified at our end.' });
        res.status(400).json(Response);
        return;
      }

      if (User.status == 0) {
        Response.status = 400;
        Response.message.push({ email: 'You have not Activated your Account yet. An activation address has been sent to your Email Address. Please, check your Email Address to continue.' });
        res.status(400).json(Response);
        return;
      }

      if (User.status == 2) {
        Response.status = 400;
        Response.message.push({ email: 'You violated our working terms and your account has been suspended. Please contact admin or support in order to continue.' });
        res.status(400).json(Response);
        return;
      }

      // Update the user password....
      let user = new UserModel();
      User.password = CryptoJS.AES.encrypt(Password, 'kshjfiofiuens-djsdjhdh-secret-password').toString();
      const UpdatedUser = await user.updateUserAccount(User);

      // log in the user...
      // const UserToken = User.token;
      // const Payload = {
      //   id: User._id,
      //   email: User.email,
      //   token: UserToken,
      //   userAgent: _.toLower(req.body.userAgent)
      // };

      // const Login = new LoginModel();
      // await Login.login(Payload);

      if (!UpdatedUser || UpdatedUser == undefined || UpdatedUser == null) {
        Response.status = 204;
        res.status(204).json(Response);
        return;
      }

      Response.status = 200;
      Response.data.push(_.omit(UpdatedUser, ['_id']));
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
}

const ForgotPassword = new ForgotPasswordController();
module.exports = ForgotPassword;
