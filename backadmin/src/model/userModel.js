const pool = require('../config/db');
const bcrypt = require('bcrypt');

const addUser = async (nom, password, email, role) => {
  // Crypter le mot de passe avant de l'insérer dans la base de données
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (nom, password, active, email, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [nom, hashedPassword, false, email, "user"];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const grantPrivileges = async (userId) => {
  const query = `
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $1;
  `;

  try {
    await pool.query(query, [userId]);
    console.log('Privilèges attribués avec succès');
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (nom, password) => {
  const query = `
    SELECT * FROM users
    WHERE nom = $1;
  `;

  try {
    const result = await pool.query(query, [nom]);

    if (result.rows.length === 0) {
      // L'utilisateur avec le nom spécifié n'a pas été trouvé
      return null;
    }

    const user = result.rows[0];

    // Vérifier si le compte est actif
    if (!user.active) {
      // Le compte n'est pas actif
      return null;
    }

    // Vérifier le mot de passe avec bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Le mot de passe correspond, renvoyer les informations de l'utilisateur
      return user;
    } else {
      // Le mot de passe ne correspond pas
      return null;
    }
  } catch (error) {
    throw error;
  }
};


module.exports = { addUser, authenticateUser, grantPrivileges };
