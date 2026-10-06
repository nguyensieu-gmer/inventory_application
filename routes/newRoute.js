const express = require("express");
const newRoute = express();
const newController = require("../controllers/newController");
const upload = require("../upload");

newRoute.get("/", newController.getCreateBook);
newRoute.post(
  "/",
  upload.fields([
    { name: "book_image", maxCount: 1 },
    { name: "author_image", maxCount: 1 },
  ]),
  newController.postCreateBook,
);

module.exports = newRoute;
