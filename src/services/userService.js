const UserRepository = require('../repositories/userRepository')
const AdminRepository = require('../repositories/adminRepository');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_KEY_TEST);

const saltRounds = 10;

const transporter =  nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'click.studio.ilustration@gmail.com',
        pass: 'uoueupvqdobqlubg',
    },
});

async function criarContaFotografo() {
    try {
        const stripeAccount = await stripe.accounts.create({
            type: 'express',
            country: 'BR',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });
        
        return stripeAccount;
    } catch (error) {
        console.error('Erro ao criar conta conectada na Stripe:', error);
        throw new Error('Falha ao criar conta do fotógrafo na Stripe');
    }
}

// Função para criar um link de onboarding para o fotógrafo
 async function criarLinkOnboardingConta(fotografoStripeAccountId) {
    const accountLink = await stripe.accountLinks.create({
        account: fotografoStripeAccountId,
        refresh_url: 'http://localhost:3000/cadastro/fotografo',
        return_url: 'http://localhost:3000/cadastro/sucesso',
        type: 'account_onboarding',
    });

    return accountLink.url;
}

module.exports = {
    async getAllUsers(){
        return await UserRepository.getAllUsers()
    },

    async createUser(user) {
        const resultEmail = await UserRepository.resultEmail(user);
        const resultCpf = await UserRepository.resultCpf(user);
    
        if (resultEmail.length > 0 || resultCpf.length > 0) {
            return { message: 'Email ou CPF já cadastrados' };
        }
    
        const hashPass = await bcrypt.hash(user.senha, saltRounds);
        const dataAtual = moment().format('YYYY-MM-DD');
    
        // Certifique-se de passar os parâmetros na ordem correta
        const id = await UserRepository.createUser(user, hashPass, dataAtual);
        if (user.role === "fotografo") {
            const stripeAccount = await criarContaFotografo();
      
            await UserRepository.updateStripeAccountId(id, stripeAccount.id);
            const onboardingLink = await criarLinkOnboardingConta(stripeAccount.id);
            return { id: id, message: 'Fotógrafo criado com sucesso!', onboardingLink };
        } 
    
        if (user.role === "cliente") {
            return { id, message: 'Cliente criado com sucesso!' };
        }
    
        return { id, message: 'Administrador criado com sucesso!' };
    },

    async updateUser(user,idUser){
             await UserRepository.updateUser(user,idUser)
             return {message: 'Usuário atualizado com sucesso!'}     
    },

    async deleteUser(idUser){
        return await UserRepository.deleteUser(idUser)
    },

    async reqPasswordReset(userEmail){
        const resultEmail = await UserRepository.validEmail(userEmail);
        
        if(resultEmail.length === 0){
            return {message: 'Email não cadastrado'}
        }

        let ticket
        let validTicket

        do{
            ticket = crypto.randomBytes(4).toString('hex');
            validTicket = await UserRepository.validTicket(ticket);
        } while (validTicket)

        const idUser = await UserRepository.getEspecifUserByEmail(resultEmail);
        await UserRepository.reqPasswordReset(idUser, ticket);


        await transporter.sendMail({
            from: '',
            to: email,
            subject: 'Redefinição de Senha',
            html: `
                 <div style="background-color: black; padding: 8px 20px; text-align: center;">
                    <h2 style="font-size: 24px; color: #fff; font-family: 'Baloo', sans-serif; font-weight: 700;">Click</h2>
                </div>
                    <div style="padding: 20px; background-color: white;">
                        <p style="font-size: 16px; color: black;">Olá!</p>
                        <p style="font-size: 16px; color: black;">Esse é seu <strong style="color: black;">Código</strong> para redefinir a sua senha: ${token}!</p>
                        <p style="font-size: 16px; color: black;"><strong style="color: black;">Click</strong> está à disposição. :)</p>
                </div>`,
            });
        
            return{message: 'Ticket para reset de senha enviado para o email'}
    },

    async verifyPasswordResetTicket(userTicket){
        const resultTicket = await UserRepository.verifyPasswordResetTicket(userTicket);
        if (resultTicket.length < 1){
            console.log("Ticket inválido! " + userTicket);
            return{message: 'Ticket inválido! Favor digitar novamente!'};
        }

        await UserRepository.deletePasswordResetTicket(userTicket);
        return{message: 'Ticket válido'}
    },

    async resetPassword(user){
        const {senha, confirmaSenha} = user;
        if (senha != confirmaSenha){
            return {message: 'Senhas diferentes!'}
        }
        const hashedPass = await bcrypt.hash(senha, saltRounds);
        return await UserRepository.resetPassword(user, hashedPass)
    },

    async authLogin(user, res) {
        const { email, senha } = user;
        const validAdmin = await AdminRepository.findAdminByEmail(email);
    
        let validUser;
        if (validAdmin) {
            validUser = validAdmin;
        } else {
            validUser = await UserRepository.resultEmail(user);
            if (!validUser) {
                return { auth: false, message: 'Email ou senha inválido!' };
            }
        }
  
        const encryptedPassword = validAdmin? validUser.senha : validUser[0].senha; 
        if (!encryptedPassword || !senha) {
            return { auth: false, message: "Dados de senha ausentes" };
        }
        const comparePassword = await bcrypt.compare(senha, encryptedPassword);
        if (!comparePassword) {
            return { auth: false, message: "Login inválido" };
        }

        const role = validAdmin ? 'admin' : validUser[0].role; 

        const token = jwt.sign({ email: email, role: role }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 60 * 60 * 1000 // Expira em 3 horas
        });
    
        return { auth: true, message: 'Login realizado com sucesso!', role: role };
    }
    
}