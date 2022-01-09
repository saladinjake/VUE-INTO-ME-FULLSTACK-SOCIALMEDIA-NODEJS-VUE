//require('dotenv').config(__dirname + '../.env');
import dotenv from "dotenv"
dotenv.config(__dirname + '../.env');
const Nodemailer = require('nodemailer');

/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* @desc creates a transport for the ***********************/
/****************************************************************/
if (process.env.APP_ENV !== 'dev') {
    let Transport = Nodemailer.createTransport({
		host: "email-smtp.eu-west-2.amazonaws.com", // Amazon email SMTP hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: "AKIAZ2XYQVVDTFMV5THD", // Use from Amazon Credentials
            pass: "BHGddoMp/wacpbJ61akvLGyWqDA/6Cs5PC43YM2/tveV" // Use from Amazon Credentials
        }
	});

    /*******************************************/
    /** EXPORTS THE CREATED MAIL CONFIGS ******/
    /*****************************************/
    module.exports = Transport;

} else {
	  let Transport = Nodemailer.createTransport({
  		host: process.env.MAIL_HOST,
  		port: process.env.MAIL_PORT,
  		auth: {
  		  user: process.env.MAIL_AUTH_USER,
  		  pass: process.env.MAIL_AUTH_PASS
  		}
	  });

  /*******************************************/
  /** EXPORTS THE CREATED MAIL CONFIGS ******/
  /*****************************************/
  module.exports = Transport;
}
