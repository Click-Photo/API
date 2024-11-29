const bcrypt = require('bcrypt');
const fotografoRepository = require('../repositories/fotografoRepository');
const userRepository = require('../repositories/userRepository');

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

   

    async criarContaFotografo(user) {
        if (user.role !== 'fotografo') {
            return { message: 'Usuário não é fotógrafo' };
        }
    
        try {
            const account = await stripe.accounts.create({
                type: 'express', 
                country: 'BR',
                email: user.email,
            });
    
            const accountLink = await stripe.accountLinks.create({
                account: account.id,  
                refresh_url: 'http://localhost:3636/reauth', 
                return_url: 'http://localhost:3636/return',  
                type: 'account_onboarding',  
            });
    
          
            await userRepository.updateStripeAccountId(user.email, account.id);
    
            return { 
                message: 'Conta do fotógrafo criada com sucesso!',
                stripeAccountLink: accountLink.url
            };
    
        } catch (error) {
            return { message: `Erro ao criar conta na Stripe: ${error.message}` };
        }
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
