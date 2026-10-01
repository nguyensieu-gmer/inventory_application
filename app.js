const express = require("express");
const path = require("node:path");
const app = express();
const { loadEnvFile } = require("node:process");
const DBController = require("./controllers/DBController");
loadEnvFile();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", DBController.getHome);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error on port ${PORT}`, err);
  }
  console.log("App listening on port", PORT);
});
