const db = require ('..databases/db');

module.exports = {
    async getAllInteresses(req,res){
        try{
            const interesses = await db('interesse').select('*');
            res.status(200).json(interesses);
        }catch(err){
            console.error('interesses não encontrados', err);
            res.status(500).json({message: "Interesses não encontrados"})
        }
    },

    async marcarInteresse (req,res){
        const {idJob} = req.params
        try{

        } catch(err){

        }
    }
}