const db = require('../database/db');

class InterestRepository {
    async getAllInteresses() {
        return await db('interesses').select('*');
    }

    async marcarInteresse(idJob, idFotografo) {
        return await db('interesses').insert({
            idJobs: idJob,
            idFotografo: idFotografo
        });
    }

    async getInteressesFotografo(idFotografo) {
        return await db('interesses')
            .join('jobs', 'interesses.idJobs', '=', 'jobs.id')
            .select(
                'interesses.id as interesseId',
                'jobs.*'
            )
            .where('interesses.idFotografo', idFotografo);
    }
}

module.exports = new InterestRepository();
