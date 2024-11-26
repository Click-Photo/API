const reportRepository = require('../repositories/reportRepository.js');
const userRepository = require('../repositories/userRepository.js');

module.exports = {
    async createReport(email, idPostagem, motivo) {
        const user = await userRepository.getEspecifUserByEmail(email);
        const idUser = user.id;

        // Caso o role do user for cliente significa que ele só pode estar fazendo uma denúncia de um portfolio
        // E vice versa
        const tipo = user.role === 'cliente' ? 'photo' : 'job';

        return await reportRepository.createReport(idUser, idPostagem, tipo, motivo);
    },

    async getReports() {
        return await reportRepository.getReports();
    },

    async resolveReport(idPostagem, tipo, deletePost) {
        return await reportRepository.resolveReport(idPostagem, tipo, deletePost);
    },

}
