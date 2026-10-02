const { body, matchedData, validationResult } = require("express-validator");
const db = require("../db/queries");

const lenError = "must be more than 1 character";
const alpError = "must only contain letters";

const validated = [
  body("book_name")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Book name ${lenError}`),
  body("author_name")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(`Author name ${lenError}`),
  body("genre1").trim(),
  body("genre2").trim(),
  body("genre3").trim(),
  body("genre4").trim(),
  body("genre5").trim(),
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
      (genre) => genre !== "",
    );
    await insertInfors(book_name, author_name, genres);
    res.redirect("/");
  },
];

module.exports = {
  getCreateBook,
  postCreateBook,
};
