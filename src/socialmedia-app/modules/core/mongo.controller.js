import { AuthController } from '../auth/controllers/auth.controller';
import { GuestController  } from '../auth/controllers/guest.controller';

/****************************************************************/
/******* @author vICTOR jUWA  ********************************/
/******* @desc Controller Base Class : Povides resuable *********/
/******* Methods for woking with our controller *****************/
/****************************************************************/


export  class BaseController{
  constructor() {
    this.currentController = null;
  }
  intercept(request,response){
    if(request.headers['x-access-token'] &&  request.headers['app-client']){
      return true;
    }
    return false;
  }
  dispatchAction(controller,method){
    if(typeof controller == "object" && controller.hasOwnProperty(method)){
      if (typeof controller[method] == 'function') {
         return controller[method]();
      }
      return throw(new Error("Exception error for method call"));
    }
      return throw(new Error("Exception error for method call"));
  }
  eventHandler(){}

  redirectTo(request,response){
    return this;
  }
  redirectWith(request,response, to="/"){
     return response.redirect(307, to);
  }

  jsonResponse(response, status, data){
    return response.status(status).json({data});
  }

}







export default {
  AuthMapper: {
    AuthController,
  },
  GuestMapper: {
    GuestController,
  },

  AdminControllers:{
    CoreMapper : {

    },
    ComponentMapper: {
      UserMapper:{

      }
    }
  }
}
