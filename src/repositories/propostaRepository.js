const db = require('../database/db');
const nodemailer = require('nodemailer');

module.exports = {
    async getAllPropostas (proposta){
        try{
            const propostas = await db('proposta').select('*')
            return{message: propostas}
        } catch(err){
            console.error(err)
            return{message: 'Proposta não encontradas'}
        }
    },

    async createProposta(proposta, idJobs){
        const{
            idFotografo,
            idCliente,
        } = proposta;
        try{
            const validarJob = await db('jobs').select('status').where('id', idJobs)
            const statusJob = validarJob[0].status

            if(statusJob == "Aceito" || statusJob == "Finalizado"){
                return {message: "Job não pode mais receber propostas."}
            }

            const {id} = await db('proposta')
            insert({
                idJobs,
                idCliente,
                idFotografo
            })

            return {message: "Proposta realizada"}
        } catch(err){
            console.error(err);
            return {message: "Erro ao realizar a proposta"}
        }
    },

    async deleteProposta(proposta){
        const {id} = proposta;
        try{
            await db('proposta').where('id', id).del();
            return {message: "Proposta excluída"}
        } catch(err){
            console.error(err);
            return {message: "Erro ao excluir a proposta"}
        }
    },

    async getAllPropostaCliente(id){
        const {idCliente} = id;

        try{
            const propostas = await db('proposta')
            .join('jobs', 'proposta.idJobs', 'jobs.id')
            .join('fotografo', 'proposta.idFotografo', 'fotografo.id')
            .select(
                'proposta.id',
                'proposta.idJobs',
                'proposta.idCliente',
                'proposta.idFotografo',
                'proposta.status',
                'jobs.dataJob',
                'jobs.preco',
                'fotografo.nome as nomeFotografo'
            )
            .where({'proposta.idCliente': idCliente});

            const totalPropostasPorJob = await db('proposta')
                .select('idJobs')
                .count('idJobs as totalPropostas')
                .groupBy('idJobs')
                .where({ idCliente: idCliente });
    
            // Mapeia as propostas incluindo a contagem de propostas para cada job
            const propostasComContagem = propostas.map(proposta => {
                const contagem = totalPropostasPorJob.find(tp => tp.idJobs === proposta.idJobs);
                return { ...proposta, totalPropostas: contagem ? contagem.totalPropostas : 0 };
            });

            return{propostasComContagem}
        } catch(err){
            console.error(err);
            return {message: "Erro ao buscar propostas."}
        }
    },

    async getPropostaJob(id){
        const {idJobs} = id;

        try{
            const propostas = await db('proposta')
                .join('jobs', 'proposta.idJobs', 'jobs.id')
                .join('fotografo', 'proposta.idFotografo', 'fotografo.id')
                .select(
                    'proposta.id',
                    'proposta.idJobs',
                    'proposta.idCliente',
                    'proposta.idFotografo',
                    'proposta.status',
                    'jobs.dataJob',
                    'jobs.preco',
                    'fotografo.nome as nomeFotografo'
                )
                .where({ 'proposta.idJobs': idJob })
                .andWhere(builder => {
                    builder.whereNot({ 'proposta.status': 'Recusado' })
                           .orWhereNull('proposta.status');
                });
    
            return{propostas};
        } catch(err){
            console.error(err);
            return{ message: "Erro ao buscar propostas" };
        }
    },

    async getAllPropostaFotografo(id){
        const {idFotografo} = id;

        try{
            const proposta = await db("proposta").select("*").where({idFotografo:idFotografo});
            return {proposta}
        }catch(err){
            console.error(err);
            return {message: "Erro ao buscar propostas"}
        }
    },

    async getAllPropostaJob(id){
        const {idJobs} = id;
        try{
            const validarJob = await db('jobs').select('status').where('id',idJobs)
            const statusJob = validarJob[0].status

            if(statusJob == "Aceito"){
                return {message: "Job com status aceito. "}
            }
        } catch(err){
            console.error(err);
            return {message: "Erro ao validar status do job"}
        }
    }


}