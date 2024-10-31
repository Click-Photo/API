const interestService = require('../services/interesseService');

module.exports = {
    async getAllInteresses(req, res) {
        try {
            const interesses = await interestService.getAllInteresses();
            res.status(200).json(interesses);
        } catch (err) {
            console.error('interesses não encontrados', err);
            res.status(500).json({ message: "Interesses não encontrados" });
        }
    },

    async marcarInteresse(req, res) {
        const { idJob } = req.params;
        const { idFotografo } = req.body; 

        try {
            await interestService.marcarInteresse(idJob, idFotografo);
            res.status(201).json({ message: 'Interesse marcado com sucesso!' });
        } catch (err) {
            console.error('Erro ao marcar interesse', err);
            res.status(500).json({ message: 'Erro ao marcar interesse' });
        }
    },

    async getInteressesFotografo(req, res) {
        const { idFotografo } = req.params;

        try {
            const interesses = await interestService.getInteressesFotografo(idFotografo);
            res.status(200).json(interesses);
        } catch (err) {
            console.error('Erro ao buscar interesses do fotógrafo', err);
            res.status(500).json({ message: 'Erro ao buscar interesses do fotógrafo' });
        }
    }
};
