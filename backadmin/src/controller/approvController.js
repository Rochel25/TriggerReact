const approvModel = require('../model/approvModel');

const add = async (req, res) => {
  const { idprod, idfr, id_user, qte } = req.body;

  console.log('Request Data:', { idprod, idfr, id_user, qte });

  try {
    const approv = await approvModel.addApprov(idprod, idfr, id_user, qte);
    res.json(approv);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};


const getApprov = async (req, res) => {
  try {
    const approvs = await approvModel.getAllApprovs();
    res.json(approvs);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).send('Erreur serveur');
  }
};


const deleteApprov = async (req, res) => {
  const { idapprov } = req.params;
  const id_user = req.get('X-User-Id');
  // Log id_user to console
  console.log('id_user:', id_user);


  try {
      const deletedApprov = await approvModel.deleteApprov(idapprov, id_user);
      res.json({ success: true, deletedApprov });
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'approvisionnement:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};




const updateApprov = async (req, res) => {
  const { idapprov } = req.params;
  const { qte, id_user } = req.body;

  try {
    const updatedApprov = await approvModel.updateApprov(idapprov, qte, id_user);
    res.json(updatedApprov);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'approvisionnement:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const getApprovByIdCont = async (req, res) => {
  try {
    // Vérifiez si req.params.idapprov est défini
    if (!req.params.idapprov) {
      return res.status(400).json({ error: 'Paramètre idapprov manquant dans la requête' });
    }

    const { idapprov } = req.params;
    const approv = await approvModel.getApprovById(idapprov);

    if (!approv) {
      return res.status(404).json({ error: 'Approvisionnement non trouvé' });
    }

    res.status(200).json(approv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


module.exports = { add, getApprov, deleteApprov, updateApprov, getApprovByIdCont };
