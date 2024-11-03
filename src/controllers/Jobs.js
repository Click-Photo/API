const jobService = require('../services/jobService');
require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_KEY_TEST}`);

module.exports = {
    async getAllJobs(req, res) {
        try {
            const jobs = await jobService.getAllJobs();
            res.status(200).json(jobs);
        } catch (err) {
            console.error("Erro ao coletar informações sobre os jobs", err);
            res.status(500).json({ message: "Erro ao coletar informações!" });
        }
    },

    async getAllJobsCliente(req, res) {
        const { id } = req.params;
        
        try {
            const { jobs, totalJobs } = await jobService.getAllJobsCliente(id);
            res.status(200).json({ jobs, totalJobs });
        } catch (err) {
            console.error("Erro ao coletar informações sobre os jobs", err);
            res.status(500).json({ message: "Erro ao coletar informações!" });
        }
    },

    async getJobsFotografo(req, res) {
        const { id } = req.params;
        
        try {
            const { jobs, totalJobs } = await jobService.getJobsFotografo(id);
            res.status(200).json({ jobs, totalJobs });
        } catch (err) {
            console.error("Erro ao coletar informações sobre os jobs", err);
            res.status(500).json({ message: "Erro ao coletar informações!" });
        }
    },

    async createJob(req, res) {
        const {
            idCliente,
            dataJob,
            titulo,
            descricao,
            local,
            preco
        } = req.body;

        try {
            const dataCriacao = new Date();
            const id = await jobService.createJob({
                idCliente,
                dataJob,
                dataCriacao,
                titulo,
                descricao,
                local,
                status: 'Pendente',
                preco
            });

            res.status(200).json({ message: "Job criado!", id });
        } catch (err) {
            console.error("Erro ao criar Job", err);
            res.status(500).json({ message: 'Erro ao criar Job' });
        }
    },
 
    async updateJob(req, res) {
        const { id } = req.params;
        const {
            dataJob,
            titulo,
            descricao,
            local,
            preco
        } = req.body;

        try {
            await jobService.updateJob(id, {
                dataJob,
                titulo,
                descricao,
                local,
                preco
            });
            return res.status(200).json({ message: 'Job atualizado com sucesso!' });
        } catch (err) {
            console.error('Erro ao realizar a atualização do job', err);
            res.status(400).json({ message: 'Erro ao realizar a alteração do job.' });
        }
    },
    
    async deleteJob(req, res) {
        const { id } = req.params;

        try {
            await jobService.deleteJob(id);
            res.status(200).json({ message: 'Job excluído com sucesso!' });
        } catch (err) {
            console.error('Erro ao excluir job', err);
            res.status(500).json({ message: 'Erro ao realizar a exclusão do job' });
        }
    },

    async finalizarJob(req, res) {
        const { id } = req.params; // ID do Job
    
        try {
            const job = await jobService.getEspecificJob(id);
            // console.log("jobs", job)
            // Cria a Payment Intent para o pagamento
            const paymentIntent = await jobService.processPayment(job, job[0].idFotografo);
    
            res.status(200).json({
                message: 'Job finalizado com sucesso, pagamento iniciado.',
                clientSecret: paymentIntent.client_secret // Client secret para o frontend concluir o pagamento
            });
        } catch (err) {
            console.error('Erro ao finalizar job e processar pagamento', err);
            res.status(500).json({ message: 'Erro ao finalizar job e processar pagamento.' });
        }
    },

    async confirmarPagamento(req, res) {
        const { jobId } = req.params;
        const { paymentIntentId, idCliente, idFotografo } = req.body;
    
        try {
            // Recupera a Payment Intent para verificar o status
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
            if (paymentIntent.status === 'succeeded') {
                // Atualiza o status do job para "finalizado"
                await jobService.atualizarStatusJob(jobId, 'finalizado');
                await jobService.createAvaliacoes(jobId, idCliente, idFotografo);
    
                res.status(200).json({ message: 'Job finalizado com sucesso após pagamento.' });
            } else {
                res.status(400).json({ message: 'Pagamento não confirmado.' });
            }
        } catch (err) {
            console.error('Erro ao confirmar pagamento e finalizar o job', err);
            res.status(500).json({ message: 'Erro ao confirmar pagamento e finalizar o job.' });
        }
    }

    
};
