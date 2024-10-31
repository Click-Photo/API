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
        const paymentIntent = await jobRepository.createPaymentIntent(job.preco, fotografoId);
        return paymentIntent;
    }
}

module.exports = new JobService();