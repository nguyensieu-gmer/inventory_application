const express = require("express");
const path = require("node:path");
const app = express();
const { loadEnvFile } = require("node:process");
const DBController = require("./controllers/DBController");
const detailRoute = require("./routes/detailRoute");
const searchRoute = require("./routes/searchRoute");
const newRoute = require("./routes/newRoute");
const updateRouter = require("./routes/updateRouter");
const { copyFileSync } = require("node:fs");
loadEnvFile();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", DBController.getHome);
app.use("/detail", detailRoute);
app.use("/search", searchRoute);
app.use("/new", newRoute);
app.use("/update", updateRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 409)
    .render("alert", { title: "Updating fail", message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error on port ${PORT}`, err);
  }
  console.log("App listening on port", PORT);
});
