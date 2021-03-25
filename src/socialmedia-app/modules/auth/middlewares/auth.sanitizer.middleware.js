//import Database from '../models/db';
// import User from '../models/mongo/core/user';
const validNameRegex = /^[A-Za-z]{3,30}$/;
const user_typeRegex = /^[a-zA-Z]'?([a-zA-Z]|\.| |-){3,}$/;
const usernameRegex = /^[A-Za-z0-9]{3,20}$/;
const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /^[A-Za-z0-9]{6,}$/;
const phoneNumberRegex = /^(\+?234|0)?[789]\d{9}$/;
const lastnameRegex=/^[A-Za-z\d_-]+$/;

const handleError = (response, message, code = 422) =>
  response.status(code).json({
    status: code,
    error: message,
});

export class AuthSanitizer {

  static checkIfUserDoesntExists(request, response, next) {
     return next();
  }

  static checkIfUserExists(request, response, next) {
     return next();
  }

  static checkIfUserIsBanned(request, response, next) {
    return next();
  }


  static validateSignUp(request, response, next) {

    return next();
  }

  static validateLogin(request, response, next) {
    return next();
  }
}
