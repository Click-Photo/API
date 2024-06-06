const db = require('../database/db');

module.exports = {

    async getAllJobs (req, res){
        try{
            const jobs = await db('jobs').select('*');
            res.status(200).json(jobs)
        }catch(err){
            console.error("Erro ao coletar informações sobre os jobs" , err)
            res.status(500).json({message: "Erro ao coletar informções! "})
        }
    },

    async createJob (req, res){


        const{
            idFotografo,
            dataJob,
            titulo,
            descricao,
            local,
            preco
        } = req.body;

        try{
            const dataCriacao = new Date();
            const [id] = await db('jobs').insert({
                idCliente,
                idFotografo,
                dataJob,
                dataCriacao,
                titulo,
                descricao,
                local,
                preco
            })
            
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
            await db("jobs").where({id}).uptade({
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
        try{
            await db ('jobs').where({id}).del();
            res.status(200).json({message: 'Job excluído com sucesso! '})
        } catch (err){
            console.error('Erro ao excluir job', err)
            res.status(500).json({message: 'Erro ao realizar a exclusão do job'});
        }
    },

}