const db = require("../db/queries");
const { body, matchedData, validationResult } = require("express-validator");
const rules = require("../stringRules");
const duplicateKeyValueError = require("../errors/duplicateKeyValueError");

const updateValidation = [
  body("book_name")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Book's name ${rules.lenError}`),
  body("author_name")
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage(`Author's name ${rules.alpError}`)
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Author's name ${rules.lenError}`),
  body("genre1").optional({ values: "falsy" }).trim(),
  body("genre2").optional({ values: "falsy" }).trim(),
  body("genre3").optional({ values: "falsy" }).trim(),
  body("genre4").optional({ values: "falsy" }).trim(),
  body("genre5").optional({ values: "falsy" }).trim(),
  body("genre1_id").optional({ values: "falsy" }),
  body("genre2_id").optional({ values: "falsy" }),
  body("genre3_id").optional({ values: "falsy" }),
  body("genre4_id").optional({ values: "falsy" }),
  body("genre5_id").optional({ values: "falsy" }),
  body("book_id"),
  body("author_id"),
  body("quantityOfGenres"),
];

async function getHome(req, res) {
  const books = await db.getBooks();
  const authors = await db.getAuthors();

  res.render("index", { books, authors });
}

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

async function getUpdateOfBook(req, res) {
  const bookId = req.params.bookId;
  const [infor] = await db.getBookAndAuthor(bookId);
  const listOfGenre = await db.getGenreOfBook(bookId);

  res.render("update", {
    bookName: infor.book_name,
    authorName: infor.author_name,
    book_id: infor.book_id,
    author_id: infor.author_id,
    listOfGenre,
  });
}

async function search(req, res) {
  const query = req.query.search_result;
  const result = await db.search(query);
  res.render("search", { query, result });
}

const postUpdate = [
  updateValidation,
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).render("update", { errors: error.array() });
    }
    const results = matchedData(req);
    // update
    try {
      await db.updateBookNameById(results.book_name, results.book_id);
      await db.updateAuthorNameById(results.author_name, results.author_id);
      for (let i = 0; i < results.quantityOfGenres; i++) {
        if (!results[`genre${i + 1}`]) continue;
        await db.updateGenreNameById(
          results[`genre${i + 1}`],
          results[`genre${i + 1}_id`],
        );
      }
    } catch (err) {
      throw new duplicateKeyValueError(err.detail);
    }
    res.redirect("/");
  },
];

async function postDeleteBook(req, res) {
  await db.deleteBook(req.params.bookId);
  res.redirect("/");
}

async function postDeleteAuthorNotHaveAnyBook(req, res) {
  await db.deleteAuthorNotHaveAnyBook(req.params.authorId);
  res.redirect("/");
}

module.exports = {
  getHome,
  getDetailOfBook,
  search,
  getUpdateOfBook,
  postUpdate,
  postDeleteBook,
  postDeleteAuthorNotHaveAnyBook,
};
