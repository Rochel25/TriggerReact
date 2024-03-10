const pool = require('../config/db');

const addProduct = async (design, stock) => {

  const query = `
      INSERT INTO produit (design, stock)
      VALUES ($1, $2)
      RETURNING *;
    `;

  const values = [design, stock];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const getAllProducts = async () => {
  const query = `
      SELECT * FROM produit;
    `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  addProduct, getAllProducts
}