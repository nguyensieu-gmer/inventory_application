const express = require("express");
const searchRoute = express();
const DBController = require("../controllers/DBController");

searchRoute.get("/", DBController.search);

module.exports = searchRoute;
