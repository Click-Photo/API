const portfolioRepository = require('../repositories/portfolioRepository');

class PortfolioService {
    async adicionarFoto(fotografoId, foto, descricao) {
        return await portfolioRepository.adicionarFoto(fotografoId, foto, descricao);

    }

    async listarFotosGeral() {
        return await portfolioRepository.listarFotosGeral();
    }

    async listarFotosFotografo(fotografoId) {
        return await portfolioRepository.listarFotosFotografo(fotografoId);
    }

    async deleteFoto(fotoId) {
        return await portfolioRepository.deleteFoto(fotoId);
    }
    async editarInfoFoto(idFoto, descricao) {
        return await editarInfoFoto(idFoto, descricao);
    }
};

module.exports = new PortfolioService();