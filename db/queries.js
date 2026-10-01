const pool = require("./pool");

async function getBooks() {
  const { rows } = await pool.query(`
    SELECT book_name, id
    FROM books 
    `);
  return rows;
}

async function getAuthors() {
  const { rows } = await pool.query(`
    SELECT author_name 
    FROM authors 
    `);

  return rows;
}

async function getGenre() {
  const { rows } = await pool.query(`
    SELECT genre_name
    FROM genres
    `);
  return rows;
}

async function getBookAndAuthor(id) {
  const { rows } = await pool.query(
    `
    SELECT author_name, book_name
    FROM books JOIN authors ON books.author_id = authors.id
    WHERE books.id = $1
    `,
    [id],
  );
  return rows;
}

async function getGenreOfBook(id) {
  const { rows } = await pool.query(
    `
    SELECT genre_name
    FROM genres JOIN books_genres ON genres.id = books_genres.genre_id
    WHERE book_id = $1
    `,
    [id],
  );
  return rows;
}

module.exports = {
  getBooks,
  getAuthors,
  getGenreOfBook,
};
