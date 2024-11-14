const jobRepository = require('../repositories/jobRepository');
const userRepository = require('../repositories/userRepository');

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

    async getEspecificJob(id) {
        return await jobRepository.getEspecificJob(id);
    }
    async atualizarStatusJob(jobId, status) {
        return await jobRepository.updateStatus(jobId, status);
    }
    
    async createJob(jobData) {
        const [idCliente] = jobData
        const role = await userRepository.get(idCliente);
        
        if (role != "Cliente"){
            return {message: "Impossível criar job"}
        }

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
        return await jobRepository.createPaymentIntent(parseFloat(job[0].preco), job[0].id, fotografoId);
    }
    
    
    async atualizarStatusJob(jobId, status) {
        return await jobRepository.updateStatus(jobId, status);
    }
}

module.exports = new JobService();
