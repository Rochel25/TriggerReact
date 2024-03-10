const productModel = require('../model/productModel');

const add = async (req, res) => {
  const { design,stock } = req.body;

  console.log('Données de la requête :', { design,stock });

  try {
    const product = await productModel.addProduct(design,stock);
    res.json(product);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error);
    res.status(500).send('Erreur serveur');
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).send('Erreur serveur');
  }
};

module.exports={add, getProduct}