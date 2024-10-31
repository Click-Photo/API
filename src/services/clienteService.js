const bcrypt = require('bcrypt');
const clienteRepository = require('../repositories/clienteRepository');
const stripe =  require('stripe')(`${process.env.STRIPE_KEY_TEST}`);

module.exports = {
    async getAllClientes() {
        return await clienteRepository.getAllClientes();
    },

    async getClienteById(id) {
        return await clienteRepository.getClienteById(id);
    },

    async createAccountLink(stripeAccountId) {
        return await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: 'http://localhost:3636/reauth',
            return_url: 'http://localhost:3636/return',
            type: 'account_onboarding'
        });
    },

    async updateClientes(id, nome, telefone, senha, CEP) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const data = {
            nome,
            telefone,
            senha: hashedPassword,
            CEP
        };
        return await clienteRepository.updateClientes(id, data);
    }
};