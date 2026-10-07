const { body, matchedData, validationResult } = require("express-validator");
const db = require("../db/queries");
const rules = require("../stringRules");
const fs = require("fs");
const path = require("node:path");

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
  res.render("newVibeCode");
}

async function insertInfors(
  book_name,
  book_url,
  author_name,
  author_url,
  genres,
) {
  const authorExisted = await db.insertNewAuthor(author_name, author_url);
  if (authorExisted === 0 && author_url !== "default_author.jpeg") {
    const authorImgPath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      author_url,
    );

    fs.unlink(authorImgPath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  const author_id = await db.getAuthorIdByName(author_name);
  const bookExisted = await db.insertNewBook(book_name, author_id, book_url);
  if (bookExisted === 0 && book_url !== "default_book.jpeg") {
    const bookImgPath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      book_url,
    );

    fs.unlink(bookImgPath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
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
      return res.status(400).render("newVibeCode", { errors: errors.array() });
    }
    const { book_name, author_name, genre1, genre2, genre3, genre4, genre5 } =
      matchedData(req);
    const genres = [genre1, genre2, genre3, genre4, genre5].filter(
      (genre) => genre,
    );
    const bookImg =
      req.files && req.files.book_image
        ? req.files.book_image[0].filename
        : "default_book.jpeg";
    const authorImg =
      req.files && req.files.author_image
        ? req.files.author_image[0].filename
        : "default_author.jpeg";
    await insertInfors(book_name, bookImg, author_name, authorImg, genres);
    res.redirect("/");
  },
];

module.exports = {
  getCreateBook,
  postCreateBook,
};
