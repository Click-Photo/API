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
    async getAllClientes(req, res){
        try{
            const clientes = await db('cliente').select('*');
            res.status(200).json(clientes);
        } catch(err){
            console.error('clientes não encontrados', err);
            res.status(500).json({message: "Clietes não encontrados"})
        }
    },

    async getEspecifCliente(req, res){
        const { id } = req.params;

        try{
            const clientes = await db('cliente').select('*').where({ id });
            res.status(200).json(clientes);
        } catch(err){
            console.error('clientes não encontrados', err);
            res.status(500).json({message: "Clietes não encontrados"})
        }
    },

    async criarCliente(req, res) {
        const { nome, telefone, email, CPF, CEP, senha } = req.body;
        
        try {
            const hashedPassword = await bcrypt.hash(senha, 10);
            const dataAtual = moment().format('YYYY-MM-DD');

            const [id] = await db('cliente').insert({
                nome,
                telefone,
                email,
                CPF,
                CEP,
                senha : hashedPassword,
                dataEntrada : dataAtual
            }); 
        
            res.status(201).json({ id, message: 'Cliente criado com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao criar cliente.');
        }
    },
    
    async updateClientes (req,res){
        
        const { id } = req.params;

        const{
            nome,
            telefone,
            email,
            CEP,
        } = req.body;

        try{
            await db('cliente')
            .where({id})
            .update({
                nome,
                telefone,
                email,
                CEP
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
            await db('jobs').where({idCliente}).del();
            await db('cliente').where({id}).del();
            res.status(200).json({ message: 'Cliente excluido com sucesso!'})
        } catch(err){
            console.error('Houve um erro ao realizar a exclusão do cliente')
            res.status(500).json({ message: 'Houve um problema para realizar a exclusão do cliente.'})
        }
    },

    async  requisitarResetSenha(req, res) {
    const { email } = req.body;
    let emailCadastrado = false;

    try {
        const resultCliente = await db('cliente').where({ email }).select('*');
        const resultFotografo = await db('fotografo').where({ email }).select('*');

        console.log(resultCliente);
        console.log(resultFotografo);

        if (resultCliente.length > 0) {
            const cliente = await db('cliente').select("id").where({ email }).first();
            const idCliente = cliente.id;
            const token = crypto.randomBytes(4).toString('hex');
            await db('token').insert({
                idCliente,
                token
            });

            await transporter.sendMail({
                from: 'seu-email@dominio.com',
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
                    </div>
                `,
            });

            emailCadastrado = true;
        }

        if (resultFotografo.length > 0) {
            const fotografo = await db('fotografo').select("id").where({ email }).first();
            const idFotografo = fotografo.id;
            const token = crypto.randomBytes(4).toString('hex');
            await db('token').insert({
                idFotografo,
                token
            });

            await transporter.sendMail({
                from: 'seu-email@dominio.com',
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
                    </div>
                `,
            });

            emailCadastrado = true;
        }

        if (!emailCadastrado) {
            console.log("Email não cadastrado");
            return res.status(400).json({ message: 'Email não cadastrado.' });
        }
        
        return res.status(200).json({ message: 'Código para redefinição de senha enviado' });

    } catch (err) {
        console.error('Erro ao enviar o código de redefinição de senha:', err);
        return res.status(500).json({ message: 'Houve um erro para enviar o código de redefinição de senha' });
    }
},


    async verificarToken (req, res) {
        const { token } = req.body;
        let validToken = false;

        try{
            const result = await db('token').where({token}).select('*');

            if(result.length < 1){
                console.log("Token inválido! " + validToken);
                res.status(404).json({message: 'Token inválido! Favor digite novamente!', validToken: false});
            }

            await db('token').where({token}).del();
            validToken = true;
            console.log("Token Válido!" + validToken)
            res.status(200).json({ message: 'Token válido: ' + validToken})

        } catch(err){
            console.error("Erro na validação de token!", err);
            res.status(500).json({ message: 'Erro ao validar o token, favor verificar com admnistrador.', validToken: true});
        }
    },

    async resetSenha(req, res) {
        const { email } = req.params;
        console.log(email);
        const { senha, confirmaSenha } = req.body;

        const resultCliente = await db('cliente').where({ email }).select('*');
        const resultFotografo = await db('fotografo').where({ email }).select('*');

        

        try{
            if(senha != confirmaSenha){
                return res.status(400).json({message: 'Senhas diferentes!'})
            }

            if (resultCliente.length){
                const hashedPass = await bcrypt.hash(senha, saltRounds);
                await db('cliente').where({email: email}).update({senha: hashedPass})
                res.status(200).json({message: 'Senha trocada com sucesso!'})
            }
            
            if (resultFotografo.length){
                const hashedPass = await bcrypt.hash(senha, saltRounds);
                await db('fotografo').where({emai: emaill}).update({senha: hashedPass})
                res.status(200).json({message: 'Senha trocada com sucesso!'})
            }
            
        } catch (err){
            console.error("Erro ao redefinir senha! ",err);
            res.status(500).json({message: 'Erro ao redefinir a senha!'})
        }
    },

    async autenticacaoLogin(req, res) {

        const { email, senha } = req.body;
    
        try {
            const resultCliente = await db('cliente').where({ email }).select('*');
            const resultFotografo = await db('fotografo').where({ email }).select('*');
    
            if (resultCliente.length === 0 && resultFotografo.length === 0) {
                return res.status(401).json({ message: 'Email não localizado, confira novamente ou cadastra-se' });
            }
    
            const user = resultCliente.length > 0 ? resultCliente[0] : resultFotografo[0];
            const senhaIncritografada = user.senha;
    
            console.log('Senha fornecida:', senha);
            console.log('Senha armazenada (hash):', senhaIncritografada);
    
            const comparaSenha = await bcrypt.compare(senha, senhaIncritografada);
    
            if (comparaSenha) {
                const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
                return res.json({ auth: true, token, userType: resultCliente.length > 0 ? 'cliente' : 'fotografo', user });
            } 
    
            return res.status(401).json({ message: 'Senha inserida incorretamente.' });
        } catch (err) {
            console.error("Erro ao logar: ", err);
            res.status(500).json({ message: 'Erro ao logar, entre em contato com o administrador.', err });
        }
    },

}
