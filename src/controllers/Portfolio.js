const portfolioService = require('../services/portfolioService');

module.exports = {
    async adicionarFoto(req, res) {
        const { fotografoId, descricao } = req.body;
        const foto = req.file;

        try {
         const { id, fotoUrl} = await portfolioService.adicionarFoto(fotografoId, foto, descricao);
         res.status(201).json({id, message: 'Foto  adicionada com sucesso ao portfólio', fotoUrl});
        } catch (error){
            console.error('Erro ao adicionar foto ao portfólio', error);
            res.status(500).json({ message: 'Erro ao adicionar foto ao portfólio', error: error.message});
        }
    },

    async listarFotosGeral(req, res) {
        try {
            const fotos = await portfolioService.listarFotosGeral();
            res.status(200).json(fotos);
        } catch (error) {
            console.error("Erro ao listar todas as fotos do portfólio: ", error);
            res.status(500).json({ message: "Erro ao listar todas as fotos do portfólio", error: error.message });
        }
    },

    async listarFotosFotografo(req, res) {
        const fotografoId = req.params.fotografoId;

        try {
            const fotos = await portfolioService.listarFotosFotografo(fotografoId);
            res.status(200).json(fotos);

        } catch (error) {
            console.error("Erro ao listar fotos do portfólio: ", error);
            res.status(500).json({ message: "Erro ao listar fotos do portfólio", error: error.message });
        }
    },

    async deleteFoto(req, res) {
        const fotoId = req.params.fotoId;

        try {
            await portfolioService.deleteFoto(fotoId);
            res.status(200).json({  message: 'Foto deletada com sucesso' });

        } catch (error) {
            console.error("Erro ao deletar foto do portfólio: ", error);
            res.status(500).json({ message: "Erro ao deletar foto do portfólio", error: error.message });
        }
    },

    async editarInfoFoto(req, res) {
        const { idFoto } = req.params;
        const { descricao } = req.body;
        try {
            await portfolioService.editarInfoFoto(idFoto, descricao);
            res.status(200).json("Informações atualizadas com sucesso!");

        } catch (err) {
            console.log("Erro ao atualizar informações: ", err);
            res.status(500).json("Erro ao atualizar informações");
        }
    }
};
