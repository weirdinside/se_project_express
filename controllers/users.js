const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => [
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Bad request" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Not Found" });
      }
      return res.status(DEFAULT).send({ message: "Server error" });
    }),
];

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      return res.status(BAD_REQUEST).send({ message: "Not Authorized" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const update = { name, avatar };

  User.findByIdAndUpdate({ _id: req.user._id }, update, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "Invalid user" });
      }
      return res.send({
        data: { user, message: "Info updated" },
      });
    })
    .catch((e) => {
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      return res.send(users);
    })
    .catch(() => {
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    res.status(BAD_REQUEST).send({ message: "Email is required" });
    return;
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(CONFLICT).send({ message: "Email is in use" });
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) => {
          res.send({
            data: { name: user.name, avatar: user.avatar, email: user.email },
          });
        });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
    });
};

module.exports = {
  updateUser,
  getCurrentUser,
  login,
  getUsers,
  createUser,
};
