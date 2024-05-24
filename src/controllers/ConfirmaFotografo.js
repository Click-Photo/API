const db = require('../database/db');
const cryto =  require ('crypto');
const nodemailer = require ('nodemailer');
const bcrypt = require ('bcrypt');
const { verificarToken } = require('./Cliente');
const saltRounds = 10;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: ' ',
        pass: ' '
    }
})

module.exports = {
    async createConfirmaFotografo(req, res) {
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
            const results = await db('confirmaFotografo')
            .where({email})
            .select('*');

            if (results.length > 0){
                console.error ('Error ao cadastrar fotografo: Fotografo já cadastrado');
                return res.status(400).json ({ message: "Esse e-mail já está cadastrado"});
            }

            const hashedPass = await bcrypt.hash(senha, saltRounds);
            const [id] = await db ('confirmaFotografo').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                senha: hashedPass
            })

            const token = crypto.randomBytes(3).toString('hex');

            await db('token').insert({
                idCliente: id,
                token
            })

            await transporter.sendMail({
                from: ' ',
                to: email,
                subject: 'Criação de Conta',
                html: `<div style="background-color: black; padding: 8px 20px; text-align: center;">
                    <h2 style="font-size: 24px; color: #fff; font-family: 'Baloo', sans-serif; font-weight: 700;">Th<span style="color: #EB1CE4; font-weigth: bold;">Ink </span></h2>
                </div>
                <div style="padding: 20px;">
                    <p style="font-size: 16px;">Olá!</p>
                    <p style="font-size: 16px;">Esse é seu <strong style="color: #EB1CE4;">Código</strong> de acesso: ${token}!</p>
                    <p>O <strong style="color: #EB1CE4;">ThINK</strong> agradece o seu cadastro :)</p>
                </div>
            `,
            });

            res.status(200).json({ message: 'Códifo de confirmação ára criação de conta enviado por email'});
        } catch(err){
            console.error('Erro ao cadastrar o fotografo', err);
            return res.status(500).json({ message: 'Não foi possível cadastrar o cliente'})
        }
    },
    async verificarTokenConfirmaFotografo(req, res){
        const {token} = req.body;
        try{
            const tokenData = await db('token').where({token}).first();

            if (!tokenData){
                res.status(200).json({message: "Token Inválido"})
            }

            const idFotografoToken = tokenData.idCliente;

            const{
                nome,
                telefone,
                email,
                CPF,
                CEP,
                senha
            } = await db ('confirmaFotografo').where({id: idFotografoToken}).first();

            const [id] =  await db ('cliente').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                senha
            })

            await db('token').where({token}).del();
            await db('confirmaCliente').where({id: idFotografoToken}).del();

            res.status(200).json({message: 'Token Válido'});
        }catch(err){
            console.error("Erro ao verificar o token ", err);
            res.status(500).json({ message: "Algo deu errado ao verificar o token."})
        }
    }
}