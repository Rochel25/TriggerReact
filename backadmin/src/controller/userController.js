const userModel = require('../model/userauthModel');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const createToken = (user) => {
  const token = jwt.sign({ userId: user.id_user, nom: user.nom, role:user.role }, 'votre_clé_secrète', { expiresIn: '1h' });
  return token;
};

const add = async (req, res) => {
  const { nom, password, email, role } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: 'Mot de passe manquant' });
    }

    const user = await userModel.addUser(nom, password, email, role);
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    res.status(500).send('Erreur serveur');
  }
};

const authenticate = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nom, password, twofaCode } = req.body;

  try {
    const user = await userModel.authenticateUser(nom, password, twofaCode);

    if (user) {
      if (!user.twofa_enabled) {
        // L'utilisateur n'a pas activé le 2FA, renvoyer une indication au front-end
        res.json({ success: true, twofa_enabled: false, message: 'Veuillez activer le 2FA', user });
      } else {
        // Authentification réussie, créer et envoyer le token
        const token = createToken(user);
        res.json({ success: true, token, user, twofa_enabled: true });
      }
    } else {
      // Échec de l'authentification
      res.status(401).json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const grantPrivileges = async (req, res) => {
  const { userId } = req.params;

  try {
    await userModel.grantPrivileges(userId);
    res.status(200).json({ message: 'Privilèges attribués avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'attribution des privilèges :', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'attribution des privilèges' });
  }
};

module.exports = { add, authenticate, grantPrivileges };
