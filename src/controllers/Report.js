const reportService = require('../services/reportService.js');  

module.exports = {
  async createReport(req, res) {
    try {
      const { email, idPostagem, motivo } = req.body;

      await reportService.createReport(email, idPostagem, motivo);
      return res.status(201).json({ mensagem: 'Report criado com sucesso' });

    } catch (error) {
      console.error('Erro ao criar o Report:', error);
      return res.status(500).json({ mensagem: 'Ocorreu um erro ao criar o Report' });
    }
  },

  async getReports(req, res) {
    try {
      const reports = await reportService.getReports();
      return res.status(200).json(reports);

    } catch (error) {
      console.error('Erro ao buscar os Reports:', error);
      return res.status(500).json({ mensagem: 'Ocorreu um erro ao buscar os Reports' });
    }
  },

  async resolveReport(req, res) {
    try {
      const { idPostagem, tipo, deletePost } = req.body;

      await reportService.resolveReport(idPostagem, tipo, deletePost);

      return res.status(200).json({ mensagem: 'Report resolvido com sucesso' });

    } catch (error) {
      console.error('Erro ao resolver o report:', error);
      return res.status(500).json({ mensagem: 'Ocorreu um erro ao resolver o report' });
    }
  }
};
