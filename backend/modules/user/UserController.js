const _ = require('lodash');
const Validator = require('validator');

/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');
const UserModel = require('../core/model/UserModel');

class UserController extends Controller {
  constructor() { super() }

  /****************************************************************/
  /*******       Fetch User Details       *************************/
  /****************************************************************/
  async getUserDetails(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const User = await super.validateHeaders(req, UserModel, _);
    if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });
        res.status(401).json(Response);
        return;
    }

    try {
      let userModel = new UserModel();
      let user = null;

      // #! Check the uder id if it's set....
      if (req.params.userId == 0) {
        user = User;
      } else {
        user = await userModel.findUserById(req.params.userId);
      }

      if (!user) {
        Response.status = 400;
        Response.message.push({ user: 'Sorry, an unexpected error occurred and a user with this credentials could not be retrieved. Please, try again later.' });

        res.status(400).json(Response);
        return;
      }

      Response.status = 200;
      Response.data.push(user);

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
  /*******    Update User Details         *************************/
  /****************************************************************/
  async updateUserDetails(req, res) {
    const User = await super.validateHeaders(req, UserModel, _);
    const Response = { status: 200, message: [], data: [] };

    const { key, value } = req.body;
    let userModel = new UserModel();

    if (!User) {
      Response.status = 401;
      Response.message.push({ user: 'A user with this token could not be found and verified.' });
      res.status(401).json(Response);
      return;
    }

    if (key == 'firstName') {
      if (value === undefined || value === "" || value === null) {
        Response.status = 400;
        Response.message.push({ firstName: 'Sorry, But the first name field is required.' });
      }

      if (!value.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        Response.status = 400;
        Response.message.push({ firstName: 'Sorry, Only Alphabets are allowed.' });
      }
    }

    if (key == 'lastName') {
      if (value === undefined || value == "") {
        Response.status = 400;
        Response.message.push({ lastName: 'Sorry, But the last name field is required.' });
      }

      if (!value.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        Response.status = 400;
        Response.message.push({ lastName: 'Sorry, Only Alphabets are allowed.' });
      }
    }

    if (key == 'profession') {
      if (value === undefined || value == "") {
        Response.status = 400;
        Response.message.push({ Profession: 'Sorry, But the profession field is required.' });
      }

      if (!value.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        Response.status = 400;
        Response.message.push({ Profession: 'Sorry, Only Alphabets are allowed.' });
      }
    }

    if (key == 'skills') {
      if (value === undefined || value == "") {
        Response.status = 400;
        Response.message.push({ Skills: 'Sorry, But the skills field is required.' });
      }
    }

    if (key == 'address') {
      if (value === undefined || value == "") {
        Response.status = 400;
        Response.message.push({ Address: 'Sorry, But the address field is required.' });
      }
    }

    if (key == 'country') {
      if (value === undefined || value == "") {
        Response.status = 400;
        Response.message.push({ Country: 'Sorry, But the country field is required.' });
      }

      if (!value.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        Response.status = 400;
        Response.message.push({ Country: 'Sorry, Only Alphabets are allowed.' });
      }
    }

    if (key == 'phone') {
      if (value === undefined || value == "") {
        Response.status = 400;
        Response.message.push({ Phone: 'Sorry, But the Phone field is required.' });
      }
    }

    if (key == 'email') {
      if (value === undefined || value == '') {
        Response.status = 400;
        Response.message.push({ Email: 'Sorry, The Email field is required.' });
      }

      if (!Validator.isEmail(value)) {
        Response.status = 400;
        Response.message.push({ Email: 'Sorry, Please, use a valid email address.' });
      }

      const checkEmail = await User.checkUserByEmail(value);
      if(checkEmail) {
        Response.status = 409;
        Response.message.push({ Email: 'Sorry, A user with this email already exist.' });
      }
    }

    if (key == 'website') {
      if (value === undefined || value == '') {
        Response.status = 400;
        Response.message.push({ Website: 'Sorry, The website field is required.' });
      }
    }

    if (key == 'gender') {
      if (value === undefined || value == '') {
        Response.status = 400;
        Response.message.push({ Gender: 'Sorry, The Gender field is required.' });
      }

      if (!value.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        Response.status = 400;
        Response.message.push({ Gender: 'Sorry, Only Alphabets are allowed.' });
      }
    }

    if (key == 'birthDay') {
      if (value === undefined || value == '') {
        Response.status = 400;
        Response.message.push({ BirthDay: 'Sorry, The Birth Day field is required.' });
      }

      if (!Validator.isBefore(value, global.Date())) {
        Response.status = 400;
        Response.message.push({ BirthDay: 'Sorry, Please, use a valid Birth Date.' });
      }
    }

    if (key == 'maritalStatus') {
      if (value === undefined || value == '') {
        Response.status = 400;
        Response.message.push({ MaritalStatus: 'Sorry, The MaritalStatus field is required.' });
      }

      if (!value.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        Response.status = 400;
        Response.message.push({ MaritalStatus: 'Sorry, Only Alphabets are allowed.' });
      }
    }

    if (key == 'education') {
      if (value === undefined || value == '') {
        Response.status = 400;
        Response.message.push({ Education: 'Sorry, The Education field is required.' });
      }
    }

    if (Response.status !== 200) {
      res.status(400).json(Response);
      return;
    }

    try {
      // To be updated seperately.....
      // if (key == 'email') {
      //
      // }

      // To be updated seperately.....
      if (key == 'social') {
        let { facebook, twitter, instagram, youtube } = value;
        let payload = { facebook, twitter, instagram, youtube };

        let updatedFacebook = await userModel.updateUserByFields({ key: 'facebook', value: facebook }, User._id);
        let updatedTwitter = await userModel.updateUserByFields({ key: 'twitter', value: twitter }, User._id);
        let updatedInstagram = await userModel.updateUserByFields({ key: 'instagram', value: instagram }, User._id);
        let updatedYoutube = await userModel.updateUserByFields({ key: 'youtube', value: youtube }, User._id);

        if (updatedFacebook && updatedTwitter && updatedInstagram && updatedYoutube) {
          Response.status = 200;
          Response.data.push({ success: `The social fields has been updated successfully.`, error: '' });

          res.status(200).json(Response);
          return;
        }
      }

      if (key != 'social') {
        const payload = { key, value };
        let updatedUser = await userModel.updateUserByFields(payload, User._id);

        if (updatedUser) {
          Response.status = 200;
          Response.data.push({ success: `The ${[payload.key]} field has been updated successfully.`, error: '' });

          res.status(200).json(Response);
          return;
        }
      }

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
}

const User = new UserController();
module.exports = User;
