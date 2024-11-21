const jobRepository = require('../repositories/jobRepository');
const userRepository = require('../repositories/userRepository');
const { exec } = require('child_process');

async function getTrendingTopics() {
    const jobs = await jobRepository.getAllJobs();
    const jobsJson = JSON.stringify(jobs);

    return new Promise((resolve, reject) => {
        const process = exec(`python3 src/python_scripts/analyze_trending.py`, (error, stdout, stderr) => {
            if (error) {
                console.error("Erro ao executar o script Python:", error);
                return reject(error);
            }
            if (stderr) {
                console.error("Stderr:", stderr);
            }
            try {
                const trendingTopics = JSON.parse(stdout);
                resolve(trendingTopics);
            } catch (err) {
                reject(err);
            }
        });
        process.stdin.write(jobsJson);
        process.stdin.end();
    });
}

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

    async updateTrendingJobs() {
        try {
            const trendingTopics = await getTrendingTopics(); 
            const jobs = await jobRepository.getAllJobs();
    
            for (const job of jobs) {
                // Verifica se o job contém um tópico em alta
                const isTrending = trendingTopics.some(topic => 
                    job.titulo.toLowerCase().includes(topic.topic.toLowerCase()) || 
                    job.descricao.toLowerCase().includes(topic.topic.toLowerCase())
                );
    
                // Atualiza o campo isTrending no banco de dados
                await jobRepository.updateJobTrendingStatus(job.id, isTrending);
            }
        } catch (error) {
            console.error("Erro ao atualizar os jobs com isTrending:", error);
        }
    }
}

module.exports = new JobService();
