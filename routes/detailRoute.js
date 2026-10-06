const express = require("express");
const detailController = require("../controllers/detailController");
const detailRoute = express();

detailRoute.get("/:bookId", detailController.getDetailOfBook);

module.exports = detailRoute;
