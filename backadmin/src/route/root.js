const express = require('express');
const router = express.Router();
const usersController = require('../controller/userController');
const productController=require('../controller/productController');
const fournisseurController=require('../controller/fournisseurController');
const approvController=require('../controller/approvController');
const auditController=require('../controller/auditController');

//dbuser
const userController = require('../controller/dbuserController');

router.post('/login1', userController.authenticateUser);
router.post('/users1', userController.addUser);

// Route pour utilisateur
router.post('/grant-privileges/:userId', usersController.grantPrivileges);
router.post('/users', usersController.add);
router.post('/login', usersController.authenticate);

//Route pour produit
router.post('/products', productController.add); 
router.get('/products', productController.getProduct); 

//Route pour fournisseur
router.post('/fournisseurs', fournisseurController.add); 
router.get('/fournisseurs', fournisseurController.getFournisseur); 

//Route pour approv
router.post('/approvs', approvController.add); 
router.get('/approvs', approvController.getApprov); 
router.delete('/approvs/:idapprov', approvController.deleteApprov);
router.put('/approvs/:idapprov', approvController.updateApprov);
router.get('/approvs/:idapprov', approvController.getApprovByIdCont);    

//Route pour audit
router.get('/audit', auditController.getAudit);


module.exports = router;
