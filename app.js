const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const router = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;
// app.use(cors);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to database");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
app.use(cors)
