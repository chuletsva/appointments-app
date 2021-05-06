import jwt from "jwt-simple";
import moment from "moment";

import ResponseError from "common/errors/responseError";

import users from "../data/users";

const secret = "1dsewr3";

class AuthController {
  login(login, password) {
    const user = users.find(
      (x) => x.login === login && x.password === password,
    );

    if (!user) {
      throw new ResponseError("Неверный логин или пароль");
    }

    const { id, firstName, middleName, lastName } = user;

    const expiresAt = moment().add(30, "minutes").toISOString();

    return {
      token: jwt.encode({ id, expiresAt }, secret),
      user: {
        firstName,
        middleName,
        lastName,
      },
    };
  }
}

export default new AuthController();