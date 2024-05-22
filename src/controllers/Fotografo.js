const db = require('../database/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const moment = require('moment');

module.exports = {
    async getAllFotografos (req, res) {
        try{
            const fotografos = await db('fotografo').select('*');
            res.status(200).json(fotografos);
        } catch (err){
            console.error('clientes não encontrados', err);
            res.status(500).json({message: "Fotografos não encontrados"})
        }
    },

    async createFotografo (req, res) {
        const{
            nome,
            telefone,
            email,
            CPF,
            CEP,
            senha,
            dataEntrada
        } = req.body;

        try{
            const dataAtual = moment().format('YYYY-MM-DD');

            const resultsEmail = await db('fotografo')
            .where('email', email)
            .select('*');

            const resultsCpf = await db('fotografo')
            .where('CPF', CPF)
            .select('*');

            const resultsEmailCliente = await db('cliente')
            .where('email',email)
            .select('*');

            const resultsCpfCliente = await db('cliente')
            .where('CPF', CPF)
            .select('*'); 

            if (resultsEmail.length || resultsEmailCliente > 0){
                console.error('erro ao cadastrar o fotografo: Fotografo já cadastrado');
                return res.status(400).json({ message: 'Esse e-mail já possui um cadastro, faça login!'});
            } 
            if (resultsCpf.length || resultsCpfCliente > 0){
                console.error('erro ao cadastrar o fotografo: CPF já cadastrado');
               return  res.status(400).json({message: 'Esse CPF já possui um cadastro, faça login!'})
            }

            const hashedPassword = await bcrypt.hash(senha, 10);

            const {id} = await db('fotografo').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                senha : hashedPassword,
                dataEntrada : dataAtual
            });

            res.status(201).json({id, message: 'Cliente cadastrado.'});

        } catch(err){
            console.error('Erro ao criar fotografo!', err)
            res.status(500).json({message: 'Não foi possível cadastrar o fotografo.'});
        }
    },

    async updateFotografo(req, res){
        const {
            nome,
            telefone,
            senha,
            CEP,
        } =req.body;

        const {id} = req.params;

        try{

            await db('fotografo')
            .where({id})
            .update({
                nome,
                telefone,
                senha,
                CEP
            });

            res.status(200).json({message: 'Dados do fotografo atualizado com sucesso!'})
    
        } catch(err){
            console.error('Impossivel alterar dados do fotografo',err);
            res.status(500).json({messsage: 'Impossivel alterar dados do fotografo, entre em contato com o admistrador'})
        }
    },

    async deleteFotografo(req, res){
        const { id } = req.params;

        try{
            //await db('portifolio').where({idFotografo}).del();
            await db('fotografo').where({id}).del();
            res.status(200).json({ message: 'Fotografo excluido com sucesso!'})
        } catch(err){
            console.error('Houve um erro ao realizar a exclusão do fotografo');
            res.status(500).json({ message: 'Houve um erro ao realizar a exclusão do fotografo'})
        }
    },

    async requisitarResetSenha(req, res){
        const {email} = req.body;
        const result = await db('Fotografo').where({email}).select('*');

        try{
            if(result.length < 1){
                console.log('Email não cadastrado')
                res.status(400).json({message: 'Email não cadastrado'})
            }

            const token = crypto.randomBytes(4).toString('hex');
            await db('token').insert({token});

            await WebTransportError.sendEmail({
                from: '',
                to: email,
                subject: 'Redifinição de Senha',
                text: `Seu código para redifnição de senha é: ${token}`
            });

            res.status(200).json({message: 'Código para redefinição de senha enviado'})

        } catch(err){
            console.error('Erro ao enviar código',err)
            res.status(500).json({ message: 'Houve um erro para enviar o código de redefiniçãp de senha'})
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



}