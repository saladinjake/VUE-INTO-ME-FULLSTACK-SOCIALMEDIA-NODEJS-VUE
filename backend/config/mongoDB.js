//require('dotenv').config(__dirname + '../.env');
import dotenv from "dotenv"
dotenv.config(__dirname + '../.env');
/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* \@desc sets env variable for mongo variables ***********/
/****************************************************************/
if (process.env.APP_ENV !== 'dev') {
  const Url = process.env.MONGO_DB_PRODUCTION;
  const Db = process.env.MONGO_DB_NAME;
  /*******************************************/
  /** EXPORTS THE CREATED MONGO CONNECTION **/
  /*****************************************/
  module.exports.mongoDbUrl = Url;
  module.exports.mongoDatabase = Db;
} else {
  const Url = process.env.MONGO_DB_URL;
  const Db = process.env.MONGO_DB_NAME;
  /*******************************************/
  /** EXPORTS THE CREATED MONGO CONNECTION **/
  /*****************************************/
  module.exports.mongoDbUrl = Url;
  module.exports.mongoDatabase = Db;
}
