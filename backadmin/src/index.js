require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const apiRoutes = require('./route/root');
const pool = require('./config/db');  // Importez la configuration de la base de données
const cors = require('cors');
const morgan = require('morgan');


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Utilisez le middleware cors
app.use(morgan('dev'));

// Vérifiez la connexion à la base de données
pool.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données établie');
  }
});

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
