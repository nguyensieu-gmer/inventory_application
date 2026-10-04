const express = require("express");
const updateRouter = express();
const DBController = require("../controllers/DBController");

updateRouter.get("/:bookId", DBController.getUpdateOfBook);
updateRouter.post("/", DBController.postUpdate);

module.exports = updateRouter;
