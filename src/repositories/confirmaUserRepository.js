const db = require('../database/db');
const crypto =  require ('crypto');
const nodemailer = require ('nodemailer');
const bcrypt = require ('bcrypt');
const saltRounds = 10;
const moment = require('moment');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'click.studio.ilustration@gmail.com',
        pass: 'uoueupvqdobqlubg',
    }
})

module.exports = {
    async createUser(user){
        const{
            nome,
            telefone,
            email,
            CPF,
            CEP,
            senha,
            role,
        } = user;

        try{

            const resultsEmail = await db('user').where('email', email).select('*');
            const resultsCpf = await db('user').where('CPF', CPF).select('*');

            if (resultsEmail.length>0){
                console.error('Erro ao cadastrar o usuário: email já cadastrado.');
                return {message: 'Esse email já está cadastrado, tente novamente!'};
            }

            if (resultsCpf.length > 0) {
                console.error('Erro ao cadastrar usuário: CPF já cadastrado.');
                return {message: 'Esse CPF já está cadastrado, tente novamente!'};;
            }

            const dataEntrada = moment().format('YYYY-MM-DD');
            const hashedPassword = await bcrypt.hash(senha, saltRounds);
            
            const [id] = await db('confirmaUser').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                role,
                senha : hashedPassword,
                dataEntrada
            })

            const ticket = crypto.randomBytes(3).toString('hex');

            await db('sign_in_ticket').insert({
                idUser: id,
                ticket: ticket
            });

            await transporter.sendMail({
                from: ' ',
                to: email,
                subject: 'Criação de Conta',
                html: `
                    <div style="background-color: black; padding: 8px 20px; text-align: center;">
                        <h2 style="font-size: 24px; color: #fff; font-family: 'Baloo', sans-serif; font-weight: 700;">Click</h2>
                    </div>
                    <div style="padding: 20px; background-color: white;">
                        <p style="font-size: 16px; color: black;">Olá!</p>
                        <p style="font-size: 16px; color: black;">Esse é seu <strong style="color: black;">Código</strong> de acesso: ${ticket}!</p>
                        <p style="font-size: 16px; color: black;">O <strong style="color: black;">Click</strong> agradece o seu cadastro :)</p>
                    </div>
                `,
            });

            return {message: 'Usuário cadastrado com sucesso!', id: id};
        
        } catch(err){
            console.error('Erro ao cadastrar usuário',err)
            return {message: 'Não foi possível cadastrar o usuário!'};
        }
    },

    async verifyTicketConfirmUser (ticketUser){
        const {ticket} = ticketUser;
        try{
            const ticketData = await db('sign_in_ticket').where({ticket}).first();
            console.log('ticket: ',ticketData);
            if (!ticketData){
                return{message: "ticket Inválido"}
            }

            const idUserTicket = ticketData.idUser;
            console.log('Ticket: ', idUserTicket)

            const userData = await db('confirmauser').where({id: idUserTicket }).first();
           
            if (!userData) {
                return { message: "Usuário não encontrado" };
            }


            const {
                nome,
                telefone,
                email,
                CPF,
                CEP,
                role,
                senha,
                dataEntrada
            } = await db('confirmauser').where({id: idUserTicket}).first();

            console.log('idUserTicket:', idUserTicket);


            const [id] = await db ('user').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                role,
                senha,
                dataEntrada
            });

            await db ('sign_in_ticket').where({ticket}).del();
            await db ('confirmaUser').where({id: idUserTicket}).del();

            return {id, message: 'Usuario criado!'}

        }
        catch(err){
                    console.error('Erro ao verificar ticket',err)
                    return {message: 'Não foi possível verificar o ticket!'};
                }
    }
} 