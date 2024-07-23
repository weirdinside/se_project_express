const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  UNAUTHORIZED,
} = require("../utils/errors");
const jwt = require("jsonwebtoken");

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
    .catch(() =>
      res.status(UNAUTHORIZED).send({ message: "Incorrect email or password" })
    );
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

  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(11000).send({ message: "email already exists" });
    }
  });

  User.create({ name, avatar, email, password })
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested file not found" });
      }
      //  else if (err.name === "CastError") {
      //   return res.status(NOT_FOUND).send({ message: err.message });
      // }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { updateUser, getCurrentUser, login, getUsers, createUser, getUserById };
