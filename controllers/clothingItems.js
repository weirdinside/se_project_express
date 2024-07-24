const Item = require("../models/clothingItem");
const {
  FORBIDDEN,
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res.status(DEFAULT).send({ message: "Error in getting items" })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You cannot delete an item you did not add" });
      }
      return item.deleteOne().then(()=> {res.status(200).send({ message: `${item._id} has been deleted` })})
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
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested file not found" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested file not found" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
