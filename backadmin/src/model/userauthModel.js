require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const addUser = async (nom, password, email, role) => {
  const secretCode = generateRandomCode();
  await sendEmail(email, 'Two-Factor Authentication Code', `Your two-factor authentication code is: ${secretCode}`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (nom, password, active, email, role, secret_code, twofa_enabled)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [nom, hashedPassword, false, email, "user", secretCode, false];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (nom, password, twofaCode) => {
  try {
    // Recherche de l'utilisateur par nom
    const query = 'SELECT * FROM users WHERE nom = $1;';
    const result = await pool.query(query, [nom]);

    if (result.rows.length === 0) {
      console.log('User not found');
      return {
        success: false,
        message: 'Nom d\'utilisateur introuvable'
      };
    }

    const user = result.rows[0];

    // Activation du compte si non actif
    if (!user.active) {
      console.log('Activating user account');
      await pool.query('UPDATE users SET active = true WHERE nom = $1;', [user.nom]);
      user.active = true;
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Incorrect password');
      return {
        success: false,
        message: 'Mot de passe incorrect'
      };
    }

    // Si le 2FA est désactivé
    if (!user.twofa_enabled) {
      // Vérifier le twofaCode avec le secret_code
          console.log('Comparaison');
      if (twofaCode === user.secret_code.toString()) {
        console.log('Enabling 2FA');
        // Mettre à jour la base de données pour activer le 2FA
        const updateResult = await pool.query('UPDATE users SET twofa_enabled = true WHERE nom = $1;', [user.nom]);

        if (updateResult.rowCount > 0) {
          user.twofa_enabled = true;
          console.log('Authentication successful');
          return user;
        } else {
          console.log('Update failed');
          return {
            success: false,
            message: 'Échec de la mise à jour du 2FA'
          };
        }
      } else {
        console.log('Invalid 2FA code');
        return {
          success: false,
          message: 'Code 2FA invalide'
        };
      }
    } else {
      // Si le 2FA est déjà activé, retourner simplement un succès
      console.log('2FA is already enabled');
      return user;


    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    return {
      success: false,
      message: 'Erreur d\'authentification'
    };
  }
};






module.exports = {
  addUser,
  authenticateUser
};