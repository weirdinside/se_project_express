const Item = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({
    name,
    weather,
    imageUrl,
  })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error in getting items", err });
    });
};

const updateItems = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  Item.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({ message: `${item} has been deleted` });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
