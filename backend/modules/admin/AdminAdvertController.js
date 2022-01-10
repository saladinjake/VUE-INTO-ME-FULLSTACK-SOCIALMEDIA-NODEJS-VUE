const _ = require('lodash');
const {ObjectId} = require('mongodb');
const Validator = require('validator');

/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../Controller');
const AdvertModel = require('../../model/AdvertModel');
const AdvertPackage = require('../../model/AdvertPackage');
const SettingModel = require('../../model/SettingModel');

class AdminAdvertController extends Controller {
  constructor() { super() }

  async initAdvert(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Advert = new AdvertModel();
      const advertInit = await Advert.createAdvert({  });

      if (advertInit) {
        Response.status = 201;
        Response.data.push(advertInit);

        res.status(201).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ init: 'An Unexpected Error Occurred And The Operation Could Not Be Completed.' });
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

  async createAdvert(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let { businessName, age, websiteUrl, title, country, state, description, amount } = req.body;
      if (title.length < 1) {
        Response.status = 400;
        Response.message.push({ title: 'Sorry, This Field Cannot Be Empty.' });
        return;
      }

      if (country.length < 1) {
        Response.status = 400;
        Response.message.push({ country: 'Sorry This Field Cannot Be Empty.' });
        return;
      }

      if (state.length < 1) {
        Response.status = 400;
        Response.message.push({ state: 'Sorry, This Field Cannot Be Empty.' });
        return;
      }

      if (description.length < 1) {
        Response.status = 400;
        Response.message.push({ description: 'Sorry, This Field Cannot Be Empty.' });
        return;
      }

      if (amount.length < 1) {
        Response.status = 400;
        Response.message.push({ amount: 'Sorry, This Field Cannot Be Empty.' });
        return;
      }

      if (businessName.length < 1) {
        Response.status = 400;
        Response.message.push({ businessName: 'Sorry, This Field Cannot Be Empty.' });
        return;
      }

      if (age.length < 1) {
        Response.status = 400;
        Response.message.push({ age: 'Sorry, This Field Cannot Be Empty.' });
        return;
      }

      if (websiteUrl.length < 1) {
        Response.status = 400;
        Response.message.push({ websiteUrl: 'Sorry, This Field Cannot Be Empty.' });
        return;
      }

      if (Response.status !== 200) {
        res.status(400).json(Response);
        return;
      }

      // create the advert...
      const Payload = {
        businessName,
        age,
        websiteUrl,
        title,
        country,
        state,
        description,
        amount: parseInt(amount),
        reference: super.generateRandomString(5),
        status: true
      }

      const Advert = new AdvertModel();
      let advert = await Advert.updateAdvert(req.params.id, Payload);

      if (advert) {
        Response.status = 201;
        Response.data.push(advert);

        res.status(201).json(Response);
        return;
      }

      Response.status = 400;
      Response.message.push({ advert: 'Sorry, An Unexpected Error Occurred And Your Operation Could Not Be Completed.' });
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

  async fetchAdvert(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Advert = new AdvertModel();
      if (req.params.status == 'active') {
        let adverts = await Advert.fetchActiveAdverts();
        if (adverts.length > 0) {
          Response.data.push(adverts);
          res.status(200).json(Response);
          return;
        }

        res.status(204).json({ });
        return;
      }

      if (req.params.status == 'pending') {
        let adverts = await Advert.fetchPendingAdverts();
        if (adverts.length > 0) {
          Response.data.push(adverts);
          res.status(200).json(Response);
          return;
        }

        res.status(204).json({ });
        return;
      }

      res.status(204).json({ });
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

  async advertAction(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      let status = false;
      req.params.status == 'active'
      ? status = true
      : status = false;
      const Advert = new AdvertModel();
      let advert = await Advert.updateAdvertStatus({
        _id: req.params.id,
        status: status
      });

      if (advert) {
        Response.status = 200;
        Response.data.push(advert);

        res.status(200).json(Response);
        return;
      }

      res.status(400).json({});
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

  async deleteAdvert(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Advert = new AdvertModel();
      let advert = await Advert.deleteAdvert(req.params.id);

      if (advert) {
        Response.status = 200;
        Response.data.push(advert);

        res.status(200).json(Response);
        return;
      }

      res.status(400).json({ });
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

  async createAdvertPackage(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Package = new AdvertPackage();
      let packageAdvert = await Package.createPackage(req.body);

      if (packageAdvert) {
        Response.status = 201;
        Response.data.push(packageAdvert);

        res.status(201).json(Response);
        return;
      }

      res.status(400).json({});
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

  async fetchPackage(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Package = new AdvertPackage();
      let packageAdvert = await Package.fetchPackages();

      if (packageAdvert) {
        Response.status = 200;
        Response.data.push(packageAdvert);

        res.status(200).json(Response);
        return;
      }

      res.status(204).json({});
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

  async deletePackage(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Package = new AdvertPackage();
      let packageAdvert = await Package.deletePackage(req.params.id);

      if (packageAdvert) {
        Response.status = 200;
        Response.data.push(packageAdvert);

        res.status(200).json(Response);
        return;
      }

      res.status(400).json({});
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

  async fetchAdSettings(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Setting = new SettingModel();
      let adClicks = await Setting.fetchSetting('click');
      let adViews = await Setting.fetchSetting('views');

      // Throw Back The Values...
      Response.status = 200;
      Response.data.push({ clicks: adClicks.value || 0, views: adViews.value || 0 });

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

module.exports = new AdminAdvertController();
