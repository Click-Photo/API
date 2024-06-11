const db = require ('../database/db');

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
            const  [id] = await db('proposta')
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

    

}