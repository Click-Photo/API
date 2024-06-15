const db = require('../database/db');
const cloudinary = require('./CloudinaryConfig');

module.exports = {
    async adicionarFoto(req, res) {
        const { fotografoId, descricao } = req.body;
        const foto = req.file;

        try {
            if (!foto) throw new Error('Arquivo não enviado.');

            // Upload da imagem para o Cloudinary
            const result = await cloudinary.uploader.upload(foto.path);
            const fotoUrl = result.secure_url;

            const [id] = await db('portfolio').insert({
                fotografoId,
                fotoUrl,
                descricao
            });

            res.status(201).json({ id, message: 'Foto adicionada com sucesso ao portfólio.', fotoUrl });
        } catch (error) {
            console.error("Erro ao adicionar foto ao portfólio: ", error);
            res.status(500).json({ message: "Erro ao adicionar foto ao portfólio", error: error.message });
        }
    },

    async listarFotosGeral(req, res) {
        try {
            const fotos = await db('portfolio').select('*');
            res.status(200).json(fotos);
        } catch (error) {
            console.error("Erro ao listar todas as fotos do portfólio: ", error);
            res.status(500).json({ message: "Erro ao listar todas as fotos do portfólio", error: error.message });
        }
    },

    async listarFotosFotografo(req, res) {
        const fotografoId = req.params.fotografoId;

        try {
            const fotos = await db('portfolio').select('*').where("fotografoId", fotografoId);
            res.status(200).json(fotos);

        } catch (error) {
            console.error("Erro ao listar fotos do portfólio: ", error);
            res.status(500).json({ message: "Erro ao listar fotos do portfólio", error: error.message });
        }
    },

    async deleteFoto(req, res) {
        const fotoId = req.params.fotoId; 
    
        try {
            const foto = await db('portfolio').where('id', fotoId).first();
            if (!foto) {
                return res.status(404).json({ message: "Foto não encontrada" });
            }

            const public_id = foto.fotoUrl.split('/').pop().replace(/\.[^/.]+$/, ""); // Extrair public_id do URL
            await cloudinary.uploader.destroy(public_id);
    
            await db('portfolio').where('id', fotoId).del();
            res.status(200).json({ message: "Foto deletada com sucesso" });
    
        } catch (error) {
            console.error("Erro ao deletar foto do portfólio: ", error);
            res.status(500).json({ message: "Erro ao deletar foto do portfólio", error: error.message });
        }
    },
    
    async editarInfoFoto(req, res){
        const { idFoto } = req.params;
        const { descricao } = req.body;
        try{
            await db('portfolio').update({ descricao }).where('id', idFoto);
            res.status(200).json("Informações atualizadas com sucesso!");

        }catch(err){
            console.log("Erro ao atualizar informações: ", err);
            res.status(500).json("Erro ao atualizar informações");
        }
    }
};
