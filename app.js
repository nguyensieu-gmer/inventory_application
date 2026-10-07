const express = require("express");
const path = require("node:path");
const app = express();
const { loadEnvFile, title } = require("node:process");
const indexController = require("./controllers/indexController");
const detailRoute = require("./routes/detailRoute");
const searchRoute = require("./routes/searchRoute");
const newRoute = require("./routes/newRoute");
const updateRouter = require("./routes/updateRouter");
const { copyFileSync } = require("node:fs");
const deleteRouter = require("./routes/deleteRouter");
const assestsPath = path.join(__dirname, "public");
loadEnvFile();

app.use(express.static(assestsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", indexController.getHome);
app.use("/detail", detailRoute);
app.use("/search", searchRoute);
app.use("/new", newRoute);
app.use("/update", updateRouter);
app.use("/delete", deleteRouter);

app.use((err, req, res, next) => {
  if (err.statusCode === 409) {
    console.error(err);
    res
      .status(err.statusCode)
      .render("alert", { title: "Updating fail", message: err.message });
  }
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res
      .status(err.statusCode || err.status || 500)
      .render("alert", { title: err.name || "Error", messages: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error on port ${PORT}`, err);
  }
  console.log(`App listening on port localhost:${PORT}`);
});
