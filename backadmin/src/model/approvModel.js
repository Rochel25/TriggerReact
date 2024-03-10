const pool = require('../config/db');


const addApprov = async (idprod, idfr, id_user, qte) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. INSERT INTO approv
    const insertQuery = `
      INSERT INTO approv (idprod, idfr, id_user, qte)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const insertValues = [idprod, idfr, id_user, qte];
    const insertResult = await client.query(insertQuery, insertValues);

    // 3. UPDATE produit
    const updateQuery = `
      UPDATE produit
      SET stock = stock + $1
      WHERE idprod = $2;
    `;

    const updateValues = [qte, idprod];
    await client.query(updateQuery, updateValues);

    await client.query('COMMIT');

    return insertResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateApprov = async (idapprov, newQte, id_user) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. SELECT produit avant modification
    const selectOldValuesQuery = `
      SELECT idprod, qte
      FROM approv
      WHERE idapprov = $1
      FOR UPDATE;
    `;

    const selectOldValuesValues = [idapprov];
    const oldValuesResult = await client.query(selectOldValuesQuery, selectOldValuesValues);

    // Récupérer les valeurs avant modification
    const oldIdprod = oldValuesResult.rows[0].idprod;
    const oldQte = oldValuesResult.rows[0].qte;

    // 2. UPDATE approv
    const updateQuery = `
      UPDATE approv
      SET qte = $1, id_user = $2
      WHERE idapprov = $3
      RETURNING *;
    `;

    const updateValues = [newQte,id_user, idapprov];
    const updateResult = await client.query(updateQuery, updateValues);

    // 3. UPDATE produit
    const updateProduitQuery = `
      UPDATE produit
      SET stock = stock + CAST($1 AS INTEGER) - CAST($2 AS INTEGER)
      WHERE idprod = $3;
    `;

    const updateProduitValues = [newQte, oldQte, oldIdprod];
    await client.query(updateProduitQuery, updateProduitValues);

    await client.query('COMMIT');

    return updateResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};


const getAllApprovs = async () => {
  const query = `
    SELECT c.idapprov as id, a.design as produit, b.nom as fournisseur, c.qte as quantite  FROM produit a, fournisseur b, approv c where a.idprod=c.idprod and b.idfr=c.idfr;
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};


const deleteApprov = async (idapprov, id_user) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start a transaction

    // Set a session variable for app.user_id
    await client.query(`SET app.user_id = '${id_user}'`);

    // Perform the actual deletion
    const deleteQuery = 'DELETE FROM approv WHERE idapprov = $1 RETURNING *';
    const deleteValues = [idapprov];
    const deleteResult = await client.query(deleteQuery, deleteValues);

    await client.query('COMMIT'); // Commit the transaction

    return deleteResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    throw error;
  } finally {
    // Reset the session variable after the DELETE
    await client.query('RESET app.user_id');
    client.release();
  }
};



const getApprovById = async (idapprov) => {
  const query = `
    SELECT c.idapprov as id, a.design as produit, b.nom as fournisseur, c.qte as quantite  
    FROM produit a, fournisseur b, approv c 
    WHERE a.idprod = c.idprod 
    AND b.idfr = c.idfr
    AND c.idapprov = $1;`;

  try {
    const result = await pool.query(query, [idapprov]);
    if (result.rows.length ===  0) {
        throw new Error(`No row found with idapprov: ${idapprov}`);
    }
    return result.rows[0];
} catch (error) {
    console.error(error);
    throw error;
}

};


module.exports = {
  addApprov,
  updateApprov,
  getAllApprovs,
  deleteApprov,
  getApprovById
};