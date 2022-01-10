
import Validator from "validator"
import _ from "lodash"
import Controller from "./Controller"
import SettingModel from "../model/SettingModel"
class SettingsController extends Controller {
  constructor() {
    super();
  }

  /****************************************************************/
  /******************  Create Settings  ***************************/
  /****************************************************************/
  async createSettings(req, res) {
    const Response = { status: 200, message: [], data: [] };
    let { key, value, status } = req.body;

    if (typeof key === undefined || key === '') {
      Response.status = 400;
      Response.message.push({ key: 'The key field is required.' });
    }

    if (typeof value === undefined || value === '') {
      Response.status = 400;
      Response.message.push({ value: 'The value field is required.' });
    }

    if (typeof status !== "boolean") {
      Response.status = 400;
      Response.message.push({ status: 'The status field must be a boolean.' });
    }

    if (Response.status === 400) {
      res.status(400).json(Response);
    }

    try {
      const SettingsModel = new SettingModel();
      const Payload = {
        key: _.escape(key),
        value: _.escape(value),
        status: status
      }
      const SettingPromise = await SettingsModel.createSettings(Payload);
      res.status(201).json(SettingPromise);
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

  async fetchPaystackConfig(req, res) {
    const Response = { status: 200, message: [], data: [] };
    try {
      const Setting = new SettingModel();
      let publicKeyPaystack = await Setting.fetchSetting('paystack_public_key');
      let scretKeyPaystack = await Setting.fetchSetting('paystack_secret_key');

      Response.status = 200;
      Response.data.push({ paystackPublicKey: publicKeyPaystack.value || '', paystackSecretKey: scretKeyPaystack.value || '' });

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

const Settings = new SettingsController();

module.exports = Settings;
