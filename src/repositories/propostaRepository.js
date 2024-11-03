const db = require('../database/db');
const nodemailer = require('nodemailer');

class PropostaRepository {
    async getAllPropostas() {
        return await db('proposta').select('*');
    }

    async createProposta(idJobs, idCliente, idFotografo) {
        return await db('proposta').insert({
            idCliente,
            idFotografo,
            idJobs
        });
    }

    async deleteProposta(id) {
        await db('proposta').where({ id }).del();
    }

    async getAllPropostaCliente(idCliente) {
        return await db('proposta')
            .join('jobs', 'proposta.idJobs', 'jobs.id')
            .join('user', 'proposta.idFotografo', 'user.id')
            .select(
                'proposta.id',
                'proposta.idJobs',
                'proposta.idCliente',
                'proposta.idFotografo',
                'proposta.status',
                'jobs.dataJob',
                'jobs.preco',
                'user.nome as nomeFotografo'
            )
            .where({ 'proposta.idCliente': idCliente });
    }

    async getPropostaJob(idJob) {
        return await db('proposta')
            .join('jobs', 'proposta.idJobs', 'jobs.id')
            .join('user', 'proposta.idFotografo', 'user.id')
            .select(
                'proposta.id',
                'proposta.idJobs',
                'proposta.idCliente',
                'proposta.idFotografo',
                'proposta.status',
                'jobs.dataJob',
                'jobs.preco',
                'user.nome as nomeFotografo'
            )
            .where({ 'proposta.idJobs': idJob })
            .andWhere(builder => {
                builder.whereNot({ 'proposta.status': 'Recusado' })
                    .orWhereNull('proposta.status');
            });
    }

    async getAllPropostaFotografo(idFotografo) {
        return await db('proposta').select('*').where({ idFotografo });

    }

    async getAllPropostaJob(idJobs) {
        return await db('proposta').select('*').where('idJobs', idJobs);
    }

    async aceitarProposta(id, idJobs, idFotografo) {
        await db('jobs').where('id', idJobs).update({
            status: 'Aceito',
            idFotografo
        });
        await db('proposta').where({ id }).update({
            status: 'Aceito'
        });
    }

    async recusarProposta(id) {
        await db('proposta').where({ id }).update({
            status: 'Recusado'
        });
    }

    async sendEmail(email, subject, htmlContent) {
        await transporter.sendMmail({
            from: '',
            to: email,
            subject: subject,
            html: htmlContent

        });
    }
};

module.exports = new PropostaRepository();