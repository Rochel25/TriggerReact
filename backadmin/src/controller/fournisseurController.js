const fournisseurModel = require('../model/fournisseurModel');

const add = async (req, res) => {
  const { nom } = req.body;

  console.log('Données de la requête :', { nom });

  try {
    const fournisseur = await fournisseurModel.addFournisseur(nom);
    res.json(fournisseur);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du fournisseur:', error);
    res.status(500).send('Erreur serveur');
  }
};

const getFournisseur = async (req, res) => {
  try {
    const fournisseurs = await fournisseurModel.getAllFournisseurs();
    res.json(fournisseurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).send('Erreur serveur');
  }
};

module.exports={add, getFournisseur}