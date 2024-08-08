const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
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
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are both required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: "Not Authorized" });
      }
      return res.status(DEFAULT).send({ message: "An error has occurred" });
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

      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Validation error" });
      }
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
          console.log(user)
          res.send({
            data: { name: user.name, avatar: user.avatar, email: user.email },
          });
        });
    })
    .catch((err) => {
      console.log(err)
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(DEFAULT).sent({ message: "An error occurred" });
    });
};

module.exports = {
  updateUser,
  getCurrentUser,
  login,
  createUser,
};
