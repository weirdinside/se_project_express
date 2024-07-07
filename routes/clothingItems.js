const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItems,
  deleteItem,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.get("/", getItems);
router.put("/:itemId", updateItems);

module.exports = router;
