import _ from "lodash"

/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/

import Controller from "./Controller"
import UserTypeModel from "../model/UserTypeModel"



class UserTypeController extends Controller {
  constructor() {
    super();
  }
  /****************************************************************/
  /******* Creates A New User Type Resource ***********************/
  /****************************************************************/
  async createUserType(req, res) {
    let { name } = req.body;
    const Response = { status: 200, message: [], data: [] };
    const UserType = new UserTypeModel();

    if (name === undefined || name == '') {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, But the name field is required' });
    }

    if (!name.match( /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, Only Alphabets are allowed' });
    }

    try {
      /****************************************************************/
      /*******     Check if user type name already exist **************/
      /****************************************************************/
      const checkUserType = await UserType.fetchByName(name);
      if (checkUserType) {
        Response.status = 409;
        Response.message.push({ name: 'Sorry, this user type already exist.' });
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      name = _.trim(name);
      name = _.escape(name);
      name = _.upperFirst(name);
      let slug = _.kebabCase(name);

      /****************************************************************/
      /*******          Create a new user type           **************/
      /****************************************************************/

      const Payload = { name, slug };
      let newUserType = await UserType.create(Payload);
      newUserType = _.omit(newUserType[0], ['_id']);

      Response.data.push(newUserType);
      Response.status = 201;
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
      })
      res.status(500).json(Response);
      return;
    }
  }

  /****************************************************************/
  /*******   Returns All User Type Resource ***********************/
  /****************************************************************/
  async fetchAllUserType(req, res) {
    const UserType = new UserTypeModel();
    const Response = { status: 200, message: [], data: [] };
    try {
      let userTypes = await UserType.fetchAll();
      if (userTypes.length < 1) {
        Response.status = 204;
        Response.message.push({ name: 'Sorry, there are no entries for any user type in our records' });
        res.status(204).json(Response);
        return;
      }

      userTypes = super.removeDocumentID(userTypes, _.omit);
      Response.status = 200;
      Response.data.push(userTypes);
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
}

const UserType = new UserTypeController();
module.exports = UserType;
