const db = require('../database/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const moment = require('moment');

const transporter =  nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'click.studio.ilustration@gmail.com',
        pass: 'uoueupvqdobqlubg',
    },
});

module.exports = {

    /*
    ADMIN = 1
    FOTOGRAFO = 2
    CLIENTE = 3
    */

    async getAllUsers(){
            const user = await db('user').select('*');
            return {message: user};
    },

    async getAllUsers(){
        const user = await db('user').select('*');
        return {message: user};
    },

    async getEspecifUserByEmail(email){
        const user = await db('user').select('*').where({email}).first();
        return user;
    },

    async resultEmail (user){
        const{email} = user;
        const resultEmail = await db ('user').where('email',email).select('*')
        return resultEmail
    },

    async resultCpf(user){
        const{CPF} = user;
        const resultCpf = await db('user').where('CPF', CPF).select('*')
        return resultCpf
    },

    async createUser(user, hashPass, date){
        const{nome,telefone,email,CPF,CEP,senha,role} = user;
        const [id] = await db('user').insert({
            nome,
            telefone,
            email,
            CPF,
            CEP,
            role,
            senha: hashPass,
            dataEntrada: date
        });

        return id;
    },

    async updateStripeAccountId(email, stripeAccountId) {
        return await db('user') 
            .where({ email: email }) 
            .update({ stripeAccountId: stripeAccountId });  
    },
  
    async updateUser (user, idUser){
        const {id} = idUser; //Puxa o ID
        const {nome, telefone, email, CEP} = user; //Puxa todas as informações
        await db('user').where({id}).update({
                nome,
                telefone,
                email,
                CEP
        }); //Faz update no banco
    },
    
    async deleteUser(idUser){
        const {id} = idUser;
            //await db('jobs').where({idUser: id}).del();
            await db('user').where({id}).del();         
    },

    async validTicket(ticket){
        const validTicket = await db('password_reset_tickets').select('ticket').where({ ticket }).first();;
        return validTicket;
    },

    async validEmail(userEmail){
        const resultEmail = await db('user').select('id').where({email}).first();
        return resultEmail;
    },


    async reqPasswordReset (idUser,ticket) {      
        await db('password_reset_tickets').insert({
                    idUser,
                    ticket
        });
    },

    async verifyPasswordResetTicket(userTicket){
        const {ticket} = userTicket
        const result = await db('password_reset_tickets').where({ ticket}).select('*');

            if (result.length < 1){
                console.log("Ticket inválido! " + result);
                return{message: 'Ticket inválido! Favor digitar novamente!'};
            }

    },

    async deletePassResetTicket(ticket){
        await db('password_reset_tickets').where({ticket}).del();
    },

    async resetPassword(user, hashedPass){
        const {email} = user;
        await db('user').where({email: email}).update({senha: hashedPass})
    },

    async authLogin(authUser, res){
        const {email, senha} = authUser;
        const user = await db('user').where({email}).select('*');
        return user;
    },

    async getEmailById(id) {
        const result = await db('user').select('email').where({ id });
        return result;
    },

    async getRoleById(id){
        const result = await db('user').select('role').where({ id });
        return result;
    }
}