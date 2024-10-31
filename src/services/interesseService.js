const interestRepository = require('../repositories/interesseRepository');

class InterestService {
    async getAllInteresses() {
        return await interestRepository.getAllInteresses();
    }

    async marcarInteresse(idJob, idFotografo) {
        return await interestRepository.marcarInteresse(idJob, idFotografo);
    }

    async getInteressesFotografo(idFotografo) {
        return await interestRepository.getInteressesFotografo(idFotografo);
    }
}

module.exports = new InterestService();
