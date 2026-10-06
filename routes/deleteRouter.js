const express = require("express");
const deleteRouter = express();
const deleteController = require("../controllers/deleteController");

deleteRouter.post("/book/:bookId", deleteController.postDeleteBook);
deleteRouter.post(
  "/author/:authorId",
  deleteController.postDeleteAuthorNotHaveAnyBook,
);

module.exports = deleteRouter;
