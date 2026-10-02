const { Client } = require("pg");
const { loadEnvFile } = require("node:process");
loadEnvFile();

const BOOKS_SQL = `
CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    book_name VARCHAR(255) UNIQUE,
    author_id INTEGER
)
`;

const AUTHOR_SQL = `
CREATE TABLE IF NOT EXISTS authors(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_name VARCHAR(255) UNIQUE
)
`;

const GENRE_SQL = `
CREATE TABLE IF NOT EXISTS genres(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre_name VARCHAR(255) UNIQUE
)
`;

const BOOKS_GENRES_SQL = `
CREATE TABLE IF NOT EXISTS books_genres(
    book_id INTEGER,
    genre_id INTEGER
)
`;

const INSERT_BOOKS = `
INSERT INTO books(book_name, author_id) VALUES
('Hary Poter', 1), ('The adventure of Tom Sawyer', 2)
`;

const INSERT_AUTHOR = `
INSERT INTO authors(author_name) VALUES
('JK Rowling'), ('Mark Twain')
`;

const INSERT_GENRE = `
INSERT INTO genres(genre_name) VALUES
('Mystery'), ('Boarding school fiction'), ('Comming-of-age'),
('Adventure & Thriller'), ('Adventure'), ('Satire & Humor'), 
('Picaresque & Folk Narritive')
`;

const INSERT_BOOKS_GENRES = `
INSERT INTO books_genres(book_id, genre_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 5), (2, 3), (2, 6), (2, 7)
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();

  await client.query(BOOKS_SQL);
  await client.query(AUTHOR_SQL);
  await client.query(BOOKS_GENRES_SQL);
  await client.query(GENRE_SQL);

  await client.query(INSERT_BOOKS);
  await client.query(INSERT_AUTHOR);
  await client.query(INSERT_BOOKS_GENRES);
  await client.query(INSERT_GENRE);

  await client.end();
  console.log("End...");
}

main();
