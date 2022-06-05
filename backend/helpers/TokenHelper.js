import  UserModel from '../modules/core/model/UserModel';
/****************************************************************/
/************   Verify A JWT Token     **************************/
/****************************************************************/
class TokenHelper {
  constructor() {}
  /****************************************************************/
  /************   Get User ID From Token     **********************/
  /****************************************************************/
  async getUserIdFromToken(Payload) {
    const User = new UserModel();
    try {
      const UserID = await User.getUserByToken(Payload);
      if (UserID) {
        return UserID;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
module.exports = new TokenHelper();
