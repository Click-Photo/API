const bcrypt = require('bcrypt');
const clienteRepository = require('../repositories/clienteRepository');
const stripe =  require('stripe')(`${process.env.STRIPE_KEY_TEST}`);

module.exports = {
    async getAllClientes() {
        return await clienteRepository.getAllClientes();
    },

    async getEspecifCliente(id) {
        return await clienteRepository.getEspecifCliente(id);
    },

    async createAccountLink(stripeAccountId) {
        return await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: 'http://localhost:3636/reauth',
            return_url: 'http://localhost:3636/return',
            type: 'account_onboarding'
        });
    },

    async updateClientes(id, email, nome, telefone, senha, CEP) {
        const data = {
            email,
            nome,
            telefone,
            CEP
        };
        return await clienteRepository.updateClientes(id, data);
    }
};