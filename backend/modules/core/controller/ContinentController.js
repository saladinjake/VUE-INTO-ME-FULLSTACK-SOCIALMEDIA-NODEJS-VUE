// const _ = require('lodash');
import _ from "lodash"
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
import Controller from "./Controller"
import StateModel from "../model/StateModel"
import CountryModel from "../model/CountryModel"
import ContinentModel from "../model/ContinentModel"



class ContinentController extends Controller {
  constructor() {
    super();
  }

  /****************************************************************/
  /******* Creates A New Continent Resource ***********************/
  /****************************************************************/
  async createContinent(req, res) {
    let {name, status} = req.body;
    let Response = {  status: 200, message: [], data: [] };

    if (typeof name === undefined || name == "") {
      Response.status = 400;
      Response.message.push({ name: 'The continent name is required.' });
    }

    if (!name.match( /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
      Response.status = 400;
      Response.message.push({ name: 'Sorry, Only Alphabets are allowed.' });
    }

    if (typeof status === undefined || typeof status !== "boolean") {
      status = true;
    }


    try {

      /****************************************************************/
      /*******     Do some lodash magic       *************************/
      /****************************************************************/

      name = _.escape(name);
      name = _.trim(name);
      name = _.upperFirst(name);
      let slug = _.kebabCase(name);

      /****************************************************************/
      /*******     Check if continent exist     ***********************/
      /****************************************************************/
      const Continent = new ContinentModel();
      const checkContinent = await Continent.fetchOne(name);
      if (checkContinent) {
        Response.status = 409;
        Response.message.push({ name: 'Sorry, this continent already exists.' });
      }

      /****************************************************************/
      /*******     Send Back the error response ***********************/
      /****************************************************************/
      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /*******  Creates the continent resource  ***********************/
      /****************************************************************/
      const Payload = { name, slug, status };
      let newContinent = await Continent.create(Payload);
      newContinent[0].humanTime = newContinent[0]._id.getTimestamp();
      Response.status = 201;
      Response.data.push(newContinent[0]);
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
  /********* Fetches all Continent Resource ***********************/
  /****************************************************************/
  async fetchContinents(req, res) {
    const Response = { status: 200, message: [], data: [] };

    try {

      const Continent = new ContinentModel();
      const ContinentsCollections = await Continent.fetchAll();

      if (ContinentsCollections.length > 0) {
        for (let i = 0; i < ContinentsCollections.length; i++) {
          ContinentsCollections[i].humanTime = ContinentsCollections[i]._id.getTimestamp();
        }
        Response.data = ContinentsCollections;
        res.status(200).json(Response);
        return;
      }

      Response.status = 204;
      res.status(204).send(Response);
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
  /********* Updates a Continent Resource ***********************/
  /****************************************************************/
  async updateContinent(req, res) {
    let Response = {  status: 200, message: [], data: [] };
    try {
      let {id, name, status} = req.body;

      if (typeof name === undefined || name == "") {
        Response.status = 400;
        Response.message.push({ name: 'The continent name is required.' });
      }

      if (!name.match( /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
        Response.status = 400;
        Response.message.push({ name: 'Sorry, Only Alphabets are allowed.' });
      }

      if (typeof status === undefined || typeof status !== "boolean") {
        status = true;
      }

      /****************************************************************/
      /*******     Do some lodash magic       *************************/
      /****************************************************************/

      name = _.escape(name);
      name = _.trim(name);
      name = _.upperFirst(name);
      let slug = _.kebabCase(name);

      /****************************************************************/
      /*******     Check if continent exist     ***********************/
      /****************************************************************/
      const Country = new CountryModel();
      const Continent = new ContinentModel();
      const checkContinent = await Continent.fetchOne(name);
      if (checkContinent) {
        Response.status = 409;
        Response.message.push({ name: 'Sorry, this continent already exists.' });
      }

      /****************************************************************/
      /*******     Send Back the error response ***********************/
      /****************************************************************/
      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      /****************************************************************/
      /*******  Creates the continent resource  ***********************/
      /****************************************************************/
      const Payload = { id, name, slug, status };
      let newContinent = await Continent.update(Payload);
      await Country.updateContinent({ continentSlug: slug, slug: newContinent.slug });
      newContinent.humanTime = newContinent._id.getTimestamp();

      Response.status = 200;
      Response.data.push(newContinent);
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

  async deleteContinent(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let slug = req.params.slug;
      const Continent = new ContinentModel();
      const Country = new CountryModel();
      const State = new StateModel();

      let deletedContinent = await Continent.deleteContinent(slug);
      let countries = await Country.findByContinentSlug(slug);

      // delete all the states under this country........
      if (countries.length > 0) {
        for (let i = 0; i < countries.length; i++) {
          await State.deleteStateViaCountry({ slug: countries[i].slug });
        }

        for (let i = 0; i < countries.length; i++) {
          await Country.deleteCountryViaContinent(slug);
        }
      }

      if (deletedContinent) {
        Response.status = 200;
        Response.data.push({ continent: 'Successfully Deleted All States And Countries Under This Continent.' });

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ continent: 'Sorry, An Unexpected Error Occurred And The Selected Continent Could Not Be Deleted.' });

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

  async updateContinentStatus(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Continent = new ContinentModel();

      let id = req.params.id;
      let status = req.params.status;
      let continentStatus = await Continent.updateStatus({ id, status });

      console.log(continentStatus);
      if (continentStatus) {
        Response.status = 200;
        Response.data.push({ continent: 'Successfully Updated This Continent\'s Status.' });

        res.status(200).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ continent: 'Sorry, An Unexpected Error Occurred And The Selected Continent Could Not Be Updated.' });

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

const Continent = new ContinentController
module.exports = Continent;
