const db = require('../database/db');

module.exports = {
    async getAvaliacoesPendentesCliente(clienteId) {
        return db('avaliacoes')
            .select(
                'avaliacoes.id',
                'avaliacoes.jobId',
                'avaliacoes.fotografoId',
                'avaliacoes.notaFotografo',
                'jobs.titulo as jobTitulo',
                'jobs.dataJob',
                'jobs.preco',
                'user.nome as nomeFotografo'
            )
            .join('jobs', 'jobs.id', '=', 'avaliacoes.jobId')
            .join('user', 'user.id', '=', 'avaliacoes.fotografoId')
            .where({
                'avaliacoes.clienteId': clienteId,
                'avaliacoes.clienteAvaliado': false
            });
    },

    async getAvaliacoesPendentesFotografo(fotografoId) {
        return db('avaliacoes')
            .select(
                'avaliacoes.id',
                'avaliacoes.jobId',
                'avaliacoes.fotografoId',
                'avaliacoes.notaFotografo',
                'jobs.titulo as jobTitulo',
                'jobs.dataJob',
                'jobs.preco',
                'user.nome as nomeCliente'
            )
            .join('jobs', 'jobs.id', '=', 'avaliacoes.jobId')
            .join('user', 'user.id', '=', 'avaliacoes.clienteId')
            .where({
                'avaliacoes.fotografoId': fotografoId,
                'avaliacoes.fotografoAvaliado': false
            });
    },

    async avaliarFotografo(jobId, notaFotografo) {
        return db('avaliacoes').update({
            notaFotografo,
            clienteAvaliado: true
        }).where('jobId', jobId);
    },

    async avaliarCliente(jobId, notaCliente) {
        return db('avaliacoes').update({
            notaCliente,
            fotografoAvaliado: true
        }).where('jobId', jobId);
    },

    async mediaAvaliacoesFotografo(fotografoId) {
        return db("avaliacoes")
            .where({
                'fotografoId': fotografoId,
                'clienteAvaliado': true
            })
            .avg("notaFotografo as mediaNota")
            .count("notaFotografo as totalAvaliacoes");
    },

    async mediaAvaliacoesCliente(clienteId) {
        return db("avaliacoes")
            .where({
                'clienteId': clienteId,
                'fotografoAvaliado': true
            })
            .avg("notaCliente as mediaNota")
            .count("notaCliente as totalAvaliacoes");
    }
};
