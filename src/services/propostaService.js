const propostaRepository = require('../repositories/propostaRepository');
const jobRepository = require('../repositories/jobRepository');
const userRepository = require('../repositories/userRepository'); 
const nodemailer = require('nodemailer');

const transporter =  nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'click.studio.ilustration@gmail.com',
        pass: 'uoueupvqdobqlubg',
    }
});

async function sendEmail(email, subject, htmlContent) {
    await transporter.sendMail({ 
        from: 'click.studio.ilustration@gmail.com', 
        to: email,
        subject: subject,
        html: htmlContent
    });
}


class PropostaService {
    async getAllPropostas() {
        return await propostaRepository.getAllPropostas();
    }

    async createProposta(idJobs, idCliente, idFotografo) {
        const statusJob = await jobRepository.validarStatusJob(idJobs);

        if (statusJob === 'Aceito' | statusJob === 'Finalizado') {
            throw new Error('Não é possível criar uma proposta para um job que já foi aceito ou finalizado.');
        }
        return await propostaRepository.createProposta(idJobs, idCliente, idFotografo);
    }

    async deleteProposta(id) {
        return await propostaRepository.deleteProposta(id);
    }

    async getAllPropostaCliente(idCliente) {
        return await propostaRepository.getAllPropostaCliente(idCliente);
    }

    async getPropostaJob(idJob) {
        return await propostaRepository.getPropostaJob(idJob);
    }

    async getAllPropostaFotografo(idFotografo) {
        return await propostaRepository.getAllPropostaFotografo(idFotografo);

    }

    async getAllPropostaJob(idJobs) {
        return await propostaRepository.getAllPropostaJob(idJobs);
    }

    async aceitarProposta(id, idJobs, idFotografo, nomeCliente, telefoneCliente) {
        await propostaRepository.aceitarProposta(id, idJobs, idFotografo);

        const email = await userRepository.getEmailById(idFotografo);
        if (!email) {
            throw new Error('Não foi possível encontrar o e-mail do fotógrafo.');
        }

        const htmlContent = `
            <div style="background-color: black; padding: 8px 20px; text-align: center;">
                <h2 style="font-size: 24px; color: #fff; font-family: 'Baloo', sans-serif; font-weight: 700;">Click</h2>
            </div>
            <div style="padding: 20px; background-color: white;">
                <p style="font-size: 16px; color: black;">Olá!</p>
                <p style="font-size: 16px; color: black;">A proposta feita para o Job de ${nomeCliente} foi aceita, entre em contato pelo número ${telefoneCliente}.</p>
                <p style="font-size: 16px; color: black;"><strong style="color: black;">Click</strong> está à disposição. :)</p>
            </div>
        `;

        await sendEmail(email[0].email, 'Atualização de proposta!', htmlContent);
    }


    async recusarProposta(id, idFotografo, nomeCliente) {
        await propostaRepository.recusarProposta(id);

        const email = await userRepository.getEmailById(idFotografo); // Chama a nova função para obter o email

        const htmlContent = `
            <div style="background-color: black; padding: 8px 20px; text-align: center;">
                <h2 style="font-size: 24px; color: #fff; font-family: 'Baloo', sans-serif; font-weight: 700;">Click</h2>
            </div>
            <div style="padding: 20px; background-color: white;">
                <p style="font-size: 16px; color: black;">Olá!</p>
                <p style="font-size: 16px; color: black;">A proposta feita para o Job de ${nomeCliente} foi recusada, agradecemos pelo seu interesse.</p>
                <p style="font-size: 16px; color: black;"><strong style="color: black;">Click</strong> está à disposição. :)</p>
            </div>
        `;

        await sendEmail(email[0].email, 'Atualização de proposta.', htmlContent);
    }
};

module.exports = new PropostaService();   