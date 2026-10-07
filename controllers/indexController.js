const db = require("../db/queries");

async function getHome(req, res) {
  const books = await db.getBooks();
  const authors = await db.getAuthors();

  res.render("indexVibeCode", { books, authors });
}

module.exports = {
  getHome,
};
