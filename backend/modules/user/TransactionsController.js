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

class TransactionsController extends Controller {
  constructor() { super() }

  async initializeTransactions(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Settings = new SettingsModel();

      // let paystackPublicKey = await Settings.fetchSetting('paystack_public_key');
      let paystackSecretKey = await Settings.fetchSetting('paystack_secret_key');

      // Validate the headers...
      const User = await super.validateHeaders(req, UserModel, _);
      if (!User) {
        Response.status = 401;
        Response.message.push({ user: 'A user with this token could not be found and verified.' });

        res.status(401).json(Response);
        return;
      }

      if (req.params.type == 'advert') {
        const PaystackPayload = {
          email: User.email,
          amount: parseFloat(req.body.price) * 100,
          metadata: { type: 'advert', email: User.email }
        }

        let axiosResponse = await Axios.post('https://api.paystack.co/transaction/initialize', PaystackPayload, {
          headers: {
            Authorization: 'Bearer ' + paystackSecretKey.value,
            'Cache-Control': 'no-cache'
          }
        });

        if (axiosResponse.status == 200) {
          Response.status = 200;
          Response.data.push(axiosResponse.data);

          res.status(200).json(Response);
          return;
        }

        Response.status = 400;
        Response.message.push({ paystack: 'Sorry, An Unknown Error Occurred And The Payment Vendor Could Not Be Reached.' });

        res.status(400).json(Response);
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
      })
      res.status(500).json(Response);
      return;
    }
  }

  async verifyTransaction(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Advert = new AdvertModel();
      const Settings = new SettingsModel();
      const Transactions = new TransactionsModel();
      const Reference = req.query.reference;

      // let paystackPublicKey = await Settings.fetchSetting('paystack_public_key');
      let paystackSecretKey = await Settings.fetchSetting('paystack_secret_key');
      // Verify the transaction....
      let verification = await Axios.get('https://api.paystack.co/transaction/verify/' + Reference, {
        headers: {
          Authorization: 'Bearer ' + paystackSecretKey.value
        }
      });

      if (verification.data.data.status == 'success') {
        // check what kind of transaction is it and check if the token or reference already exists...
        if (verification.data.data.metadata.type == 'advert') {
          // check for the customer field...
          let customerEmail = verification.data.data.metadata.email;
          let amount = parseFloat(verification.data.data.amount) / 100;

          // check if the transaction exists...
          let transactionExists = await Transactions.checkTransaction({
            reference: Reference
          });

          // Since the transaction does not exist, we createthe transaction...
          if (transactionExists) {
            res.redirect('http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com/#/home');
            return;
          }

          // create the transaction....
          let createTranx = await Transactions.createTransaction({
            reference: Reference,
            amount: amount,
            status: verification.data.data.status,
            email: customerEmail,
          });

          if (createTranx) {
            // since this was successfull, we can redirect back to the client with the transaction reference...
            // res.status(200).json(verification.data);
            res.redirect('http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com/#/home?tranx=' + Reference + '&amnt=' + amount);
            return;
          }

          res.redirect('http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com/#/home');
          return;
        }
      }

      res.redirect('http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com/#/home');
      return;
    } catch (e) {
      res.redirect('http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com/#/home');
      return;
      // Response.status = 500;
      // Response.message.push({
      //   server: {
      //     customMessage: `Sorry, an exception occurred and your request could not be completed. `,
      //     errorName: e.name,
      //     errorMessage: e.message
      //   }
      // })
      // res.status(500).json(Response);
      // return;
    }
  }

  async fetchTransactions(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Transaction = new TransactionsModel();
      let transactions = await Transaction.fetchTransactions();

      if (transactions) {
        for (let i = 0; i < transactions.length; i++) {
          transactions[i].humanTimestamp = transactions[i]._id.getTimestamp();
        }
        Response.status = 200;
        Response.data.push(transactions);

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
      })
      res.status(500).json(Response);
      return;
    }
  }
}


module.exports = new TransactionsController();
// http://18.221.248.4:3000/api/initialize-transactions
