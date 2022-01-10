import _ from "lodash"
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/




import Controller from "./Controller"
import StateModel from "../model/StateModel"
import CountryModel from "../model/CountryModel"
import ContinentModel from "../model/ContinentModel"


class StateController extends Controller {
  constructor() {
    super();
  }

  /****************************************************************/
  /******* Creates A New Country Resource *************************/
  /****************************************************************/
  async createState(req, res) {
    let {countrySlug, name, status} = req.body;
    const Response = { status: 200, message: [], data: [] };

    const State = new StateModel();
    const Country = new CountryModel();

    if (countrySlug === undefined || countrySlug == '') {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, But the country slug is required.' });
    }

    if (name === undefined || name == '') {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, But the name field is required' });
    }

    if (!name.match( /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, Only Alphabets are allowed' });
    }

    if (typeof status === undefined || typeof status !== "boolean") {
      status = true;
    }

    try {
      /****************************************************************/
      /*******     Check if country and state exist     ***************/
      /****************************************************************/
      const checkCountry = await Country.findCountryBySlug(countrySlug);
      const checkState = await State.findByCountrySlugAndName(countrySlug, name);

      if (!checkCountry) {
        Response.status = 400;
        Response.message.push({ country: 'Sorry, A country with this name could not be found in our records.' });
      }

      if (checkState) {
        Response.status = 409;
        Response.message.push({ state: 'Sorry, A state with this name already exist.' });
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /*******             Create State                ****************/
      /****************************************************************/
      name = _.escape(name);
      name = _.trim(name);
      name = _.upperFirst(name);
      let slug = _.kebabCase(name);
      const Payload = { countrySlug, name, slug, status };

      let newState = await State.create(Payload);
      newState[0].humanTime = newState[0]._id.getTimestamp();
      Response.status = 201;
      Response.data.push(newState[0]);
      res.status(201).json(newState);
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
  /******* Fetches A Single State *********************************/
  /****************************************************************/
  async fetchStates(req, res) {
    const { countrySlug } = req.params;

    const Response = { status: 200, message: [], data: [] };
    const State = new StateModel();

    try {
      let states = await State.findStatesByCountrySlug(countrySlug);
      if (states.length < 1) {
        Response.status = 204;
        Response.message.push({ countrySlug: 'Failed to fetch states under this country.' });
        res.status(204).json(Response);
        return;
      }

      states = super.removeDocumentID(states, _.omit);
      Response.status = 200;

      Response.data.push(states);
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

  async allStates(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const State = new StateModel();

    try {
      let states = await State.fetchStates();
      if (states.length < 1) {
        Response.status = 204;
        Response.message.push({ states: 'Failed to fetch states.' });
        res.status(204).json(Response);
        return;
      }

      for (let i = 0; i < states.length; i++) {
        states[i].humanTime = states[i]._id.getTimestamp();
      }
      Response.status = 200;
      Response.data.push(states);
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

  async updateState(req, res) {
    let {id, countrySlug, name, status} = req.body;
    const Response = { status: 200, message: [], data: [] };

    const User = new UserModel();
    const State = new StateModel();
    const Country = new CountryModel();

    if (countrySlug === undefined || countrySlug == '') {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, But the country slug is required.' });
    }

    if (name === undefined || name == '') {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, But the name field is required' });
    }

    if (!name.match( /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, Only Alphabets are allowed' });
    }

    if (typeof status === undefined || typeof status !== "boolean") {
      status = true;
    }

    try {
      /****************************************************************/
      /*******     Check if country and state exist     ***************/
      /****************************************************************/
      const checkCountry = await Country.findCountryBySlug(countrySlug);
      const checkState = await State.findByCountrySlugAndName(countrySlug, name);

      if (!checkCountry) {
        Response.status = 400;
        Response.message.push({ country: 'Sorry, A country with this name could not be found in our records.' });
      }

      if (checkState) {
        Response.status = 409;
        Response.message.push({ state: 'Sorry, A state with this name already exist.' });
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /*******             Create State                ****************/
      /****************************************************************/
      name = _.escape(name);
      name = _.trim(name);
      name = _.upperFirst(name);
      let slug = _.kebabCase(name);
      const Payload = { id: id, countrySlug: countrySlug, name: name, slug: slug, status: status };

      let newState = await State.update(Payload);

      newState.humanTime = newState._id.getTimestamp();
      console.log(checkState);
      console.log(newState);
      await User.updateUserState({
        state: newState.name,
        updated: name
      });

      newState.name = name;
      newState.slug = slug;
      newState.status = status;

      Response.status = 200;
      Response.data.push(newState);
      res.status(200).json(newState);
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

  async updateStateStatus(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const User = new UserModel();
      const State = new StateModel();

      let id = req.params.id;
      let status = req.params.status;
      let stateStatus = await State.updateStateStatusField({ id, status });
      console.log(stateStatus);

      if (status == true || status == 'true') {
        await User.updateUserStateAndStatus({
          country: stateStatus.name,
          status: 1,
          updated: stateStatus.name
        });
      } else {
        await User.updateUserStateAndStatus({
          country: stateStatus.name,
          status: 0,
          updated: stateStatus.name
        });
      }

      if (stateStatus) {
        Response.status = 200;
        Response.data.push({ state: 'Successfully Updated This State Status.' });

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ continent: 'Sorry, An Unexpected Error Occurred And The Selected State Could Not Be Updated.' });

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
      })
      res.status(500).json(Response);
      return;
    }
  }

  async deleteState(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let slug = req.params.slug;
      const User = new UserModel();
      const State = new StateModel();

      let deletedState = await State.deleteState(slug);
      await User.updateUserStateAndStatus({ state: deletedState.name, updated: '' });

      if (deletedState) {
        Response.status = 200;
        Response.data.push({ state: 'Successfully Deleted All States And Updated All User\'s Accounts Under This State.' });

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ country: 'Sorry, An Unexpected Error Occurred And The Selected State Could Not Be Deleted.' });

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
      })
      res.status(500).json(Response);
      return;
    }
  }
}

const State = new StateController();
module.exports = State;
