const pool = require('../config/db');

const addFournisseur = async (nom) => {

  const query = `
      INSERT INTO fournisseur (nom)
      VALUES ($1)
      RETURNING *;
    `;

  const values = [nom];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const getAllFournisseurs = async () => {
  const query = `
      SELECT * FROM fournisseur;
    `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  addFournisseur, getAllFournisseurs
}