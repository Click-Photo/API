const db = require('../database/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
    async getAllClientes(req, res){
        try{
            const clientes = await db('cliente').select('*');
            res.status(200).json(clientes);
        } catch(err){
            console.error('clientes não encontrados', err);
            res.status(500).json({message: "Clietes não encontrados"})
        }
    },
    
    async createClientes (req, res) {
        const {
            nome,
            telefone,
            email,
            cpf,
            cep,
            senha
        } = req.body;

        console.log(req.body);

        try {
            const resultsEmail = await db('cliente')
            .where('email', email)
            .select('*');

            // const resultsCPF = await db('cliente')
            // .where('CPF', cpf)
            // .select('*');

            


            if (resultsEmail.length > 0){
                console.error('erro ao cadastrar o cliente: Cliente já cadastrado');
                res.status(400).json({ message: 'Esse e-mail já possui um cadastro, faça login!'});
            } 
            //else if (resultsCPF.length > 0){
            //     console.error('erro ao cadastrar o cliente: CPF já cadastrado');
            //     res.staus(400).json({message: 'Esse CPF já possui um cadastro, faça login!'})
            // }

            

            else{
                const hashedPassword = await bcrypt.hash(senha, 10);

                const [id] = await db('cliente').insert({
                    nome,
                    telefone,
                    email,
                    cpf,
                    cep,
                    senha: hashedPassword,
                });
    
                res.status(201).json({id, message: 'cliente cadastrado.'});
            }
        }catch(err) {
            console.error('Erro ao cadastrar o cliente', err);
            res.status(500).json({ message: 'Não foi possível cadastrar o cliente'});
        }
    },

    async updateClientes (req,res){
        const{
            nome,
            telefone,
            email,
            senha,
            cep,
        } = req.body;

        try{
            await db('cliente')
            .where({id})
            .update({
                nome,
                telefone,
                email,
                senha,
                cep
            });
            res.status(200).json({ message: 'Dados do cliente atualizado com sucesso'})
        } catch (err){
            console.error('Houve um problema para fazer a troca de dados: ',err);
            res.status(500).json({ message: 'Houve um problema para atualizar os dados.;'})
        }
    },

    async deleteClientes(req, res) {
        const {id} = req.params;

        try{
            await db('Job').where({idCliente}).del();
            await db('cliente').where({id}).del();
            res(200).json({ message: 'Cliente excluido com sucesso!'})
        } catch(err){
            console.error('Houve um erro ao realizar a exclusão do cliente')
            res.status(500).json({ message: 'Houve um problema para realizar a exclusão do cliente.'})
        }
    },

    async requisitarResetSenha(req,res){
        const {email} = req.body;
        const result = await db('clientes').where({email}).select('*');

        try {
            if(result.length < 1){
                console.log("Email não cadastrado")
                res.status(400).json({ message: 'Email não cadastrado.'})
            }
            
            const token = crypto.randomBytes(4).toString('hex');
            await db('token').insert({token});

            await transporter.sendEmail({
                from: '',
                to: email,
                subject: 'Refinição de Senha',
                text: `Seu código para redefinição de senha é: ${token}`
            });

            res.status(200).json({ message: 'Código para redefinição de senha enviado'})

        } catch(err){
            res.status(500).json({ message: 'Houve um erro para enviar o código de redefinição de senha'})
        }
    },

    async verificarToken (req, res) {
        const { token } = req.body;
        const validToken = false;

        try{
            const result = await db('token').where({token}).select('*');

            if(result.length < 1){
                console.log("Token inválido! " + validToken);
                res.status(404).json({message: 'Token inválido! Favor digite novamente!'});
            }

            await db('token').where({token}).del()
            validToken = true
            console.log("Token Válido!" + validToken)
            res.status(200).json({ message: 'Token válido!'})
        } catch(err){
            console.error("Erro na validação de token!", err);
            res.status(500).json({ message: 'Erro ao validar o token, favor verificar com admnistrador.'})
        }
    },

    async resetSenha (req, res){
        const {email} = req.params;
        const {senha, confirmaSenha} = req.body;

        const criptografia  = await bcrypt.hash(senha, saltRounds);
        try{
            if(senha != confirmaSenha){
                res.staus(400).json({ message: 'A senha não está igual!'})
            }

            await db('cliente').where({email}).update({senha: criptografia});
            res.status(200).json({message: "Senha trocada com sucesso!"})
        } catch (err){
            console.error("Erro ao redefinir senha!", err);
            res.status(500).json({ message: 'Algo deu errado ao redefinir a senha!'});
        }
    },

    async autenticacaoLogin(req,res){
        const{email, senha} = req.body;

        try{
            const result = await db('clientes').where({email}).select('*');

            if(result.length === 0){
                res.status(401).json({ message: 'Email não localizado, confira novamente ou cadastra-se'});
            }

            const senhaIncritografada = result[0].senha;
            const comparaSenha = await bcrypt.compare(senha, senhaIncritografada);

            if (comparaSenha) {
                 res.json({ auth: true, token, userType: 'cliente', user: result});
            }

            res.status(401).json({message: "Senha inserida incorretamente."})           
        } catch(err){
            console.error("Erro ao redefinir a senha!", err)
            res.status(500).json({message: 'Erro ao redefinir a senha, entre em contato com o administrador.'})
        }
    }

}
