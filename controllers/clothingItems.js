const Item = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log({ name, weather, imageUrl });

  Item.create({
    name,
    weather,
    imageUrl,
  }).then((item) => {
    res.send({ data: item }).catch((err) => {
      res.status(500).send({ message: "error from createItem", err });
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
  const { imageUrl } = req.body;
  Item.findByIdAndUpdate(itemId, { $set: { imageUrl } })
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
      res.send({ message: `${item} has been deleted` });
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
