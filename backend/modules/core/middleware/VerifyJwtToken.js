const Jwt = require('jsonwebtoken');

const Middleware = require('./Middleware');
const Model = require('../model/Model');
const AdminLoginModel = require('../model/AdminLoginModel');
/****************************************************************/
/******* @author Ilori Stephen A ********************************/
/******* @desc Controller Base Class : Povides resuable *********/
/******* Methods for woking with our Middleware Class ***********/
/****************************************************************/

class VerifyJwtToken extends Middleware {
  constructor() {
    super();
  }

  /*****************************************************************/
  /******************* verifies a JWT Token  ***********************/
  /****************************************************************/
  async verify(req, res, next) {

    const Response = { status: 200, message: [] };
    const TokenModel = new Model();
    const Token = req.headers['naijap-x-token'];
    const userAgent = req.headers['naijap-client'];
    const Payload = { token: Token, userAgent: userAgent };

    try {

      /****************************************************************/
      /*******   Checks the user agent     ****************************/
      /****************************************************************/
      if (userAgent === 'web' && Token !== '') {
        let dbToken = await TokenModel.getWebToken(Payload);
        if (dbToken !== null && dbToken !== undefined && dbToken !== '') {
          dbToken = dbToken.token.web.token.filter((el) => {
            if (el.jwt == Token) return true;
          });

          /****************************************************************/
          /*******    Verify the JWT token     ****************************/
          /****************************************************************/
          dbToken = dbToken.shift();
          Jwt.verify(Token, 'kshjfiofiuens-naijap-djsdjhdh-secret-' + dbToken.connId, (e, decoded) => {
            Response.message.push({ error: 'Sorry This token is expired and your request could not be completed.' });
            Response.status = 401;
            if (e) {
              res.status(401).json(Response)
              return;
            }

            // ## Allow the next request
            next();
          });
        }

        /****************************************************************/
        /*******        Fail all requests    ****************************/
        /****************************************************************/
        if (dbToken == null || dbToken == undefined || dbToken == '') {
          /****************************************************************/
          /*******        Fail all requests    ****************************/
          /****************************************************************/
          Response.message.push({ error: 'Please, this token could not be verified.' });
          Response.status = 400;
          res.status(400).json(Response);
          return;
        }
      }

      /****************************************************************/
      /*******    Check The User Agent     ****************************/
      /****************************************************************/
      if (userAgent === 'mobile' && Token !== '') {
        let dbToken = await TokenModel.getMobileToken(Payload);
        if (dbToken !== null && dbToken !== undefined && dbToken !== '') {
          dbToken = dbToken.token.mobile.token.filter((el) => {
            if (el.jwt == Token) return true;
          });

          /****************************************************************/
          /*******     Verify the JWT token    ****************************/
          /****************************************************************/
          dbToken = dbToken.shift();
          let decodedToken = await Jwt.verify(Token, 'kshjfiofiuens-naijap-djsdjhdh-secret-' + dbToken.connId, (e, decoded) => {
            Response.message.push({ error: 'Sorry This token is expired and your request could not be completed.' });
            if (e) {
              res.status(401).json(Response);
            }

          });

          // !## Send the next request...
          next();
        }

        if (dbToken == null || dbToken == undefined || dbToken == '') {
          /****************************************************************/
          /*******        Fail all requests    ****************************/
          /****************************************************************/
          Response.message.push({ error: 'Please, this token could not be verified.' });
          Response.status = 400;
          res.status(400).json(Response);
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
      });
      res.status(500).json(Response);
      return;
    }

  }

  /****************************************************************/
  /*******    Verifies an Admin JWT Token     *********************/
  /****************************************************************/
  async verifyAdminToken(req, res, next) {
    const Response = { status: 200, message: [] };
    const TokenModel = new AdminLoginModel();
    const Token = req.headers['naijap-x-token'];
    const userAgent = req.headers['naijap-client'];
    const Payload = { token: Token };

    try {
      /****************************************************************/
      /*******   Checks the user agent     ****************************/
      /****************************************************************/
      if (userAgent == 'web' && Token !== '') {
        let dbToken = await TokenModel.fetchToken(Payload);
        if (dbToken !== null && dbToken !== undefined && dbToken !== '') {
          /****************************************************************/
          /*******    Verify the JWT token     ****************************/
          /****************************************************************/
          Jwt.verify(Token, 'kshjfiofiuens-naijap-djsdjhdh-secret-' + dbToken.connectionId, (e, decoded) => {
            Response.message.push({ error: 'Sorry This token is expired and your request could not be completed.' });
            Response.status = 401;
            if (e) {
              res.status(401).json(Response)
              return;
            }

            //## Allow the next request
            next();
          });
        }

        if (dbToken == null || dbToken == undefined || dbToken == '') {
          /****************************************************************/
          /*******        Fail all requests    ****************************/
          /****************************************************************/
          Response.message.push({ error: 'Please, this token could not be verified.' });
          Response.status = 400;
          res.status(400).json(Response);
          return;
        }
      }

      if (userAgent !== 'web' || Token == '') {
        Response.status = 500;
        Response.message.push({ credentials: 'Sorry, This Request Could Not Be Validated.' });
        res.status(500).json(Response);
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
}

module.exports = new VerifyJwtToken();
