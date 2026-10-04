const express = require("express");
const deleteRouter = express();
const DBController = require("../controllers/DBController");

deleteRouter.post("/book/:bookId", DBController.postDeleteBook);
deleteRouter.post(
  "/author/:authorId",
  DBController.postDeleteAuthorNotHaveAnyBook,
);

module.exports = deleteRouter;
