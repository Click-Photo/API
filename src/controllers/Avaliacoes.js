const db = require('../database/db');

module.exports = {
    async getAvaliacoesPendentesCliente(req, res){
        const clienteId = req.params.clienteId;

        try{
            const avaliacoes = await db('avaliacoes')
            .select(
                'avaliacoes.id',
                'avaliacoes.jobId',
                'avaliacoes.fotografoId',
                'avaliacoes.notaFotografo',
                'jobs.titulo as jobTitulo',
                'jobs.dataJob',
                'jobs.preco',
                'fotografo.nome as nomeFotografo'
            )
            .join('jobs', 'jobs.id', '=', 'avaliacoes.jobId') 
            .join('fotografo', 'fotografo.id', '=', 'avaliacoes.fotografoId')
            .where({
                'avaliacoes.clienteId': clienteId,
                'avaliacoes.clienteAvaliado': false  
            });

            res.status(200).json(avaliacoes);

        }catch(err){
            console.log("Erro ao buscar avaliações pendentes do Cliente: ", err);
            res.status(500).json("Erro ao buscar avaliações pendentes do Cliente");
        }
    },

    async getAvaliacoesPendentesFotografo(req, res){
        const fotografoId = req.params.fotografoId;

        try{
            const avaliacoes = await db('avaliacoes')
            .select(
                'avaliacoes.id',
                'avaliacoes.jobId',
                'avaliacoes.fotografoId',
                'avaliacoes.notaFotografo',
                'jobs.titulo as jobTitulo',
                'jobs.dataJob',
                'jobs.preco',
                'cliente.nome as nomeCliente'
            )
            .join('jobs', 'jobs.id', '=', 'avaliacoes.jobId') 
            .join('cliente', 'cliente.id', '=', 'avaliacoes.clienteId')
            .where({
                'avaliacoes.fotografoId': fotografoId,
                'avaliacoes.fotografoAvaliado': false  
            });

            res.status(200).json(avaliacoes);

        }catch(err){
            console.log("Erro ao buscar avaliações pendentes do Fotografo: ", err);
            res.status(500).json("Erro ao buscar avaliações pendentes do Fotografo");
        } 
    },

    //Função para o cliente avaliar o fotografo
    async avaliarFotografo(req, res){
        const jobId = req.params.jobId;
        const { notaFotografo } = req.body;

        try{
            await db('avaliacoes').update({
                notaFotografo,
                clienteAvaliado: true, //ClienteAvaliado é o campo que determina se o cliente já fez a avaliação
            })
            .where('jobId', jobId);

            res.status(200).json("Avaliação ao fotografo feita com sucesso");

        }catch(err){
            console.log("Erro ao avaliar o fotografo: ", err);
            res.status(500).json("Erro ao avaliar o fotografo");
        } 
    },

    //Função para o fotografo avaliar o cliente
    async avaliarCliente(req, res){
        const jobId = req.params.jobId;
        const { notaCliente } = req.body;

        try{
            await db('avaliacoes').update({
                notaCliente,
                fotografoAvaliado: true, //fotografoAvaliado é o campo que determina se o fotografo já fez a avaliação
            })
            .where('jobId', jobId);

            res.status(200).json("Avaliação ao cliente feita com sucesso");

        }catch(err){
            console.log("Erro ao avaliar o cliente: ", err);
            res.status(500).json("Erro ao avaliar o cliente");
        } 
    },

    async mediaAvaliacoesFotografo (req, res){
        const fotografoId = req.params.fotografoId;

        try{

            const result = await db("avaliacoes")
                .where({
                    'fotografoId': fotografoId,
                    'clienteAvaliado': true
                })
                .avg("notaFotografo as mediaNota");
            
            const mediaNota = result[0].mediaNota ? parseFloat(result[0].mediaNota).toFixed(1) : 'Sem avaliações';

            res.status(200).json(mediaNota);

        }catch(err){
            console.log("Erro ao buscar a média da nota do fotografo: ", err);
            res.status(500).json("Erro ao buscar a média da nota do fotografo");
        }
    },

    async mediaAvaliacoesCliente (req, res){
        const clienteId = req.params.clienteId;

        try{
            const result = await db("avaliacoes")
                .where({
                    'clienteId': clienteId,
                    'fotografoAvaliado': true
                })
                .avg("notaFotografo as mediaNota");
            
            const mediaNota = result[0].mediaNota ? parseFloat(result[0].mediaNota).toFixed(1) : 'Sem avaliações';

            res.status(200).json(mediaNota);

        }catch(err){
            console.log("Erro ao buscar a média da nota do cliente: ", err);
            res.status(500).json("Erro ao buscar a média da nota do cliente");
        }
    }
      
};