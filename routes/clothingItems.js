const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.get("/", getItems);
router.put("/:itemId", updateItems);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
