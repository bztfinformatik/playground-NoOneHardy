const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_INETERNAL_SERVER_ERROR,
  SEQ_DB_ERR,
  SEQ_UNIQUE_CONSTRAINT_ERR,
} = require("../util/const");

const { isEmpty } = require("../util/helper");
const User = require("../models/user");
const logger = require("../util/log");

const { SequelizeUniqueConstraintError } = require("sequelize");
const { loggers } = require("winston");
const { restart } = require("nodemon");

function toUserObj(resultSet) {
  let user = {};
  if (!isEmpty(resultSet)) {
    user = {
      id: resultSet.id,
      firstname: resultSet.firstname,
      lastname: resultSet.lastname,
      username: resultSet.username,
      avatar: resultSet.avatar,
    };
  }
  return user;
}

getUserByUsername = async (username) => {
  try {
    const resultSet = await User.findOne({
      where: { username: username },
    });
    res.status(HTTP_STATUS_OK).json(toGeoFeatureObj(resultSet));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const username = req.body.username;
  const pwd = req.body.pwd;

  try {
    let user = await User.findOne({
      where: { username: username },
    });

    if (!isEmpty(user) && pwd === user.pwd) {
      res.status(HTTP_STATUS_OK).json(user);
    } else {
      const err = new Error("Authentication failed.");
      err.statusCode = HTTP_STATUS_UNAUTHORIZED;
      throw err;
    }
  } catch (err) {
    if (err.statusCode != HTTP_STATUS_UNAUTHORIZED) {
      err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    }
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      pwd: req.body.pwd,
      avatar: req.body.avatar,
    });
    res.status(HTTP_STATUS_CREATED).json(user);
  } catch (err) {
    if (err.name === SEQ_UNIQUE_CONSTRAINT_ERR) {
      err.statusCode = HTTP_STATUS_CONFLICT;
      err.message = `User already exists.`;
    } else {
      err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_OK;
    let user = await User.findOne({
      where: { id: req.params.id },
    });
    if (isEmpty(user)) {
      httpStatus = HTTP_STATUS_NOT_FOUND;
      user = {};
    }

    res.status(httpStatus).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    }
    next(err);
  }
};

exports.filterUsers = async (req, res, next) => {
  try {
    let users = new Array(0);
    if (isEmpty(req.query)) {
      users = await User.findAll();
    } else {
      try {
        users = await User.findAll({ where: req.query });
      } catch (err) {
        if (err.name === SEQ_DB_ERR) {
          err.message = "Invalid query string.";
          err.statusCode = HTTP_STATUS_BAD_REQUEST;
          throw err;
        }
      }
    }
    res.status(HTTP_STATUS_OK).json(users);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let countDeletedUsers = 0;
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    if (!isEmpty(req.params.id)) {
      countDeletedUsers = await User.destroy({
        where: { id: req.params.id },
      });
    }
    if (countDeletedUsers != 0) {
      httpStatus = HTTP_STATUS_OK;
    }
    res.status(httpStatus).json({ usersDeleted: countDeletedUsers });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
