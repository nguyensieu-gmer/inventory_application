const { body, matchedData, validationResult } = require("express-validator");
const db = require("../db/queries");
const rules = require("../stringRules");

const validated = [
  body("book_name")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Book name ${rules.lenError}`),
  body("author_name")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Author name ${rules.lenError}`),
  body("genre1")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Genre ${rules.lenError}`),
  body("genre2")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Genre ${rules.lenError}`),
  body("genre3")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Genre ${rules.lenError}`),
  body("genre4")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Genre ${rules.lenError}`),
  body("genre5")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Genre ${rules.lenError}`),
];

function getCreateBook(req, res) {
  res.render("new");
}

async function insertInfors(book_name, author_name, genres) {
  await db.insertNewAuthor(author_name);
  const author_id = await db.getAuthorIdByName(author_name);
  await db.insertNewBook(book_name, author_id);
  const book_id = await db.getBookIdByName(book_name);
  await Promise.all(genres.map((genre) => db.insertNewGenre(genre)));
  const genre_ids = await db.getGenreIdByName(genres);
  await Promise.all(
    genre_ids.map((genre_id) => db.insertBookAndGenre(book_id, genre_id)),
  );
}

const postCreateBook = [
  validated,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("new", { errors: errors.array() });
    }
    const { book_name, author_name, genre1, genre2, genre3, genre4, genre5 } =
      matchedData(req);
    const genres = [genre1, genre2, genre3, genre4, genre5].filter(
      (genre) => genre,
    );
    console.log(req.files);
    await insertInfors(book_name, author_name, genres);
    res.redirect("/");
  },
];

module.exports = {
  getCreateBook,
  postCreateBook,
};
