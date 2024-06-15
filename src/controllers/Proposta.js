const db = require ('../database/db');
const nodemailer = require('nodemailer');

const transporter =  nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'think.studio.tattoo@gmail.com',
        pass: 'jsbgujwyvxfapzvq'
    }
});

module.exports = {
    async getAllPropostas (req,res){
        try{
            const propostas = await db ('proposta').select('*');
            res.status(200).json(propostas);
        } catch (err){
            console.error('Propostas não encontradas', err);
            res.status(500).json({message: 'Jobs não encontrados.'})
        }
    },

    async createProposta (req,res){

        const {idJobs} = req.params;

        const{
            idFotografo,
            idCliente
        } = req.body;

        try{

            const validarJob = await db('jobs').select('status').where('id',idJobs)
            const statusJob = validarJob[0].status

            if(statusJob == "Aceito" || statusJob == "Finalizado"){
                return res.status(400).json({message: "Job com o status aceito ou finalizado não pode receber mais propostas!"})
            }

            const {id} = await db('proposta')
            .insert({
                idJobs,
                idCliente,
                idFotografo
            })

            res.status(200).json({message: "Proposta realizada"})
        } catch(err) {
            console.error("Erro ao criar proposta " , err);
            return res.status(500).json({message: "Erro ao criar o proposta"})
        }
    },

    async deleteProposta (req,res){
        const{id} = req.params;

        try{
            await db ('proposta').where({id}).del();
            res.status(200).json({message: 'Proposta excluída com sucesso! '})
        } catch (err) {
            console.error("Erro para deletar proposta");
            res.status(500).json({message: "Erro ao deletar proposta"});
        }
    },

    async getAllPropostaCliente (req,res){
        const { idCliente } = req.params;

        
        try {
            const  propostas = await db("proposta").select("*").where({idCliente: idCliente});
            res.status(200).json(propostas)
        } catch (error) {
            console.log("Erro ao buscar propostas: ", error);
            res.status(500).json({message: "Erro ao buscar propostas"});
        }
    },

    async getAllPropostaFotografo (req,res){
        const { idFotografo } = req.params;

        
        try {
            const  propostas = await db("proposta").select("*").where({idFotografo: idFotografo});
            res.status(200).json(propostas)
        } catch (error) {
            console.log("Erro ao buscar propostas: ", error);
            res.status(500).json({message: "Erro ao buscar propostas"});
        }
    },

    async getAllPropostaJob(req,res){
        const { idJobs } = req.params;
        
        
        try{
            const validarJob = await db('jobs').select('status').where('id',idJobs)
            const statusJob = validarJob[0].status

            if(statusJob == "Aceito"){
                return res.status(400).json({message: "Job com o status aceito!"})
            }

            const propostas = await db('proposta').select('*').where('idJobs', idJobs);
            res.status(200).json(propostas);
        } catch (err){
            console.error('Propostas não encontradas', err);
             res.status(500).json({message: 'Propostas não encontradas.'})
        }
    },

    async aceitarProposta (req, res){
        const {id} = req.params;
        const {idJobs, idFotografo} = req.body;

        
        try{

            const validarJob = await db('jobs').select('status').where('id', idJobs);
            const validarProposta = await db('proposta').select('status').where('id', id);

            const statusJob = validarJob[0].status
            const statusProposta = validarProposta[0].status

            if (statusJob == "Aceito" || statusProposta == "Aceito"){
                return res.status(400).json({message: "Job com o status aceito!"})
            }

            await db('jobs').where('id', idJobs).update({
                status: "Aceito",
                idFotografo
            });

            await db('proposta').where({id}).update({
                status: 'Aceito'
            })

            const emailResult = await db('fotografo').select('email').where({ id: idFotografo });
            const email = emailResult.length > 0 ? emailResult[0].email : null;

            if (!email) {
                return res.status(400).json({ message: "Fotógrafo não encontrado ou email não disponível" });
            }
            await transporter.sendMail({
                from:'',
                to: email,
                subject: 'Atualização de proposta!',
                html: `
                    <div style="background-color: black; padding: 8px 20px; text-align: center;">
                        <h2 style="font-size: 24px; color: #fff; font-family: 'Baloo', sans-serif; font-weight: 700;">Click</h2>
                    </div>
                    <div style="padding: 20px; background-color: white;">
                        <p style="font-size: 16px; color: black;">Olá!</p>
                        <p style="font-size: 16px; color: black;">Uma de suas propostas foi aceita, entre na sua conta para verificar</p>
                        <p style="font-size: 16px; color: black;"><strong style="color: black;">Click</strong> está à disposição. :)</p>
                    </div>
                `,
            })

            return res.status(200).json({message: "Proposta aceita com sucesso! "})
        }  catch (err) {
            console.error("Erro ao aceitar proposta", err);
            res.status(500).json({message: "Erro ao aceitar proposta"});
        }
    },

    async recusarProposta (req, res){
        const {id} = req.params;
        
        try{
            await db('proposta').where({id}).update({
                status: "Recusado"
            });

            res.status(200).json({message: "Job recusado com sucesso"})
        }catch(err){
            console.error('Erro ao recusar a proposta', err)
            res.status(500).json({message: 'Erro ao recusar a proposta! '})
        }
    },
}