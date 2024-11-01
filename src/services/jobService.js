const jobRepository = require('../repositories/jobRepository');

class JobService {
    async getAllJobs() {
        return await jobRepository.getAllJobs();
    }

    async getAllJobsCliente(id) {
        return await jobRepository.getAllJobsCliente(id);
    }

    async getJobsFotografo(id) {
        return await jobRepository.getJobsFotografo(id);
    }

    async createJob(jobData) {
        return await jobRepository.createJob(jobData);
    }

    async getEspecificJob(id) {
        return await jobRepository.getEspecificJob(id);
    }

    async updateJob(id, jobData) {
        return await jobRepository.updateJob(id, jobData);
    }

    async deleteJob(id) {
        return await jobRepository.deleteJob(id);
    }

    async finalizarJob(id) {
        const job = await jobRepository.finalizarJob(id);
        return job;
    }

    async createAvaliacoes(jobId, clienteId, fotografoId) {
        await jobRepository.createAvaliacoes(jobId, clienteId, fotografoId);
    }

    async processPayment(job, fotografoId) {
        return await jobRepository.createPaymentIntent(parseFloat(job[0].preco), job[0].id, fotografoId);
    }
    
    
    async atualizarStatusJob(jobId, status) {
        return await jobRepository.updateStatus(jobId, status);
    }
    
}

module.exports = new JobService();
