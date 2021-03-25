i
/** Class that allows user create and login  */
class AuthService {
  /**
   * @description Create a new user
   * @param {object} a new user object
   */
  static async createUser(user) {
  }

  /**
   * @description signs user into their account
   * @param {object} a new user object
   */

  static async login(request, response) {

  }

  /**
   * @description Create a new staff
   * @param {object} a new user object
   */
  static async createAStaff(user) {
  }



  static logOut(request,response){
  }
  static async confirmationPost(request,response){
  }

  static async resendTokenPost(request,response){
  }
  static async passwordForgot(request,response){
  }

  static confirmResetPassword(request,response){
  }

  static  async changePasswordTrigger(request,response){
  }
}

export default AuthService;
