const router = require('express').Router();

const itemRouter = require('./clothingItems')
const userRouter = require('./users');

router.use('/items', itemRouter);
router.use('/users', userRouter);

module.exports = router;