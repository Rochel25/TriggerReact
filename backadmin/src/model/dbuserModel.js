const pool = require('../config/db');
const bcrypt = require('bcrypt');
const authenticateUser = async (nom, password) => {
  try {
    const client = await pool.connect();

    try {
      // Retrieve the stored password hash (ensure compatibility with database's hash algorithm)
      const getPasswordHashQuery = `SELECT passwd FROM pg_shadow WHERE usename = $1`;
      const passwordHashResult = await client.query(getPasswordHashQuery, [nom]);

      if (passwordHashResult.rows.length === 0) {
        console.log('Utilisateur introuvable :', nom);
        return null;
      }

      const storedPasswordHash = passwordHashResult.rows[0].passwd;

      // Securely verify password using bcrypt, considering database compatibility
      const passwordMatch = await bcrypt.compare(password, storedPasswordHash); // Assuming async/await usage

      if (passwordMatch) {
        console.log('Authentification réussie pour l\'utilisateur :', nom);
        return { nomUtilisateur: nom };
      } else {
        console.log('Échec de l\'authentification pour l\'utilisateur :', nom);
        return null;
      }
    } finally {
      // Ensure the client is released regardless of errors
      client.release();
    }
  } catch (error) {
    console.error('Utilisateur authentication error:', error);
    throw error; // Re-throw for proper error handling
  }
};

const addUser = async (nom, password) => { // Add client as argument
  try {
    const client = await pool.connect();
    await client.query(`CREATE USER ${nom} WITH PASSWORD '${password}'`);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};
module.exports = {
  authenticateUser,
  addUser,
};
