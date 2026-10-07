const pool = require("./pool");

// get
async function getBooks() {
  const { rows } = await pool.query(`
    SELECT id, book_name, book_url
    FROM books 
    `);
  return rows;
}

async function getAuthors() {
  const { rows } = await pool.query(`
    SELECT id, author_name, author_url
    FROM authors 
    `);

  return rows;
}

async function getGenre() {
  const { rows } = await pool.query(`
    SELECT id, genre_name
    FROM genres
    `);
  return rows;
}

async function getBookAndAuthor(id) {
  const { rows } = await pool.query(
    `
    SELECT books.id AS book_id, authors.id AS author_id, author_name, book_name
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
    SELECT genres.id, genre_name
    FROM genres JOIN books_genres ON genres.id = books_genres.genre_id
    WHERE book_id = $1
    `,
    [id],
  );
  return rows;
}

async function getGenreIdByName(genreList) {
  const { rows } = await pool.query(
    `
    SELECT id FROM genres WHERE genre_name = ANY($1)
    `,
    [genreList],
  );
  const idList = rows.map((row) => row.id);
  return idList;
}

async function searchBookAndAuthor(query) {
  const { rows } = await pool.query(
    `
    SELECT books.id, book_name, author_name, book_url, author_url
    FROM books JOIN authors ON books.author_id = authors.id
    WHERE book_name ILIKE $1 OR author_name ILIKE $1
    `,
    [`%${query}%`],
  );

  return rows;
}

async function getAuthorIdByName(author_name) {
  const { rows } = await pool.query(
    `
    SELECT id FROM authors WHERE author_name = $1
    `,
    [author_name],
  );
  const [{ id }] = rows;
  return id;
}

async function getBookIdByName(book_name) {
  const { rows } = await pool.query(
    `
    SELECT id FROM books WHERE book_name = $1
    `,
    [book_name],
  );
  const [{ id }] = rows;
  return id;
}

// insert
async function insertNewBook(book_name, author_id, book_url) {
  const { rowCount } = await pool.query(
    `
    INSERT INTO books(book_name, author_id, book_url) VALUES ($1, $2, $3)
    ON CONFLICT (book_name) DO NOTHING
    `,
    [book_name, author_id, book_url],
  );
  return rowCount;
}

async function insertNewAuthor(author_name, author_url) {
  const { rowCount } = await pool.query(
    `
    INSERT INTO authors(author_name, author_url) VALUES($1, $2)
    ON CONFLICT (author_name) DO NOTHING
    `,
    [author_name, author_url],
  );
  return rowCount;
}

async function insertNewGenre(genre_name) {
  await pool.query(
    `
    INSERT INTO genres(genre_name) VALUES($1)
    ON CONFLICT (genre_name) DO NOTHING
    `,
    [genre_name],
  );
}

async function insertBookAndGenre(book_id, genre_id) {
  await pool.query(
    `
    INSERT INTO books_genres VALUES($1, $2)
    `,
    [book_id, genre_id],
  );
}

// update
async function updateBookNameById(newName, id) {
  await pool.query(
    `
    UPDATE books
    SET book_name = $1
    WHERE id = $2
    `,
    [newName, id],
  );
}

async function updateAuthorNameById(authorName, id) {
  await pool.query(
    `
    UPDATE authors
    SET author_name = $1
    WHERE id = $2
    `,
    [authorName, id],
  );
}

async function updateGenreNameById(genre, id) {
  await pool.query(
    `
    UPDATE genres
    SET genre_name = $1
    WHERE id = $2
    `,
    [genre, id],
  );
}

// delete
async function deleteBook(id) {
  await pool.query(
    `
    DELETE FROM books WHERE id = $1
    `,
    [id],
  );
}

async function deleteAuthorNotHaveAnyBook(id) {
  await pool.query(
    `
    DELETE FROM authors WHERE id = $1 AND 
    id NOT IN (SELECT author_id FROM books)
    `,
    [id],
  );
}

module.exports = {
  getBooks,
  getAuthors,
  getGenreOfBook,
  getBookAndAuthor,
  searchBookAndAuthor,
  getAuthorIdByName,
  getBookIdByName,
  getGenreIdByName,

  insertNewBook,
  insertNewAuthor,
  insertNewGenre,
  insertBookAndGenre,

  updateAuthorNameById,
  updateBookNameById,
  updateGenreNameById,

  deleteBook,
  deleteAuthorNotHaveAnyBook,
};
