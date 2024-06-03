const db = require('../database/db');
const cryto =  require ('crypto');
const nodemailer = require ('nodemailer');
const bcrypt = require ('bcrypt');
const { verificarToken } = require('./Cliente');
const saltRounds = 10;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'think.studio.tattoo@gmail.com ',
        pass: ' jsbgujwyvxfapzvq'
    }
})

module.exports = {

    async createConfirmaCliente(req, res) {
        const {
            nome,
            telefone,
            email,
            CPF,
            CEP,
            senha,
            dataEntrada
        } = req.body;
    
        try {
            const resultsEmail = await db('cliente').where('email', email).select('*');
            const resultsCpf = await db('cliente').where('CPF', CPF).select('*');
            const resultsEmailFotografo = await db('fotografo').where('email', email).select('*');
            const resultsEmailConfirmaCliente = await db('confirmacliente').where('email', email).select('*');
            const resultsEmailConfirmaFotografo = await db('confirmafotografo').where('email', email).select('*');
            const resultsCpfConfirmaCliente = await db('confirmacliente').where('CPF', CPF).select('*');
    
            if (resultsEmail.length > 0 || resultsEmailConfirmaCliente.length > 0 || resultsEmailFotografo.length > 0 || resultsEmailConfirmaFotografo.length > 0) {
                console.error('Erro ao cadastrar cliente: Email já cadastrado.');
                return res.status(400).json({ message: "Esse e-mail já está cadastrado, faça login!" });
            }
    
            if (resultsCpf.length > 0 || resultsCpfConfirmaCliente.length  > 0) {
                console.error('Erro ao cadastrar cliente: CPF já cadastrado.');
                return res.status(400).json({ message: "Esse CPF já está cadastrado, faça login!" });
            }
    
            const hashedPass = await bcrypt.hash(senha, saltRounds);
            const [id] = await db('confirmacliente').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                senha: hashedPass,
                dataEntrada
            });
    
            const token = crypto.randomBytes(3).toString('hex');
    
            await db('token').insert({
                idCliente: id,
                token
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
                        <p style="font-size: 16px; color: black;">Esse é seu <strong style="color: black;">Código</strong> de acesso: ${token}!</p>
                        <p style="font-size: 16px; color: black;">O <strong style="color: black;">Click</strong> agradece o seu cadastro :)</p>
                    </div>
                `,
            });
    
            return res.status(200).json({ message: 'Código de confirmação de conta enviado' });
        } catch (err) {
            console.error('Erro ao cadastrar o cliente ', err);
            return res.status(500).json({ message: 'Não foi possível cadastrar o cliente' });
        }
    }
    ,

    async verificarTokenConfirmaCliente(req, res){
        const {token} = req.body;
        try{
            const tokenData = await db('token').where({token}).first();

            if (!tokenData){
                res.status(200).json({message: "Token Inválido"})
            }

            const idClienteToken = tokenData.idCliente;

            const {
                nome,
                telefone,
                email,
                CPF,
                CEP,
                senha
            } = await db ('confirmaCliente').where({id: idClienteToken}).first();

            const [id] = await db ('cliente').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                senha
            });

            await db ('token').where({token}).del();
            await db('confirmaCliente').where({ id: idClienteToken}).del();

            res.status(200).json({ message: "Token Válido."});
        }catch(err){
            console.error("Erro ao verificar o token ", err);
            res.status(500).json({message: "Algo deu errado ao verificar o token"})
         }
     } 
}