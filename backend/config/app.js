//require('dotenv').config(__dirname + '../.env');
import dotenv from "dotenv"
dotenv.config(__dirname + '../.env');
/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* @desc Checks the app environment ***********************/
/****************************************************************/

 if (process.env.APP_ENV !== 'dev') {
     process.env.APP_PORT = process.env.APP_URL_PORT;
     process.env.APP_URL = process.env.APP_URL_PRODUCTION;
     process.env.APP_ENV = 'production';

     const AppConfig = {
        appName: process.env.APP_NAME,
        appUrl: process.env.APP_URL_PRODUCTION,
        appPort: process.env.APP_URL_PORT,
        appEnv: process.env.APP_ENV,
        videoSnapShotPath: process.env.VIDEO_SNAPSHOT_PATH_PRODUCTION
    };

    /*******************************************/
    /** EXPORTS THE APP CONFIGS ***************/
    /*****************************************/
    module.exports.appConfig = AppConfig;
 } else {
   const AppConfig = {
      appName: process.env.APP_NAME,
      appUrl: process.env.APP_URL,
      appPort: process.env.APP_PORT,
      appEnv: process.env.APP_ENV,
      videoSnapShotPath: process.env.VIDEO_SNAPSHOT_PATH_DEVELOPMENT
  };

  /*******************************************/
  /** EXPORTS THE APP CONFIGS ***************/
  /*****************************************/
  module.exports.appConfig = AppConfig;
 }

 /****************************************************************/
 /******* @author Ilori Stephen A ********************************/
 /******* @desc Generates some sane config ***********************/
 /****************************************************************/
