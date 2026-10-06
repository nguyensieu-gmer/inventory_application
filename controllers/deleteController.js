const db = require("../db/queries");

async function postDeleteBook(req, res) {
  await db.deleteBook(req.params.bookId);
  res.redirect("/");
}

async function postDeleteAuthorNotHaveAnyBook(req, res) {
  await db.deleteAuthorNotHaveAnyBook(req.params.authorId);
  res.redirect("/");
}

module.exports = {
  postDeleteAuthorNotHaveAnyBook,
  postDeleteBook,
};
