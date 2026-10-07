const db = require("../db/queries");

async function getDetailOfBook(req, res) {
  const bookId = req.params.bookId;
  const [infor] = await db.getBookAndAuthor(bookId);
  const listOfGenre = await db.getGenreOfBook(bookId);

  res.render("detailVibeCode", {
    infor,
    listOfGenre,
  });
}

module.exports = { getDetailOfBook };
