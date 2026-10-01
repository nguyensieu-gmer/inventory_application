const express = require("express");
const DBController = require("../controllers/DBController");
const detailRoute = express();

detailRoute.get("/:bookId", DBController.getDetailOfBook);

module.exports = detailRoute;
