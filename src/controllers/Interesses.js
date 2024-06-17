const db = require('../database/db');

module.exports = {
    async getAllInteresses(req, res) {
        try {
            const interesses = await db('interesses').select('*');
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
            const interesse = await db('interesses').insert({
                idJobs: idJob,
                idFotografo: idFotografo
            });

            res.status(201).json({ message: 'Interesse marcado com sucesso!' });
        } catch (err) {
            console.error('Erro ao marcar interesse', err);
            res.status(500).json({ message: 'Erro ao marcar interesse' });
        }
    },

    async getInteressesFotografo(req, res) {
        const { idFotografo } = req.params;

        try {
            const interesses = await db('interesses')
                .join('jobs', 'interesses.idJobs', '=', 'jobs.id')
                .select(
                    'interesses.id as interesseId',
                    'jobs.*'
                )
                .where('interesses.idFotografo', idFotografo);

            res.status(200).json(interesses);
        } catch (err) {
            console.error('Erro ao buscar interesses do fotógrafo', err);
            res.status(500).json({ message: 'Erro ao buscar interesses do fotógrafo' });
        }
    }
};
