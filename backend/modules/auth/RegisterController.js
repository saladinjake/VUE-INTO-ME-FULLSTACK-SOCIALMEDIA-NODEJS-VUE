const _ = require('lodash');
const CryptoJS = require("crypto-js");
const Validator = require('validator');

/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');
const TokenModel = require('../core/model/TokenModel');
const UserModel = require('../core/model/RegisterModel');
const RegistrationNotification = require('../../helpers/notification/RegistrationNotification');

class UserController extends Controller {
  constructor() {
    super();
  }

  /****************************************************************/
  /******* Creates A New User Resource ****************************/
  /****************************************************************/
  async createUser(req, res) {
    let { firstName, lastName, email, phone, stageName, password, birthDay, gender, userType, country, state, userAgent } = req.body;
    const Response = { status: 200, message: [], data: [] };
    const User = new UserModel();

    if (firstName === undefined || firstName === "" || firstName === null) {
      Response.status = 400;
      Response.message.push({ firstName: 'Sorry, But the first name field is required.' });
    }

    if (!firstName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ firstName: 'Sorry, Only Alphabets are allowed.' });
    }

    if (lastName === undefined || lastName == "") {
      Response.status = 400;
      Response.message.push({ lastName: 'Sorry, But the last name field is required.' });
    }

    if (!lastName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ lastName: 'Sorry, Only Alphabets are allowed.' });
    }

    if (email === undefined || email == '') {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, The Email field is required.' });
    }

    if (!Validator.isEmail(email)) {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, Please, use a valid email address.' });
    }

    if (stageName === undefined || stageName == '') {
      Response.status = 400;
      Response.message.push({ stageName: 'Sorry, The stageName field cannot be empty.' });
    }

    if (password.length <= 6) {
      Response.status = 400;
      Response.message.push({ password: 'Sorry, Please, use a stronger password.' });
    }

    if (birthDay === undefined || birthDay == '') {
      Response.status = 400;
      Response.message.push({ bitrhDay: 'Sorry, The birthDay field is required.' });
    }

    if (!Validator.isBefore(birthDay, global.Date())) {
      Response.status = 400;
      Response.message.push({ bitrhDay: 'Sorry, Please, use a valid Birth Date.' });
    }

    if (gender === undefined || gender == '') {
      Response.status = 400;
      Response.message.push({ gender: 'Sorry, The gender field is required.' });
    }

    if (!gender.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ gender: 'Sorry, Only Alphabets are allowed.' });
    }

    if (userType === undefined || userType == '') {
      Response.status = 400;
      Response.message.push({ userType: 'Sorry, The userType field is required.' });
    }

    if (!userType.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ userType: 'Sorry, Only Alphabets are allowed.' });
    }

    if (country === undefined || country == '') {
      Response.status = 400;
      Response.message.push({ country: 'Sorry, The country field is required.' });
    }

    if (!country.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ country: 'Sorry, Only Alphabets are allowed.' });
    }

    if (state === undefined || state == '') {
      Response.status = 400;
      Response.message.push({ state: 'Sorry, The state field is required.' });
    }

    if (!state.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ state: 'Sorry, Only Alphabets are allowed.' });
    }

    if (userAgent === undefined || userAgent == '') {
      Response.status = 400;
      Response.message.push({ userAgent: 'Sorry, The userAgent field is required.' });
    }

    if (!userAgent.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ userAgent: 'Sorry, Only Alphabets are allowed in the format web || mobile.' });
    }

    try {
      const checkEmail = await User.checkUserByEmail(email);
      // const checkPhone = await User.checkUserByPhone(phone) || '';
      const checkStageName = await User.checkUserByStageName(stageName);

      if (checkEmail) {
        Response.status = 409;
        Response.message.push({ email: 'Sorry, A user with this email already exist.' });
      }

      if (checkStageName) {
        Response.status = 409;
        Response.message.push({ stageName: 'Sorry, A user with this stageName already exist.' });
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      const Payload = {};
      Payload.firstName = _.trim(firstName);
      Payload.firstName = _.escape(firstName);
      Payload.firstName = _.upperFirst(firstName);

      Payload.lastName = _.trim(lastName);
      Payload.lastName = _.escape(lastName);
      Payload.lastName = _.upperFirst(lastName);

      Payload.email = email;
      Payload.phone = '';
      Payload.stageName = _.escape(stageName);

      Payload.avatar = '';

      Payload.gender = _.escape(gender);
      Payload.gender = _.upperFirst(gender);

      Payload.birthDay = _.escape(birthDay);

      Payload.userType = _.escape(userType);
      Payload.userType = _.upperFirst(userType);

      Payload.country = _.escape(country);
      Payload.country = _.upperFirst(country);
      Payload.country = _.upperFirst(country);
      Payload.presence = 'offline';
      Payload.lastSeen = global.Date();

      Payload.state = _.escape(state);
      Payload.state = _.upperFirst(state);
      Payload.state = _.upperFirst(state);

      Payload.userAgent = _.escape(userAgent);
      Payload.userAgent = _.toLower(userAgent);

      Payload.facebook = '';
      Payload.twitter = '';
      Payload.instagram = '';
      Payload.youtube = '';

      Payload.password = CryptoJS.AES.encrypt(password, 'kshjfiofiuens-djsdjhdh-secret-password').toString();

      const RandomString = super.generateRandomString(80);
      const RegistrationToken = 'naijap_reg_' + CryptoJS.SHA256(RandomString);

      let newUser = await User.create(Payload);
          newUser = _.omit(newUser[0], ['_id', 'token']);

      const MailPayload = {
        sender_name: 'FairyDiary',
        sender_email: 'juwavictor@gmail.com',
        receiver_name: lastName + ' ' + firstName,
        receiver_email: email,
        subject: `Congratulations ${lastName} ${firstName} On Creating An Account With Naijap`,
        name: lastName + ' ' + firstName,
        url: 'http://localhost:3000/api/activate-user-account/' + email + '/' + RegistrationToken, //'http://localhost:3000/api/activate-user-account/' + email + "/" + RegistrationToken,
        company_url: 'http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com', 
        company_name: 'FairyDiary'
      }

      const Mail = new RegistrationNotification(MailPayload);
      await Mail.send();

      const MailToken = new TokenModel();
      await MailToken.create({ email: email, type: 'registration', token: RegistrationToken });

      Response.status = 201;
      Response.data.push(newUser);
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

  /****************************************************************/
  /******* Resends The Activation Token ***************************/
  /****************************************************************/
  async resendToken(req, res) {

    const User = new UserModel();
    const Response = { status: 200, message: [], data: [] };
    const email = req.params.email;

    if (!Validator.isEmail(email)) {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, Please, use a valid email address.' });
      res.status(400).json(Response);
      return;
    }

    try {
      /****************************************************************/
      /******* Checks If A User Exist And Sends A Token ***************/
      /****************************************************************/
      let user = await User.checkUserByEmail(email);
      if (!user) {
        Response.status = 400;
        Response.message.push({ email: 'Sorry, This email address does not exist in our records.' });
        res.status(400).json(Response);
        return;
      }

      if (user.status === 1 || user.status == 1) {
        Response.status = 400;
        Response.message.push({ email: 'Sorry, The operation was not successful with this Email Address' });
        res.status(400).json(Response);
        return;
      }

      if (user) {
        const RandomString = super.generateRandomString(80);
        const RegistrationToken = 'naijap_reg_' + CryptoJS.SHA256(RandomString);

        const MailPayload = {
          sender_name: 'FairyDiary',
          sender_email: 'juwavictor@gmail.com',
          receiver_name: user.lastName + ' ' + user.firstName,
          receiver_email: user.email,
          name: user.lastName + ' ' + user.firstName,
          subject: `FairyDiary Activation Link`,
          url: 'http://localhost:3000/api/activate-user-account/' + user.email + '/' + RegistrationToken, //'http://localhost:3000/api/activate-user-account/' + email + "/" + RegistrationToken,
          company_url: 'http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com', //'https://naijap.pixietech.net', //'http://127.0.0.1:8080',
          company_name: 'FairyDiary'
        }

        const Mail = new RegistrationNotification(MailPayload);
        // await Mail.resendActivationLink();

        const MailToken = new TokenModel();
        await MailToken.update({ email: user.email, type: 'registration', token: RegistrationToken });

        user = _.omit(user, ['_id', 'token']);
        Response.status = 205;
        Response.data.push(user);
        res.status(205).json(Response);
        return;
      }
    } catch (e) {
      console.log(e);
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
  /******* Activate The User Account ******************************/
  /****************************************************************/
  async activateAccount(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const {  email, token } = req.params;

    const Token = new TokenModel();
    const User = new UserModel();

    if (!Validator.isEmail(email)) {
      Response.status = 400;
      Response.message.push({ email: 'Sorry, Please, use a valid email address.' });
    }

    if (token == undefined || token == '') {
      Response.status = 400;
      Response.message.push({ token: 'Sorry, The Token field cannot be empty.' });
    }

    try {
      /****************************************************************/
      /******* Check If The Email Exists ******************************/
      /****************************************************************/
      const checkEmail = await User.checkUserByEmail(email);
      const checkToken = await Token.checkToken(token);

      if (!checkEmail) {
        Response.status = 400;
        Response.message.push({ email: 'Sorry, This email does not exist in our records.' });

        res.status(400).json(Response);
        return;
      }

      if (!checkToken) {
        Response.status = 400;
        Response.message.push({ token: 'Sorry, This token is not valid.' });

        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /******* Validate Token Time ************************************/
      /****************************************************************/
      let currentTime = global.Date();
      let tokenTime = checkToken._id.getTimestamp().toString();

      // BUG: This would always validate...!Looking to fix this soon.
      if (Validator.isAfter(tokenTime, currentTime)) {
        const RandomString = super.generateRandomString(80);
        const RegistrationToken = 'naijap_reg_' + CryptoJS.SHA256(RandomString);

        const MailPayload = {
          sender_name: 'FairyDiary',
          sender_email: 'juwavictor@gmail.com',
          receiver_name: checkEmail.lastName + ' ' + checkEmail.firstName,
          receiver_email: checkEmail.email,
          name: checkEmail.lastName + ' ' + checkEmail.firstName,
          subject: `FairyDiary Activation Link`,
          url: 'http://localhost:3000/api/activate-user-account/' + checkEmail.email + '/' + RegistrationToken, //'http://localhost:3000/api/activate-user-account/' + email + "/" + RegistrationToken,
          company_url: 'http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com', //'https://naijap.pixietech.net', //'http://127.0.0.1:8080',
          company_name: 'FairyDiary'
        }

        const Mail = new RegistrationNotification(MailPayload);
        await Mail.resendActivationLink();

        const MailToken = new TokenModel();
        await MailToken.update({ email: checkEmail.email, type: 'registration', token: RegistrationToken });

        Response.status = 200;
        Response.message.push({ token: 'Sorry, The Activation Link has expired. A new Activation link has been sent to you Email Address.' });
        res.status(200).json(Response);
        return;
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      let updatedUser = await User.updateUserStatus({ email: checkEmail.email });
      if (updatedUser) {
        updatedUser = _.omit(updatedUser, ['_id']);

        Response.status = 205;
        Response.data.push(updatedUser);

        const ClientResource = Buffer.from(JSON.stringify(updatedUser)).toString('base64');
        res.redirect(`http://127.0.0.1:8080/token/${ClientResource}`);
        // res.redirect('http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com/#/?token=' + ClientResource)
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
}

const User = new UserController();
module.exports = User;
