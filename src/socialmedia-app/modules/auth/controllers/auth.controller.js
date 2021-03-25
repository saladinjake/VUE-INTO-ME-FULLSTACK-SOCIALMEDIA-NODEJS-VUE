// import { TokenGenerator } from '../utils/tokengen.utils';
// import Response from '../../../utils/response.utils';
// const response = new Response();
import { BaseController } from '../../core/mongo.controller';
import AuthService from '../services/auth.service';

export default class AuthController extends BaseController{
  constructor(){
    super();
  }
  static async signup(req, res) {
  }
  static async login(req,res){
  }
  static async logOut(request,response){
  }
  static  async confirmationPost(request,response){
  }
  static async changePasswordTriggerMobile(request,response){
  }
  static async resendTokenPost(request,response){
  }
  static async passwordForgot(request,response){
  }
  static async resendTokenPost(request,response){
  }
  static async confirmResetPassword(request,response){
  }
  static async changePasswordTrigger(request,response){
  }

}
