const db = require('../database/db');

module.exports = {

    async getAllJobs (req, res) {
        try {
            const jobs = await db('jobs')
                .select('jobs.*', 'cliente.nome as nomeCliente')
                .join('cliente', 'jobs.idCliente', '=', 'cliente.id')
                .whereNot('jobs.status', 'Finalizado');
            res.status(200).json(jobs);
        } catch (err) {
            console.error("Erro ao coletar informações sobre os jobs", err);
            res.status(500).json({ message: "Erro ao coletar informações!" });
        }
    },

    async getAllJobsCliente (req, res) {
        const { id } = req.params;
        
        try {
            const jobs = await db('jobs').select('*').where({ idCliente: id });
    
            const [{ totalJobs }] = await db('jobs').where({ idCliente: id }).count('id as totalJobs');
    
            res.status(200).json({ jobs, totalJobs });
        } catch (err) {
            console.error("Erro ao coletar informações sobre os jobs", err);
            res.status(500).json({ message: "Erro ao coletar informações!" });
        }
    },

    async getJobsFotografo (req, res) {
        const { id } = req.params;
        
        try {
            const jobs = await db('jobs').select('*').where({ idFotografo: id });
    
            const [{ totalJobs }] = await db('jobs').where({ idFotografo: id }).count('id as totalJobs');
    
            res.status(200).json({ jobs, totalJobs });
        } catch (err) {
            console.error("Erro ao coletar informações sobre os jobs", err);
            res.status(500).json({ message: "Erro ao coletar informações!" });
        }
    },

    async createJob (req, res){
        const{
            idCliente,
            dataJob,
            dataCriacao,
            titulo,
            descricao,
            local,
            preco
        } = req.body;

        try{
            const dataCriacao = new Date();
            const [id] = await db('jobs').insert({
                idCliente,
                dataJob,
                dataCriacao,
                titulo,
                descricao,
                local,
                status: 'Pendente',
                preco
            })

            res.status(200).json({message: "Job criado!"})
            
        } catch (err){
            console.error("Erro ao criar Job",err);
            res.status(500).json({message: 'Erro ao criar Job'})
        }
    },
 
    async updateJob (req, res){
        const{id} = req.params;
        const{
            dataJob,
            titulo,
            descricao,
            local,
            preco
        } = req.body;

        try{
            await db("jobs").where({id}).update({
                dataJob,
                titulo,
                descricao,
                local,
                preco
            });

            return res.status(200).json({message: 'Job atualizado com sucesso!'});

        } catch (err){
            console.error('Erro ao realizar a atualização do job', err);
            res.status(400).json({message: 'Erro ao realizar a alterção do job.'})

        }
    },
    
    async deleteJob(req, res){
        const {id} = req.params;

        try{
            await db ('jobs').where({id}).del();
            await db ('propostas').where('idJobs',id).del();
            res.status(200).json({message: 'Job excluído com sucesso! '})
        } catch (err){
            console.error('Erro ao excluir job', err)
            res.status(500).json({message: 'Erro ao realizar a exclusão do job'});
        }
    },

    async finalizarJob(req, res){
        const {id} = req.params;
        try{
            await db("jobs").where({id}).update({
                status: "Finalizado"
            });

            const job = await db('jobs').where('id', id).first();

            await db('avaliacoes').insert({
                jobId: id,
                clienteId: job.idCliente,
                fotografoId: job.idFotografo,
                clienteAvaliado: false,
                fotografoAvaliado: false
            });
        

            await db ('proposta').select('*').where('idJobs',id).del()
            res.status(200).json({message: 'Job finalizado com sucesso.'})
        } catch(err){
            console.error('Erro ao finalizar job', err)
            res.status(500).json({message: 'Erro ao finalizar job'})
        }
    }
}