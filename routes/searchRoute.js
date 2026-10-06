const express = require("express");
const searchRoute = express();
const searchController = require("../controllers/searchController");

searchRoute.get("/", searchController.getSearch);

module.exports = searchRoute;
