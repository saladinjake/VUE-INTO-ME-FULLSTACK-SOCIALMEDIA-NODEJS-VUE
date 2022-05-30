/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* @desc IP whitelist and CORS config *********************/
/****************************************************************/

const AllowedDevUrl = [
  'http://localhost', 
  'http://localhost:8080', 
  'http://127.0.0.1',
  'http://127.0.0.1:8080' 
];

const AllowedStagingUrl = [
  //netlify heroku etc 
  'https://sociallitetester-app.heroku.com', 
];
const AllowedProductionUrl =[
 'http://127.0.0.1:8080' 
];
const Whitelist = [...AllowedDevUrl,...AllowedStagingUrl,...AllowedProductionUrl];
const CorsOption = function (req, callback) {
  let corsOptions;
  if (Whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }

  callback(null, corsOptions)
}

/****************************************************************/
/******* EXPORTS THE CORS CONFIG FOR EXPRESS ********************/
/****************************************************************/

module.exports = CorsOption;
