const db = require('../database/db');
require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_KEY_TEST}`);

class JobRepository {
    async getAllJobs() {
        return await db('jobs')
            .select('jobs.*', 'user.nome as nomeCliente')
            .join('user', 'jobs.idCliente', '=', 'user.id')
            .whereNot('jobs.status', 'Finalizado')
            .orderBy('isTrending', 'desc');
    }

    async updateJobTrendingStatus(jobId, isTrending) {
        return await db('jobs')
            .where('id', jobId)
            .update({ isTrending });
    }

    async getAllJobsCliente(id) {
        const jobs = await db('jobs').select('*').where({ idCliente: id });
        const [{ totalJobs }] = await db('jobs').where({ idCliente: id }).count('id as totalJobs');
        return { jobs, totalJobs };
    }

    async validarStatusJob(idJobs) {
        const [job] = await db('jobs').select('status').where('id', idJobs);
        return job ? job.status : null; 
    }

    async getEspecificJob(id) {
        return await db('jobs')
        .join('user', 'jobs.idFotografo', '=', 'user.id')
        .where('jobs.id', id) 
        .select('jobs.*', 'user.stripeAccountId');
    }

    async updateStatus(jobId, status) {
        return await db('jobs').where({ id: jobId }).update({ status });
    }

    async getJobsFotografo(id) {
        const jobs = await db('jobs').select('*').where({ idFotografo: id });
        const [{ totalJobs }] = await db('jobs').where({ idFotografo: id }).count('id as totalJobs');
        return { jobs, totalJobs };
    }

    async createJob(jobData) {
        const [id] = await db('jobs').insert(jobData);
        return id;
    }

    async updateJob(id, jobData) {
        await db("jobs").where({ id }).update(jobData);
    }

    async deleteJob(id) {
        await db('jobs').where({ id }).del();
        await db('propostas').where('idJobs', id).del();
    }

    async finalizarJob(id) {
        await db("jobs").where({ id }).update({ status: "Finalizado" });
        return await db('jobs').where({ id }).first();
    }

    async createAvaliacoes(jobId, clienteId, fotografoId) {
        await db('avaliacoes').insert({
            jobId,
            clienteId,
            fotografoId,
            clienteAvaliado: false,
            fotografoAvaliado: false
        });
    }

    async getFotografo(id) {
        return await db('user').where({ id }).first();
    }

    async createPaymentIntent(amount, fotografoId) {
        const fotografo = await this.getFotografo(fotografoId);
        if (!fotografo || !fotografo.stripeAccountId) {
            throw new Error('Fotógrafo não possui conta conectada ao Stripe.');
        }

        return await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Valor em centavos
            currency: 'brl',
            payment_method_types: ['card'],
            transfer_data: {
                destination: fotografo.stripeAccountId,
            }
        });
    }
}

module.exports = new JobRepository();
