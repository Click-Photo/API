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
        user: 'think.studio.tattoo@gmail.com',
        pass: 'jsbgujwyvxfapzvq'
    },
});

const contato = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'contato.think.studio@gmail.com',
      pass: 'dwkljpgcgbdllljt',
    },
  });

module.exports = {

    /*
    ADMIN = 1
    FOTOGRAFO = 2
    CLIENTE = 3
    */

    async getAllUsers(user){
        try{
            const user = await db('user').select('*');
            return {message: user};
        } catch (err){
            console.error('Usuários não encontrados', err);
            return {message: 'Usuários não encontrados.'}
        }
    },

    async createUser(user){
        const{nome,telefone,email,CPF,CEP,senha,role} = user;
        
        try{
            const resultEmail = await db('user').where('email',email).select('*');
            const resultCpf = await db('user').where('CPF', CPF).select('*');

            if (resultEmail.length || resultCpf.length > 0){
                console.error('Usuario já cadastrado');
                return {message: 'Não é possível cadastrar usuario, CPF ou Email já existentes.'};
            }

            const hashedPassword = await bcrypt.hash(senha, saltRounds);
            const dataAtual = moment().format('YYYY-MM-DD');

            console.log("Criando usuario")

            const [id] = await db('user').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                role,
                senha : hashedPassword,
                dataEntrada : dataAtual
            });

            if (role === "Fotografo"){
                await db('fotografo').insert({ idUser: id });
                return {id, message: 'Fotografo criado com sucesso!'}
            }

            if(role === "Cliente"){
                await db('cliente').insert({ idUser: id });
                return {id, message: 'Cliente criado com sucesso!'}
            }

            return {id, message: 'Administrador criado com sucesso!'}
            
           
            
        } catch(err){
            console.error('Erro ao cadastrar usuário', err);
            return {message: 'Não foi possível cadastrar o usuário.'};
        }
    },

    async updateUser (user, idUser){
        const {id} = idUser;
        const {nome, telefone, email, CEP} = user;

        try{
            await db('user').where({id}).update({
                nome,
                telefone,
                email,
                CEP
            });
            return{id,message: 'Usuário atualizado'};
        }catch(err){
            console.error('Erro ao atualizar usuário', err)
            return {message: 'Não foi possível atualizar o usuário.'};
        }
    },
    
    async deleteUser(idUser){
        const {id} = idUser;

        try{
            //await db('jobs').where({idUser: id}).del();
            await db('user').where({id}).del();
            
            return{message: 'Usuário excluído com sucesso!'}

        }catch(err){
            console.error('Houve um erro ao excluir o usuário: ', err)
            throw new Error('Não foi possível excluir o usuário.');
        }
    },

    async reqPasswordReset (userEmail) {
        const {email} = userEmail;
        try {
            const resultUser = await db('user')
            if (resultUser.length > 0) {
                const user = await db('user').select('id').where({email}).first();
                const idUser = user.id;

                let ticket;
                let validTicket ;

                do{
                    ticket = crypto.randomBytes(4).toString('hex');
                    validTicket = await db('password_reset_tickets').select('ticket').where({ ticket }).first();;
                }while (validTicket)
                
                await db('password_reset_tickets').insert({
                    idUser,
                    ticket
                });

                // await transporter.sendMail({
                //     from: '',
                //     to: email,
                //     subject: 'Redefinição de Senha',
                //     html: `
                //         <div style="background-color: black; padding: 8px 20px; text-align: center;">
                //             <h2 style="font-size: 24px; color: #fff; font-family: 'Baloo', sans-serif; font-weight: 700;">Click</h2>
                //         </div>
                //         <div style="padding: 20px; background-color: white;">
                //             <p style="font-size: 16px; color: black;">Olá!</p>
                //             <p style="font-size: 16px; color: black;">Esse é seu <strong style="color: black;">Código</strong> para redefinir a sua senha: ${token}!</p>
                //             <p style="font-size: 16px; color: black;"><strong style="color: black;">Click</strong> está à disposição. :)</p>
                //         </div>`,
                // });

                return {message: 'Código de redefinição de senha enviado'};
            }

            console.log("Email não cadastrado")
            return {message: 'Email não cadastrado'};

        }catch(err){
            console.error('Erro ao verificar email existente', err);
            throw new Error('Não foi possível verificar o email.')

        }

    },

    async verifyPasswordResetTicket(userTicket){
        const {ticket} = userTicket

        try{
            const result = await db('password_reset_tickets').where({ ticket}).select('*');

            if (result.length < 1){
                console.log("Ticket inválido! " + result);
                return{message: 'Ticket inválido! Favor digitar novamente!'};
            }

            await db('password_reset_tickets').where({ticket}).del();
            return {message: 'Ticket validado!'}
        } catch(err){
            console.error("Erro na validação de ticket: ", err)
            return {message: 'Não foi possível validar o ticket.'}
        }
    },

    async resetPassword(user){
        const {email, senha, confirmaSenha} = user;

        try{
            if (senha != confirmaSenha){
                return {message: 'Senhas diferentes!'}
            }

            const hashedPass = await bcrypt.hash(senha, saltRounds);
            await db('user').where({email: email}).update({senha: hashedPass})
            return {message: 'Senha alterada com sucesso!'}
        } catch(err){
            console.error("Erro ao redefinir senha: ",err);
            return {message: 'Erro ao redefinir a senha!'}
        }

    },

    async authLogin(authUser, res){
        const {email, senha} = authUser;

        try{
            const user = await db('user').where({email}).select('*');

            if (user.length === 0){
                return {message: 'Email inválido!'};
            }

            const encryptedPassword = user[0].senha;

            const comparePassword = await bcrypt.compare(senha, encryptedPassword)

            if (!comparePassword){
                return {auth: false, message: "Login inválido"}
            }

            const token = jwt.sign({id: user[0].id}, 'your_secret_key', { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000 
            });
            
            return {auth:true, message: 'Login realizado com sucesso!'}

        } catch(err){
            console.log(err);
            return {auth: false, message: 'Falha ao realizar o login!'}
        }
    }
}