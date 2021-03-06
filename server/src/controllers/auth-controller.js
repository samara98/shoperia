const { validationResult } = require('express-validator');
const expressAsyncHandler = require('express-async-handler');
const createHttpError = require('http-errors');

const User = require('../models/user');
const { signPayload } = require('../utils/jwt-helper');

const createSendToken = (user, statusCode, req, res) => {
  const token = signPayload({
    sub: user._id,
    email: user.email,
    iss: 'shoperia',
    aud: 'shoperia-user',
  });

  res.cookie('_SID_', token, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  const userJSON = user.toJSON();

  // Remove password from output
  delete userJSON.password;

  res.status(statusCode);
  return res.json({
    data: {
      token,
      user: userJSON,
    },
    meta: {
      status: res.statusCode,
    },
  });
};

class AuthController {
  static register = expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createHttpError(422, { errors: errors.array() });
    }
    const { name, email, username, password } = req.body;

    // find users first
    const users = await User.find({ $or: [{ email }, { username }] });

    if (users.length !== 0) {
      const fields = [];
      users.map((user) => {
        if (user.email === email) {
          fields.push('Email');
        }
        if (user.username === username) {
          fields.push('Username');
        }
      });
      const message = `${fields.join(' and ')} ${fields.length > 1 ? 'have' : 'has'} been used`;
      throw createHttpError(409, message);
    }

    // create new user
    const newUser = new User({ name, email, username, password });
    await newUser.save();

    return createSendToken(newUser, 201, req, res);
  });

  static login = expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createHttpError(422, { errors: errors.array() });
    }
    const { user_session, password } = req.body;

    // find user
    const user = await User.findOne({
      $or: [{ email: user_session }, { username: user_session }],
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw createHttpError(401, 'Incorrect email or password');
    }

    return createSendToken(user, 200, req, res);
  });

  static logout = expressAsyncHandler(async (req, res) => {
    res.clearCookie('_SID_', {
      sameSite: 'lax',
    });
    res.status(204);
    return res.json({});
  });
}

module.exports = AuthController;
