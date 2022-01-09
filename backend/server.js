/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* @desc Node Modules. ************************************/
/****************************************************************/
import Cors from "cors"
import Path from "path"
import Http from "http"
import Express from "express"
import SocketIo from "socket.io"
import BodyParser from "body-parser"
import ExpressFileUpload from "express-fileupload"
/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* @desc Custom Application Modules ***********************/
/****************************************************************/
import AppConfigurations from "./config/app"
import MongoConnector from "./mongo/Model"
// const CorsConfigurations = require('./config/cors');
/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* @desc Express js || cors Configurations ****************/
/****************************************************************/
const App = new Express();
const Server = Http.createServer(App);
const Io = SocketIo(Server);
const Dir = Path.join(__dirname, 'public');
/******* EXPRESS MIDDLEWARES ***/
// CorsConfigurations
App.use(Cors());
App.use(Express.static(Dir));
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());
/******* EXPRESS MIDDLEWARES ***/
/************* Database Connector ************/
module.exports.connector = (async () => {
  const Connection = await new MongoConnector()
  return Connection.dbConnector();
})();
/************* Database Connector ************/

/****************************************************************/
/******* @author saladin jake (Victor juwa) ********************************/
/******* @desc Express Routes ***********************************/
/****************************************************************/

Server.listen(AppConfigurations.appConfig.appPort, () => {
  console.log(AppConfigurations.appConfig.appName + ` api is running on ` + AppConfigurations.appConfig.appPort);
});
