const _ = require('lodash');
const Jwt = require('jsonwebtoken');

const CryptoJS = require("crypto-js");
const Validator = require('validator');

const Controller = require('../Controller');
const UserModel = require('../../model/UserModel');
const PostModel = require('../../model/PostModel');
const RegisterModel = require('../../model/RegisterModel');

class UsersController extends Controller {
    constructor() { super() }

    async fetchUserStats(req, res) {
      let allUsers = 0;
      let activeUsers = 0;
      let pendingUsers = 0;
      let suspendedUsers = 0;

      try {
        let User = new UserModel();
        let Payload = { status: 200, message: [], data: [] };
        // Fetch Records....
        allUsers = await User.fetchAllUsersStats() || 0;
        activeUsers = await User.fetchUserStats(1) || 0;
        pendingUsers = await User.fetchUserStats(0) || 0;
        suspendedUsers = await User.fetchUserStats(2) || 0;
        // Prepare response...
        Payload.message = 'Successfully fetched all records...';
        Payload.data[0] = { allUsers, activeUsers, pendingUsers, suspendedUsers };

        res.status(200).json(Payload);
        return;
      } catch (e) {
        let Response = { status: 500, message: [] };
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

    async fetchLastFiveAccounts(req, res) {
      const Response = { status: 200, message: [], data: [] };

      try {
        let User = new UserModel();
        let users = await User.fetchLastUsers(10);
        if (users) {
          for (let i = 0; i < users.length; i++) {
            users[i].humanTimeStamp = users[i]._id.getTimestamp();
          }
          Response.status = 200;
          Response.message = 'Successfully fetched ' + users.length + ' user records.';
          Response.data.push(users);

          res.status(200).json(Response);
          return;
        }

        Response.status = 204;
        Response.message = 'No Records To Fetch.';

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

    async fetchAccountsViaStatus(req, res) {
      const Response = { status: 200, message: [], data: [] };
      try {
        let User = new UserModel();
        let users = [];
        switch(req.params.type) {
          case 'default':
            users = await User.fetchAllUsers();
          break;
          case 'active':
            users = await User.fetchUserViaStatus(1);
          break;
          case 'pending':
            users = await User.fetchUserViaStatus(0);
          break;
          case 'suspended':
            users = await User.fetchUserViaStatus(2);
          break;
          default:
            users = [];
          break;
        }

        if (users.length > 0) {
          for (let i = 0; i < users.length; i++) {
            users[i].timeStamp = users[i]._id.getTimestamp();
          }

          Response.status = 200;
          Response.message = 'Fetched ' + users.length + ' records Successfully.';
          Response.data.push(users);

          res.status(200).json(Response);
          return;
        }

        Response.status = 204;
        Response.message = 'Failed To Fetch Records...';
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

    async fetchUserProfile(req, res) {
      const Response = { status: 200, message: [], data: [] };
      try {
        let User = new UserModel();
        let userProfile = await User.fetchUserProfile(req.params.email);

        if (userProfile) {
          Response.status = 200;
          Response.message = 'Success';
          Response.data.push(userProfile);

          res.status(200).json(Response);
          return;
        }

        if (!userProfile) {
          Response.status = 204;
          Response.message.push({ user: 'Failed To Fetch User Profile' });

          res.status(204).json(Response);
          return;
        }
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

    async fetchUserPosts(req, res) {
      const Response = { status: 200, message: [], data: [] };
      try {
        let Post = new PostModel();
        let posts = await Post.fetchUserPosts(req.params.userId);

        if (posts) {
          Response.status = 200;
          Response.data.push(posts);

          res.status(200).json(Response);
          return;
        }

        if (!posts) {
          Response.status = 204;
          Response.message = 'Failed to fetch user posts.';

          res.status(204).json(Response);
          return;
        }
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

    async updateUserDetails(req, res) {
      const Response = { status: 200, message: [], data: [] };

      const { key, value } = req.body;
      let userModel = new UserModel();
      let User = await userModel.findUserById(req.params.userId);

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

        if (value !== User.email) {
          const checkEmail = await userModel.fetchUserProfile(value);
          if(checkEmail) {
            Response.status = 409;
            Response.message.push({ Email: 'Sorry, A user with this email already exist.' });
          }
        }
      }

      if (key == 'website') {
        if (value === undefined || value == '') {
          Response.status = 400;
          Response.message.push({ Website: 'Sorry, The website field is required.' });
        }
      }

      if (key == 'stageName') {
        if (value === undefined || value == '') {
          Response.status = 400;
          Response.message.push({ Email: 'Sorry, The Stage Name field is required.' });
        }

        if (value != User.stageName) {
          const checkStageName = await userModel.findUserByStageName(value);
          if(checkStageName) {
            Response.status = 409;
            Response.message.push({ Email: 'Sorry, A user with this Stage Name already exist.' });
          }
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
        if (key == 'social') {
          let { facebook, twitter, instagram } = value;
          let payload = { facebook, twitter, instagram };

          console.log(facebook, twitter, instagram);

          let updatedFacebook = await userModel.updateUserByFields({ key: 'facebook', value: facebook }, User._id);
          let updatedTwitter = await userModel.updateUserByFields({ key: 'twitter', value: twitter }, User._id);
          let updatedInstagram = await userModel.updateUserByFields({ key: 'instagram', value: instagram }, User._id);

          if (updatedFacebook && updatedTwitter && updatedInstagram) {
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

    async updateUserStatus(req, res) {
      const Response = { status: 200, message: [], data: [] };
      try {
        const User = new UserModel();
        let status = req.params.status;
        let userId = req.params.userId;
        // update the user field...

        let updatedUserField = await User.updateUserStatus(userId, status);
        if (updatedUserField) {
          Response.status = 200;
          Response.data.push(updatedUserField);

          res.status(200).json(Response);
          return;
        }

        Response.status = 400;
        Response.message = 'Failed To Update The User Status. Please, try again later.';

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

    async createUser(req, res) {
      let { firstName, lastName, email, phone, stageName, password, birthDay, gender, userType, country, state, profession, website, education, skills, address, maritalStatus, userAgent, facebook, twitter, instagram } = req.body;
      const Response = { status: 200, message: [], data: [] };
      const User = new UserModel();
      const RegisterM = new RegisterModel();

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

      try {
        const checkEmail = await User.fetchUserProfile(email);
        // const checkPhone = await User.checkUserByPhone(phone) || '';
        const checkStageName = await User.findUserByStageName(stageName);

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
        Payload.phone = phone;
        Payload.stageName = _.escape(stageName);

        Payload.avatar = '';

        Payload.gender = _.escape(gender);
        Payload.gender = _.upperFirst(gender);

        Payload.birthDay = _.escape(birthDay);

        Payload.userType = 'User';

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

        Payload.profession = profession;
        Payload.website = website;

        Payload.education = education;
        Payload.skills = skills;

        Payload.address = address;

        Payload.maritalStatus = maritalStatus;
        Payload.userAgent = 'web';

        Payload.facebook = facebook;
        Payload.twitter = twitter;
        Payload.instagram = instagram;
        Payload.youtube = '';

        Payload.password = CryptoJS.AES.encrypt(password, 'kshjfiofiuens-djsdjhdh-secret-password').toString();

        const RandomString = super.generateRandomString(80);
        const RegistrationToken = 'naijap_reg_' + CryptoJS.SHA256(RandomString);

        let newUser = await RegisterM.create(Payload);
            newUser = _.omit(newUser[0], ['_id', 'token']);

        // const MailPayload = {
        //   sender_name: 'Naijap',
        //   sender_email: 'stephenilori458@gmail.com',
        //   receiver_name: lastName + ' ' + firstName,
        //   receiver_email: email,
        //   subject: `Congratulations ${lastName} ${firstName} On Creating An Account With Naijap`,
        //   name: lastName + ' ' + firstName,
        //   url: 'http://18.221.248.4:3000/api/activate-user-account/' + email + '/' + RegistrationToken, //'http://localhost:3000/api/activate-user-account/' + email + "/" + RegistrationToken,
        //   company_url: 'http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com', //'https://naijap.pixietech.net', //'http://127.0.0.1:8080',
        //   company_name: 'Naijap'
        // }

        // const Mail = new RegistrationNotification(MailPayload);
        // await Mail.send();

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

    async changePassword(req, res) {
      const User = new UserModel();
      const Response = { status: 200, message: [], data: [] };

      let emailAddress = req.params.email;
      let password = req.body.password;
      try {
        // check if the user exists....
        let checkUser = await User.fetchUserProfile(emailAddress);
        if (!checkUser) {
          Response.status = 400;
          Response.data.push({ user: 'Sorry, A User Could Not Be Associated With This Email Address.' });

          res.status(400).json(Response);
          return;
        }

        // update the user profile.....
        let updatedUserPassword = await User.updateUserAccount({ email: emailAddress, password: CryptoJS.AES.encrypt(password, 'kshjfiofiuens-djsdjhdh-secret-password').toString() });

        if (updatedUserPassword) {
          Response.status = 200;
          Response.data.push(updatedUserPassword);

          res.status(200).json(Response);
          return;
        }

        Response.status = 400;
        Response.data.push({ user: 'An Unexpected Error Occurred And Your Password Could Not Be Changed.' });
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

module.exports = new UsersController();
