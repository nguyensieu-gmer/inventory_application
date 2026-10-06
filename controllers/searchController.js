const db = require("../db/queries");

async function getSearch(req, res) {
  const query = req.query.search_result;
  const result = await db.searchBookAndAuthor(query);
  res.render("search", { query, result });
}

module.exports = {
  getSearch,
};
