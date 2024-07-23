const router = require("express").Router();
const auth = require('../middlewares/auth.js');

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.get("/", getItems);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
