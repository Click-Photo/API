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

    async getAllUsers(req,res){
        try{
            const users = await db('user').select('*');
            res.status(200).json(users);
        } catch (err){
            console.error('Usuários não encontrados', err);
            res.status(500).json({message: 'Usuários não encontrados.'})
        }
    },

    async createUser(req,res){
        const{nome,telefone,email,CPF,CEP,senha,role} = req.body;
        
        try{
            const hashedPassword = await bcrypt.hash(senha, 10);
            const dataAtual = moment().format('YYYY-MM-DD');
            
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

            if(role === 1){
                res.status(200).json({admin, message: 'Administrador criado'})
            }
            
            if (role === 2){
                const fotografo = await db('fotografo').insert({
                    id_user: id
                })
                res.status(200).json({fotografo, message: 'Fotografo criado'})
            }

            if(role === 3){
                const cliente = await db('cliente').insert({
                    id_user: id
                })
                res.status(200).json({cliente, message: 'Cliente criado'})
            }
            
        } catch(err){
            console.error('Erro ao cadastrar usuário', err)
            res.status(500).json({message: 'Não foi possível cadastrar o usuário.'});
        }
    },

    async updateUser (req,res){
        const {id} = req.params;
        const {nome, telefone, email, CEP} = req.body;

        try{
            await db('users').where({id}).update({
                nome,
                telefone,
                email,
                CEP
            });
            res.status(200).json({message: 'Usuário atualizado'})
        }catch(err){
            console.error('Erro ao atualizar usuário', err)
            res.status(500).json({message: 'Não foi possível atualizar o usuário.'});
        }
    },
    
    async deleteUser(req,res){
        const {id} = req.params;

        try{
            await db('jobs').where({idUser: id}).del();
            await db('user').where({id}).del();
            
            res.status(200).json({message: 'Usuário excluído com sucesso!'})

        }catch(err){
            console.error('Houve um erro ao excluir o usuário: ', err)
            res.status(500).json({message: 'Não foi possível excluir o usuário.'});
        }
    },

    async reqPasswordReset (req, res) {
        const {email} = req.body;
        try {
            const resultUser = await db('user')
            if (resultUser.length > 0) {
                const user = await db('user').select('id').where({email}).first();
                const idUser = user.id;
                const ticket = crypto.randomBytes(4).toString('hex');
                await db('password_reset_tickets').insert({
                    idUser,
                    ticket
                });

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

                return res.status(200).json({message: 'Código de redefinição de senha enviado'});
            }

            console.log("Email não cadastrado")
            return res.status(400).json({message: 'Email não cadastrado'});

        }catch(err){
            console.error('Erro ao verificar email existente', err);
            res.status(500).json({message: 'Não foi possível verificar o email.'})

        }

    },

    async verifyPasswordResetTicket(req,res){
        const {ticket} = req.body;

        try{
            const result = await db('ticket').where({ ticket}).select('*');

            if (result.length < 1){
                console.log("Ticket inválido! " + validToken);
                res.status(404).json({message: 'Ticket inválido! Favor digitar novamente!', validToken: false});
            }

            await db('token').where({token}).del();
            res.status(200).json({ message: 'Ticket validado!'})
        } catch(err){
            console.error("Erro na validação de ticket: ", err)
            res.status(500).json({message: 'Não foi possível validar o ticket.'})
        }
    },

    async resetPassword(req, res){
        const {email} = req.params;
        const {senha, confirmaSenha} = req.body;

        try{
            if (senha != confirmaSenha){
                return res.status(400).json({message: 'Senhas diferentes!'})
            }

            const hashedPass = await bcrypt.hash(senha, saltRounds);
            await db('user').where({email: email}).update({senha: hashedPass})
            res.status(200).json({message: 'Senha alterada com sucesso!'})
        } catch(err){
            console.error("Erro ao redefinir senha: ",err);
            res.status(500).json({message: 'Erro ao redefinir a senha!'})
        }

    },

    async authLogin(req,res){
        const {email, senha} = req.body;

        try{
            const user = await db('user').where({email}).select('*');

            if (user.length === 0){
                return res.status(401).json({message: 'Email inválido!'});
            }

            const encryptedPassword = user.senha;

            const comparePassword = await bcrypt.compare(senha, encryptedPassword)

            if (!comparePassword){
                return res.status(401).json({auth: false, message: "Login inválido"})
            }

            const token = jwt.sign({id: user.id}, 'your_secret_key', { expiresIn: '1h' });
            res.cookie('token',token, {httpOnly: true, secure: true, maxAge: 3600000}) //uma hora em milisegundos

            return res.json({auth:true, message: 'Login realizado com sucesso!'})

        } catch(err){

        }
    }
}