const db = require('../database/db');
const cloudinary = require('../controllers/CloudinaryConfig');

class PortfolioRepository {

    async adicionarFoto(fotografoId, foto, descricao) {
        const result = await cloudinary.uploader.upload(foto.path);
        const fotoUrl = result.secure_url;

        const [id] = await db('portfolio').insert({
            fotografoId,
            fotoUrl,
            descricao
        });

        return { id, fotoUrl };
    }

    async listarFotosGeral() {
        return await db('portfolio')
            .join('user', 'portfolio.fotografoId', 'user.id')
            .select(
                'portfolio.id as portfolioId',
                'user.id as fotografoId',
                'user.nome as fotografoNome',
                'portfolio.fotoUrl',
                'portfolio.descricao');

    }

    async listarFotosFotografo(fotografoId) {
        return await db('portfolio').select('*').where("fotografoId", fotografoId);
    }

    async deleteFoto(fotoId) {
        const foto = await db('portfolio').where('id', fotoId).first();
        if (!foto) {
            throw new Error('Foto não encontrada');
        }

        const public_id = foto.fotoUrl.split('/').pop().replace(/\.[^/.]+$/, ""); // Extrair public_id do URL
        await cloudinary.uploader.destroy(public_id);

        await db('portfolio').where('id', fotoId).del();
    }

    async editarInfoFoto(idFoto, descricao) {
        await  db('portfolio').where('id', idFoto).update({ descricao });

    }

};

module.exports = new PortfolioRepository();