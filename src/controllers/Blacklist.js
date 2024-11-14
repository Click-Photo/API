const blacklistService = require('../services/blacklistService.js');

module.exports = {
  async getAllBlackListed(req, res) {
    try {
      const users = await blacklistService.getAllBlacklisted();
      res.status(200).json(users);
    } catch (err) {
      console.error("Erro: ", err);
      res.status(500).json({ error: 'Erro ao puxar usuarios', err });
    }
  },

  async createBlacklistedUser(req, res) {
    try {
      const user = req.body;
      const createBlacklisted = await blacklistService.createBlacklistedUser(user);
      res.status(200).json(createBlacklisted);
    } catch (err) {
      console.error("Erro: ", err);
      res.status(500).json({ error: 'Erro ao bloquear usuario', err });
    }
  },

  async deleteBlacklistedUser(req, res) {
    try {
      const { id } = req.params; // Supondo que o ID seja passado como parâmetro na URL
      const user = await blacklistService.deleteBlacklistedUser(id);
      res.status(200).json(user);
    } catch (err) {
      console.error("Erro: ", err);
      res.status(500).json({ error: 'Erro ao desbloquear usuario', err });
    }
  }
};