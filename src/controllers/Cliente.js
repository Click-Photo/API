const clienteService = require('../services/clienteService');

module.exports = {
    async getAllClientes(req, res) {
        try {
            const clientes = await db('cliente').select('*');
            res.status(200).json(clientes);
        } catch (err) {
            console.error('clientes não encontrados', err);
            res.status(500).json({ message: "Clientes não encontrados" })
        }
    },

    async getEspecifCliente(req, res) {
        const { id } = req.params;

        try {
            const clientes = await db('cliente').select('*').where({ id });
            res.status(200).json(clientes);
        } catch (err) {
            console.error('clientes não encontrados', err);
            res.status(500).json({ message: "Clientes não encontrados" })
        }
    },

    async createAccountLink(req, res) {
        const { stripeAccountId } = req.body;

        try {
            const accountLink = await clienteService.createAccountLink(stripeAccountId);
            res.status(200).json({ url: accountLink.url });
        } catch (err) {
            console.error('Erro ao criar link de onboarding do Stripe', err);
            res.status(500).json({ message: 'Erro ao criar link de onboarding' });
        }
    },

    async updateClientes(req, res) {
        const { nome, telefone, senha, CEP, } = req.body;
        const { id } = req.params;
        
        try {
            await clienteService.updateClientes(id, nome, telefone, senha, CEP);
            res.status(200).json({ message: 'Dados do cliente atualizados com sucesso!' });
        } catch (err) {
            console.error('Impossivel alterar dados do cliente', err);
            res.status(500).json({ message: 'Impossivel alterar dados do cliente, entre em contato com o administrador' });
        }
    }
};
