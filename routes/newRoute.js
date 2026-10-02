const express = require("express");
const newRoute = express();
const formController = require("../controllers/formController");

newRoute.get("/", formController.getCreateBook);
newRoute.post("/", formController.postCreateBook);

module.exports = newRoute;
