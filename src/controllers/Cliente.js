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
        const{
            nome,
            telefone,
            email,
            cpf,
            cep,
            senha
        } = req.body;

        try {
            const resultsEmail = await db('cliente')
            .where('email', email)
            .select('*');

            const resultsCPF = await db('cliente')
            .where('cpf', cpf)
            .select('*');


            if (resultsEmail.length > 0){
                console.error('erro ao cadastrar o cliente: Cliente já cadastrado');
                res.status(400).json({ message: 'Esse e-mail já possui um cadastro, faça login!'});
            } else if (resultsCPF.length > 0){
                console.error('erro ao cadastrar o cliente: CPF já cadastrado');
                res.staus(400).json({message: 'Esse CPF já possui um cadastro, faça login!'})
            }

            

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
    }

}
