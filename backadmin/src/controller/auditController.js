const auditModel=require("../model/auditModel");

const getAudit=async(req, res)=>{
    try{
        const audit=await auditModel.getAllAudit();
        res.json(audit);
    }catch(error){
        console.error('Erreur lors de la récupération dans la table Audit:', error);
        res.status(500).send('Erreur serveur');
    }
}

module.exports={getAudit};