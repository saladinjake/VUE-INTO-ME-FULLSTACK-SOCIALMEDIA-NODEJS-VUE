import _ from "lodash"
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/

import Axios from "./Controller"
import Controller from "./Controller"
import StateModel from "../model/StateModel"
import CountryModel from "../model/CountryModel"
import ContinentModel from "../model/ContinentModel"
import UserModel from "../model/UserModel"

class CountryController extends Controller {
  constructor() {
    super();
  }

  /****************************************************************/
  /******* Creates A New Country Resource *************************/
  /****************************************************************/
  async createCountry(req, res) {
    const Country = new CountryModel();
    const Continent = new ContinentModel();

    const Response = { status: 200, message: [], data: [] }
    let { continentSlug, name, status } = req.body;

    if (continentSlug === undefined || continentSlug == '') {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, But the continent slug is required.' });
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
      /*******     Check if continent and country exist ***************/
      /****************************************************************/
      const checkContinent = await Continent.findBySlug(continentSlug);
      const checkCountry = await Country.findByContinentSlugAndName(continentSlug, name);

      if (!checkContinent) {
        Response.status = 409;
        Response.message.push({ continent: 'Sorry, A continent with this name could not be found in our records.' });
      }

      if (checkCountry) {
        Response.status = 409;
        Response.message.push({ country: 'Sorry, A country under this continent already exist.' });
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /*******             Create County               ****************/
      /****************************************************************/
      name = _.escape(name);
      name = _.trim(name);
      name = _.upperFirst(name);

      let slug = _.kebabCase(name);
      const Payload = { continentSlug, name, slug, status };
      let newCountry = await Country.create(Payload);
      newCountry[0].humanTime = newCountry[0]._id.getTimestamp();

      Response.status = 201;
      Response.data.push(newCountry[0]);
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
  /******* Fetches All Country  ***********************************/
  /****************************************************************/
  async fetchAllCountry(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Country = new CountryModel();
    try {
      let countries = await Country.fetchApproved();
      if (countries.length > 0) {
        for (let i = 0; i < countries.length; i++) {
          countries[i].humanTime = countries[i]._id.getTimestamp();
        }
        Response.data = countries
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

  async fetchApprovedCountries(req, res) {
    const Response = { status: 200, message: [], data: [] };
    const Country = new CountryModel();
    try {
      let countries = await Country.fetchApproved();
      if (countries) {
        Response.status == 200;
        Response.data.push(countries);

        res.status(200).json(Response);
        return;
      }

      Response.status = 204;
      res.status(204);
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

  async updateCountry(req, res) {
    const State = new StateModel();
    const Country = new CountryModel();
    const Continent = new ContinentModel();

    const Response = { status: 200, message: [], data: [] }
    let { id, continentSlug, name, status } = req.body;

    if (continentSlug === undefined || continentSlug == '') {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, But the continent slug is required.' });
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
      /*******     Check if continent and country exist ***************/
      /****************************************************************/
      const checkContinent = await Continent.findBySlug(continentSlug);
      const checkCountry = await Country.findByContinentSlugAndName(continentSlug, name);

      if (!checkContinent) {
        Response.status = 409;
        Response.message.push({ continent: 'Sorry, A continent with this name could not be found in our records.' });
      }

      if (checkCountry) {
        Response.status = 409;
        Response.message.push({ country: 'Sorry, A country under this continent already exist.' });
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /*******             Create County               ****************/
      /****************************************************************/
      name = _.escape(name);
      name = _.trim(name);
      name = _.upperFirst(name);

      let slug = _.kebabCase(name);
      const Payload = { id, continentSlug, name, slug, status };
      let newCountry = await Country.update(Payload);
      newCountry.humanTime = newCountry._id.getTimestamp();

      // update the states...........
      await State.updateCountrySlug({
        slug: checkCountry.slug,
        updated: newCountry.slug
      });

      Response.status = 200;
      Response.data.push(newCountry);
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

  async updateCountryStatus(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const State = new StateModel();
      const User = new UserModel();
      const Country = new CountryModel();

      let id = req.params.id;
      let status = req.params.status;
      let countryStatus = await Country.updateStatus({ id, status });

      console.log(countryStatus);
      if (status == true || status == 'true') {
        await User.updateUserCountryAndStatus({
          country: countryStatus.name,
          status: 1,
          updated: countryStatus.name
        });

        await State.updateStatus({
          status: true,
          countrySlug: countryStatus.countrySlug
        });
      } else {
        await User.updateUserCountryAndStatus({
          country: countryStatus.name,
          status: 0,
          updated: countryStatus.name
        });

        await State.updateStatus({
          status: false,
          countrySlug: countryStatus.countrySlug
        });
      }

      if (countryStatus) {
        Response.status = 200;
        Response.data.push({ country: 'Successfully Updated This Country Status.' });

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ country: 'Sorry, An Unexpected Error Occurred And The Selected Country Could Not Be Updated.' });

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

  async deleteCountry(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let slug = req.params.slug;
      const User = new UserModel();
      const State = new StateModel();
      const Country = new CountryModel();

      let deletedCountry = await Country.deleteCountry(slug);
      let states = await State.findStatesByCountrySlug(slug);

      // delete all the states under this country........
      if (states.length > 0) {
        for (let i = 0; i < states.length; i++) {
          await User.updateUserCountryAndStatus({ country: deletedCountry.name, updated: '', status: 0 });
          await User.updateUserStateAndStatus({ state: states[i].name, updated: '', status: 0 });
        }

        await State.deleteStateViaCountry(deletedCountry.name);
      }

      if (deletedCountry) {
        Response.status = 200;
        Response.data.push({ country: 'Successfully Deleted All States And Updated User\'s Accounts Under This Country.' });

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ country: 'Sorry, An Unexpected Error Occurred And The Selected Country Could Not Be Deleted.' });

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

  async createCountryViaApiRegion(req, res)
  {
    const Country = new CountryModel();
    const Response = { status: 200, message: [], data: [] }
    let { continentSlug, name, status } = req.body;

    try {
      const countryReq = await Axios.get('https://restcountries.herokuapp.com/api/v1/region/' + continentSlug);
      if (countryReq.status == 200)
      {
        for (let index = 0; index < countryReq.data.length; index++) {
          name = _.escape(countryReq.data[index].name.common);
          name = _.trim(name);
          name = _.upperFirst(name);
    
          let slug = _.kebabCase(name);
          if (continentSlug.includes(' '))
          {
            continentSlug = _.kebabCase(name);
          }

          const Payload = { continentSlug, name, slug, status };
          let newCountry = await Country.create(Payload);
        }

        Response.status = 201;
        res.status(201).json(Response);
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

  async createCountryViaApiSubRegion(req, res)
  {
    const Country = new CountryModel();
    const Response = { status: 200, message: [], data: [] }
    let { continentSlug, name, status } = req.body;

    try {
      const countryReq = await Axios.get('https://restcountries.herokuapp.com/api/v1/subregion/' + continentSlug);
      if (countryReq.status == 200)
      {
        for (let index = 0; index < countryReq.data.length; index++) {
          name = _.escape(countryReq.data[index].name.common);
          name = _.trim(name);
          name = _.upperFirst(name);
    
          let slug = _.kebabCase(name);
          if (continentSlug.includes(' '))
          {
            continentSlug = _.kebabCase(name);
          }

          const Payload = { continentSlug, name, slug, status };
          let newCountry = await Country.create(Payload);
        }

        Response.status = 201;
        res.status(201).json(Response);
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

const Country = new CountryController();
module.exports = Country;
