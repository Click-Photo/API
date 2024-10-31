const avaliacaoRepository = require('../repositories/avaliacaoRepository');

module.exports = {
    async getAvaliacoesPendentesCliente(clienteId) {
        return await avaliacaoRepository.getAvaliacoesPendentesCliente(clienteId);
    },

    async getAvaliacoesPendentesFotografo(fotografoId) {
        return await avaliacaoRepository.getAvaliacoesPendentesFotografo(fotografoId);
    },

    async avaliarFotografo(jobId, notaFotografo) {
        return await avaliacaoRepository.avaliarFotografo(jobId, notaFotografo);
    },

    async avaliarCliente(jobId, notaCliente) {
        return await avaliacaoRepository.avaliarCliente(jobId, notaCliente);
    },

    async mediaAvaliacoesFotografo(fotografoId) {
        const result = await avaliacaoRepository.mediaAvaliacoesFotografo(fotografoId);
        return {
            mediaNota: result[0].mediaNota ? parseFloat(result[0].mediaNota).toFixed(1) : 'Sem avaliações',
            totalAvaliacoes: result[0].totalAvaliacoes
        };
    },

    async mediaAvaliacoesCliente(clienteId) {
        const result = await avaliacaoRepository.mediaAvaliacoesCliente(clienteId);
        return {
            mediaNota: result[0].mediaNota ? parseFloat(result[0].mediaNota).toFixed(1) : 'Sem avaliações',
            totalAvaliacoes: result[0].totalAvaliacoes
        };
    }
};
