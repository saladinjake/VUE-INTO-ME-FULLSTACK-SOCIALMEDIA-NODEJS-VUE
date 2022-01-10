const _ = require('lodash');
const CryptoJS = require("crypto-js");
const Validator = require('validator');

/****************************************************************/
/************   Custom Module Imports      *********************/
/****************************************************************/
const Controller = require('../Controller');
const TokenModel = require('../../model/TokenModel');
const LoginModel = require('../../model/LoginModel');
const LoginNotification = require('../../notification/LoginNotification');

class LoginController extends Controller {
    constructor() {
        super();
    }

    /****************************************************************/
    /*******      Logs In A New User    *****************************/
    /****************************************************************/
    async login(req, res) {
        const Response = { status: 200, message: [], data: [] };
        const Login = new LoginModel();
        const { email, password, userAgent } = req.body;

        if (email === undefined || email == '') {
            Response.status = 400;
            Response.message.push({ email: 'Sorry, Please, use a valid email address.' });
        }

        if (!Validator.isEmail(email)) {
            Response.status = 400;
            Response.message.push({ email: 'Sorry, Please, use a valid email address.' });
        }

        if (password === undefined || password == '') {
            Response.status = 400;
            Response.message.push({ password: 'Sorry, The Password field is required.' });
        }

        try {
            /****************************************************************/
            /*******      Check If The Mail Exist    ************************/
            /****************************************************************/
            let user = await Login.checkEmail(email);
            if (!user || user === null || user == undefined) {
                Response.status = 204;
                Response.message.push({ email: 'Sorry, This Email Address does not exist in our records.' });

                res.status(400).json(Response);
                return;
            }

            /****************************************************************/
            /*******      Check The Account Status @pending  ****************/
            /****************************************************************/
            if (user.status == 0) {

                const RandomString = super.generateRandomString(80);
                const RegistrationToken = 'naijap_reg_' + CryptoJS.SHA256(RandomString);

                const MailPayload = {
                    sender_name: 'Naijap',
                    sender_email: 'stephenilori458@gmail.com',
                    receiver_name: user.lastName + ' ' + user.firstName,
                    receiver_email: user.email,
                    name: user.lastName + ' ' + user.firstName,
                    subject: `Naijap Activation Link`,
                    url: 'http://18.221.248.4:3000/api/activate-user-account/' + user.email + '/' + RegistrationToken, //'http://localhost:3000/api/activate-user-account/' + email + "/" + RegistrationToken,
                    company_url: 'http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com', //'https://naijap.pixietech.net', //'http://127.0.0.1:8080',
                    company_name: 'Naijap'
                }

                const Mail = new LoginNotification(MailPayload);
                await Mail.sendPendingActivationToken();

                const MailToken = new TokenModel();
                await MailToken.update({ email: user.email, type: 'registration', token: RegistrationToken });

                user = _.omit(user, ['_id', 'token']);
                Response.status = 205;
                Response.data.push(user);
                Response.message.push({ status: 'Sorry, Your account is not activated yet. Please, check your Email in order to continue.' });
                res.status(205).json(Response);
                return;
            }

            /****************************************************************/
            /*******      Check The Account Status @suspended  **************/
            /****************************************************************/
            if (user.status === 2 || user.status == 2) {
                const RandomString = super.generateRandomString(80);
                const RegistrationToken = 'naijap_reg_' + CryptoJS.SHA256(RandomString);

                const MailPayload = {
                    sender_name: 'Naijap',
                    sender_email: 'stephenilori458@gmail.com',
                    receiver_name: user.lastName + ' ' + user.firstName,
                    receiver_email: user.email,
                    name: user.lastName + ' ' + user.firstName,
                    subject: `Naijap Account Suspension`,
                    url: 'http://18.221.248.4:3000/api/activate-user-account/' + user.email + '/' + RegistrationToken, //'http://localhost:3000/api/activate-user-account/' + email + "/" + RegistrationToken,
                    company_url: 'http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com', //'https://naijap.pixietech.net', //'http://127.0.0.1:8080',
                    company_name: 'Naijap'
                }

                const Mail = new LoginNotification(MailPayload);
                await Mail.sendSuspendedActivationToken();

                Response.status = 204;
                Response.message.push({ status: 'Sorry, Your account is not activated yet. Please, check your Email in order to continue.' });

                res.status(204).json(Response);
                return;
            }

            if (Response.status !== 200) {
                res.status(400).json(Response);
                return;
            }

            /****************************************************************/
            /*******      Decode And Compare The Password    ****************/
            /****************************************************************/
            const HashedPassword = CryptoJS.AES.decrypt(user.password, 'kshjfiofiuens-djsdjhdh-secret-password').toString(CryptoJS.enc.Utf8);
            if (HashedPassword !== password) {
                Response.status = 400;
                Response.message.push({ error: 'Please, Check the Email Address And Password and try again.' });

                res.status(400).json(Response);
                return;
            }

            /****************************************************************/
            /*******      Create The Payload And Login The User   ***********/
            /****************************************************************/
            const UserToken = user.token;
            const Payload = {
                id: user._id,
                email: user.email,
                token: UserToken,
                userAgent: _.toLower(userAgent)
            };

            /****************************************************************/
            /********************      Login The User   *********************/
            /****************************************************************/
            const User = await Login.login(Payload);
            if (!User || User == undefined || User == null) {
                Response.status = 204;
                res.status(204).json(Response);
                return;
            }

            Response.status = 200;
            Response.data.push(_.omit(User, ['_id']));
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
            console.log(e);
            res.status(500).json(Response);
            return;
        }
    }
}

const Login = new LoginController();
module.exports = Login;
