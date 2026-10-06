const db = require("../db/queries");

async function getDetailOfBook(req, res) {
  const bookId = req.params.bookId;
  const [infor] = await db.getBookAndAuthor(bookId);
  const listOfGenre = await db.getGenreOfBook(bookId);

  res.render("detail", {
    bookName: infor.book_name,
    authorName: infor.author_name,
    listOfGenre,
  });
}

module.exports = { getDetailOfBook };
