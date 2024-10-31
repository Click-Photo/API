const bcrypt = require('bcrypt');
const fotografoRepository = require('../repositories/fotografoRepository');
const stripe = require('stripe')(`${process.env.STRIPE_KEY_TEST}`);

module.exports = {
    async getAllFotografos() {
        return await fotografoRepository.getAllFotografos();
    },

    async getEspecifFotografo(id) {
        return await fotografoRepository.getEspecifFotografo(id);
    },

    async createAccountLink(stripeAccountId) {
        return await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: 'http://localhost:3636/reauth',
            return_url: 'http://localhost:3636/return',
            type: 'account_onboarding'
        });
    },

    async updateFotografo(id, nome, telefone, senha, CEP) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const data = {
            nome,
            telefone,
            senha: hashedPassword,
            CEP
        };
        return await fotografoRepository.updateFotografo(id, data);
    }
};
