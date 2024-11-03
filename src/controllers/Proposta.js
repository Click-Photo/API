const propostaService = require('../services/propostaService');
const PropostaService = require('../services/propostaService')


module.exports = {
    async getAllPropostas (req,res){
        try{
            const propostas = await propostaService.getAllPropostas();
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
            await propostaService.createProposta(idJobs, idCliente, idFotografo);
            res.status(200).json({message: "Proposta realizada"})
        } catch(err) {
            console.error("Erro ao criar proposta " , err);
            return res.status(500).json({message: "Erro ao criar o proposta"})
        }
    },

    async deleteProposta (req,res){
        const{id} = req.params;

        try{
            await propostaService.deleteProposta(id);
            res.status(200).json({message: 'Proposta excluída com sucesso! '})
        } catch (err) {
            console.error("Erro para deletar proposta");
            res.status(500).json({message: "Erro ao deletar proposta"});
        }
    },

    async getAllPropostaCliente(req, res) {
        const { idCliente } = req.params;
    
        try {
            const propostas = await propostaService.getAllPropostaCliente(idCliente);
            res.status(200).json(propostas);
        } catch (error) {
            console.log("Erro ao buscar propostas: ", error);
            res.status(500).json({ message: "Erro ao buscar propostas" });
        }
    },

    async getPropostaJob(req, res) {
        const { idJob } = req.params;
    
        try {
            
            const propostas = await propostaService.getAllPropostaJob(idJob);
            res.status(200).json(propostas);
        } catch (error) {
            console.log("Erro ao buscar propostas: ", error);
            res.status(500).json({ message: "Erro ao buscar propostas" });
        }
    },

    async getAllPropostaFotografo (req,res){
        const { idFotografo } = req.params;

        
        try {
            const  propostas = await propostaService.getAllPropostaFotografo(idFotografo);
            res.status(200).json(propostas)
        } catch (error) {
            console.log("Erro ao buscar propostas: ", error);
            res.status(500).json({message: "Erro ao buscar propostas"});
        }
    },

    async getAllPropostaJob(req,res){
        const { idJobs } = req.params;
        
        
        try{
            const propostas = await propostaService.getAllPropostaJob(idJobs);
            res.status(200).json(propostas);
        } catch (err){
            console.error('Propostas não encontradas', err);
             res.status(500).json({message: 'Propostas não encontradas.'})
        }
    },

    async aceitarProposta (req, res){
        const {id} = req.params;
        const {idJobs, idFotografo, nomeCliente, telefoneCliente } = req.body;

        try{
            await propostaService.aceitarProposta(  id, idJobs, idFotografo, nomeCliente, telefoneCliente );
            return res.status(200).json({message: "Proposta aceita com sucesso! "})
        }  catch (err) {
            console.error("Erro ao aceitar proposta", err);
            res.status(500).json({message: "Erro ao aceitar proposta"});
        }
    },

    async recusarProposta (req, res){
        const {id} = req.params;
        const { idFotografo, nomeCliente } = req.body;
        
        try{
           await propostaService.recusarProposta(id, idFotografo, nomeCliente );

            res.status(200).json({message: "Job recusado com sucesso"})
        }catch(err){
            console.error('Erro ao recusar a proposta', err)
            res.status(500).json({message: 'Erro ao recusar a proposta! '})
        }
    },
}