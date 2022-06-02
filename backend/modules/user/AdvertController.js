const _ = require('lodash');
const Axios = require('axios');
/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../core/controllers/Controller');
const UserModel = require('../core/model/UserModel');
const AdvertModel = require('../core/model/AdvertModel');
const SettingsModel = require('../core/model/SettingModel');
const TransactionsModel = require('../core/model/TransactionsModel');

class AdvertController extends Controller {
  async createAdvert(req, res) {
    const Advert = new AdvertModel();
    const Transactions = new TransactionsModel();

    const Response = { status: 200, message: [], data: [] };
    try {
      let { businessName, title, country, state, age, websiteUrl, description, amount } = req.body;

      const User = await super.validateHeaders(req, UserModel, _);
      if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });

          await Advert.deleteAdvert(req.params.id);
          res.status(401).json(Response);
          return;
      }

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

        await Advert.deleteAdvert(req.params.id);
        return;
      }

      // Check If The tranxRef Exists...
      let advertExist = await Advert.checkAdvert(req.params.tranxRef);
      let originalAmount = await Transactions.checkTransaction({ reference: req.params.tranxRef });

      if (advertExist) {
        Response.status = 409;
        Response.message.push({ advert: 'Sorry, An Advert With This Reference Already Exists.' });

        await Advert.deleteAdvert(req.params.id);
        res.status(409).json(Response);
        return;
      }

      // create the advert...
      const Payload = {
        age,
        userId: User._id.toString(),
        tranxRef: req.params.tranxRef,
        amount: originalAmount.amount,
        websiteUrl,
        businessName,
        title,
        country,
        state,
        description,
        status: false
      }

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

      await Advert.deleteAdvert(req.params.id);
      res.status(500).json(Response);
      return;
    }
  }

  async updateAdvert(req, res) {
    const Advert = new AdvertModel();
    const Transactions = new TransactionsModel();

    const Response = { status: 200, message: [], data: [] };
    try {
      let { businessName, title, country, state, age, websiteUrl, description } = req.body;

      const User = await super.validateHeaders(req, UserModel, _);
      if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });

          res.status(401).json(Response);
          return;
      }

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
        age,
        userId: User._id.toString(),
        websiteUrl,
        businessName,
        title,
        country,
        state,
        description,
      }

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

      await Advert.deleteAdvert(req.params.id);
      res.status(500).json(Response);
      return;
    }
  }

  async fetchAdverts(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Advert = new AdvertModel();
      const User = await super.validateHeaders(req, UserModel, _);

      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });

        res.status(401).json(Response);
        return;
      }

      let advertsList = await Advert.fetchActiveAdverts();
      let validAds = [];
      // Show The Adverts...
      if (advertsList.length > 0) {
        for (let i = 0; i < advertsList.length; i++) {
          // get birth year...
          let birthYear = User.birthDay;
          birthYear = birthYear.split(' ');
          birthYear = parseInt(birthYear[2]);

          let currentYear = new Date().getFullYear() - birthYear;
          let advertYear = advertsList[i].age.split('-');

          if (User.country == advertsList[i].country) {
            if (User.state == advertsList[i].state) {
              if (currentYear >= parseInt(advertYear[0]) && currentYear <= parseInt(advertYear[1])) {
                validAds.push(advertsList[i]);
              }
            }
          }

          if (User.country == advertsList[i].country) {
            if (User.state == 'All States') {
              if (currentYear >= advertYear[0] && currentYear <= advertYear[0]) {
                validAds.push(advertsList[i]);
              }
            }
          }

          if (advertsList[i].country == 'All Countries') {
            if (currentYear >= advertYear[0] && currentYear <= advertYear[0]) {
              validAds.push(advertsList[i]);
            }
          }

        }

        if (validAds.length > 0) {
          // Sort Out The Ads in the validAds by amount...
          validAds.sort((a, b) => {
            if (parseInt(a.amount) < parseInt(b.amount)) {
              return 1;
            }

            if (parseInt(a.amount) > parseInt(b.amount)) {
              return -1;
            }

            return 0;
          });

          // Prepare The Payload...
          Response.status = 200;
          Response.data.push(validAds);

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

  async chargeAdvert(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      // get the type of interaction...
      const Advert = new AdvertModel();
      const Setting = new SettingsModel();
      let click = await Setting.fetchSetting('click');
      let views = await Setting.fetchSetting('views');

      // Cost To Take...
      click = parseInt(click.value) || 0;
      views = parseInt(views.value) || 0;

      // User Interaction...
      let userInteraction = req.params.type;
      let advertId = req.params.id;

      // get the advert...
      let advert = await Advert.fetchAdvert(advertId);
      if (parseInt(advert.amount) < 1) {
        // delete the advert...
        await Advert.deleteAdvert(advertId);

        console.log('Waiting...')
        res.status(204).json({});
        return;
      }

      if (userInteraction == 'view') {
        // since the amount is still valid... we do some math...
        let newAmount = parseInt(advert.amount) - views;
        if (newAmount < 1 || newAmount == 0) {
          await Advert.deleteAdvert(advertId);
          res.status(204).json({});
          return;
        }

        // since there is still a lot of value left, update the advert...
        await Advert.updateAdvert(advertId, { amount: newAmount });
        res.status(200).json([]);
        return;
      }

      if (userInteraction == 'click') {
        // since the amount is still valid... we do some math...
        let newAmount = parseInt(advert.amount) - click;
        if (newAmount < 1 || newAmount == 0) {
          await Advert.deleteAdvert(advertId);
          res.status(204).json({});
          return;
        }

        // since there is still a lot of value left, update the advert...
        await Advert.updateAdvert(advertId, { amount: newAmount });
        res.status(200).json([]);
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

  async fetchUserAdvert(req, res) {
      const Response = { status: 200, message: [], data: [] };
      try {
        const Advert = new AdvertModel();
        const User = await super.validateHeaders(req, UserModel, _);

        if (!User) {
          Response.status = 401;
          Response.message.push({ user: 'A user with this token could not be found and verified.' });

          res.status(401).json(Response);
          return;
        }

        let adverts = await Advert.fetchUserAdverts(User._id.toString());
        if (adverts) {
          Response.status = 200;
          Response.message.push({ advert: 'Successfully fetched ' + adverts.length + ' records.' });
          Response.data.push(adverts);

          res.status(200).json(Response);
          return;
        }

        Response.status = 204;
        Response.message.push({ advert: 'Failed To Fecth Advert' });
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

module.exports = new AdvertController();
