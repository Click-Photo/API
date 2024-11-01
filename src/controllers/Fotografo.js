const fotografoService = require('../services/fotografoService');

module.exports = {
    async getAllFotografos(req, res) {
        try {
            const fotografos = await fotografoService.getAllFotografos();
            res.status(200).json(fotografos);
        } catch (err) {
            console.error('clientes não encontrados', err);
            res.status(500).json({ message: "Fotografos não encontrados" });
        }
    },

    async getEspecifFotografo(req, res) {
        const { id } = req.params;

        try {
            const fotografo = await fotografoService.getEspecifFotografo(id);
            res.status(200).json(fotografo);
        } catch (err) {
            console.error('fotografos não encontrados', err);
            res.status(500).json({ message: "fotografos não encontrados" });
        }
    },

    async createAccountLink(req, res) {
        const { stripeAccountId } = req.body;

        try {
            const accountLink = await fotografoService.createAccountLink(stripeAccountId);
            res.status(200).json({ url: accountLink.url });
        } catch (err) {
            console.error('Erro ao criar link de onboarding do Stripe', err);
            res.status(500).json({ message: 'Erro ao criar link de onboarding' });
        }
    },

    async updateFotografo(req, res) {
        const { nome, telefone, senha, CEP } = req.body;
        const { id } = req.params;

        try {
            await fotografoService.updateFotografo(id, nome, telefone, senha, CEP);
            res.status(200).json({ message: 'Dados do fotografo atualizado com sucesso!' });
        } catch (err) {
            console.error('Impossivel alterar dados do fotografo', err);
            res.status(500).json({ message: 'Impossivel alterar dados do fotografo, entre em contato com o administrador' });
        }
    }
};
