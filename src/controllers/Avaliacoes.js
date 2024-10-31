const avaliacaoService = require('../services/avaliacaoService');

module.exports = {
    async getAvaliacoesPendentesCliente(req, res) {
        const { clienteId } = req.params.clienteId;

        try {
            const avaliacoes = await avaliacaoService.getAvaliacoesPendentesCliente(clienteId);
            res.status(200).json(avaliacoes);
        } catch (err) {
            console.log("Erro ao buscar avaliações pendentes do Cliente: ", err);
            res.status(500).json("Erro ao buscar avaliações pendentes do Cliente");
        }
    },

    async getAvaliacoesPendentesFotografo(req, res) {
        const { fotografoId } = req.params.fotografoId;

        try {
            const avaliacoes = await avaliacaoService.getAvaliacoesPendentesFotografo(fotografoId);
            res.status(200).json(avaliacoes);
        } catch (err) {
            console.log("Erro ao buscar avaliações pendentes do Fotografo: ", err);
            res.status(500).json("Erro ao buscar avaliações pendentes do Fotografo");
        }
    },

    async avaliarFotografo(req, res) {
        const { jobId } = req.params.jobId;
        const { notaFotografo } = req.body.notaFotografo; 

        try {
            await avaliacaoService.avaliarFotografo(jobId, notaFotografo);
            res.status(200).json("Avaliação ao fotografo feita com sucesso");
        } catch (err) {
            console.log("Erro ao avaliar o fotografo: ", err);
            res.status(500).json("Erro ao avaliar o fotografo");
        }
    },

    async avaliarCliente(req, res) {
        const { jobId } = req.params.jobId
        const { notaCliente } = req.body.notaCliente;

        try {
            await avaliacaoService.avaliarCliente(jobId, notaCliente);
            res.status(200).json("Avaliação ao cliente feita com sucesso");
        } catch (err) {
            console.log("Erro ao avaliar o cliente: ", err);
            res.status(500).json("Erro ao avaliar o cliente");
        }
    },

    async mediaAvaliacoesFotografo(req, res) {
        const fotografoId = req.params.fotografoId;

        try {
            const media = await avaliacaoService.mediaAvaliacoesFotografo(fotografoId);
            res.status(200).json(media);
        } catch (err) {
            console.log("Erro ao buscar a média da nota do fotografo: ", err);
            res.status(500).json("Erro ao buscar a média da nota do fotografo");
        }
    },

    async mediaAvaliacoesCliente(req, res) {
        const clienteId = req.params.clienteId;
        try {
            const media = await avaliacaoService.mediaAvaliacoesCliente(clienteId);
            res.status(200).json(media);
        } catch (err) {
            console.log("Erro ao buscar a média da nota do cliente: ", err);
            res.status(500).json("Erro ao buscar a média da nota do cliente");
        }
    }
};
