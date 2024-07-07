const Item = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;

  Item.create({
    name: name,
    weather: weather,
    imageURL: imageURL,
  }).then((item) => {
    res.send({ data: item }).catch((err) => {
      res.status(500).send({ message: "error from createItem" });
    });
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
  const { imageURL } = req.body;
  Item.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error in updating item", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.send({});
    })
    .catch((err) => {
      res.status(500).send({ message: "Error in deleting item", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItems,
  deleteItem,
};
