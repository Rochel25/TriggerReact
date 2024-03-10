const pool = require('../config/db');

const getAllAudit = async () => {
    const query = `
        SELECT * FROM audit_approv;
      `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };
  module.exports = {
   getAllAudit
  }