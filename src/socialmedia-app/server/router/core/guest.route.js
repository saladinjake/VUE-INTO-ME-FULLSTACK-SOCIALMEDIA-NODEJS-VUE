import dotenv from 'dotenv';
dotenv.config();
import  Controllers  from '../../../modules/core/mongo.controller';
const  GuestController =  Controllers.GuestController;

const ABOUT_LINK = '/guest/about';
const HOME_LINK = '/guest/welcome';
const TERMS_LINK = '/guest/terms';
const ONLINE_LINK = '/guest/services';
const OFFERS_LINK = '/guest/privacy';


export class GuestRoutes {
  constructor(router) {
    this.router = router;
  }
  attachRoutes() {
    // api contents
    // this.router.get(HOME_LINK,GuestController.index);
    // this.router.get(OFFERS_LINK,GuestController.about);
    // this.router.get(ONLINE_LINK,GuestController.terms);

  }

}
