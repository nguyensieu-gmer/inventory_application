const express = require("express");
const updateRouter = express();
const updateController = require("../controllers/updateController");

updateRouter.get("/:bookId", updateController.getUpdateOfBook);
updateRouter.post("/", updateController.postUpdate);

module.exports = updateRouter;
