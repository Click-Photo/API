const bcrypt = require('bcrypt');
const adminRepository = require('../repositories/adminRepository');
const saltRounds = 10;

module.exports = {
    async getAllAdmins() {
        return await adminRepository.getAllAdmins();
    },

    async createAdmin(nome, telefone, email, CPF, CEP, senha) {
        const existingAdmin = await adminRepository.findAdminByEmail(email);
        if (existingAdmin) {
            throw new Error('E-mail já cadastrado');
        }
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const adminData = {
            nome,
            telefone,
            email,
            CPF,
            CEP,
            senha: hashedPassword,
        };

        return await adminRepository.createAdmin(adminData);
    },
    async getAllFotografos() {
        return await adminRepository.getAllFotografos();
    },

    async getAllClientes() {
        return await adminRepository.getAllClientes();
    },

    async addCliente(clienteData) {
        clienteData.senha = await bcrypt.hash(clienteData.senha, saltRounds);
        return await adminRepository.addCliente(clienteData);
    },

    async deleteCliente(id) {
        return await adminRepository.deleteCliente(id);
    },

    async addFotografo(fotografoData) {
        fotografoData.senha = await bcrypt.hash(fotografoData.senha, saltRounds);
        return await adminRepository.addFotografo(fotografoData);
    },

    async deleteFotografo(id) {
        return await adminRepository.deleteFotografo(id);
    },

    async deleteJob(jobId) {
        return await adminRepository.deleteJob(jobId);
    },

    async deletePortfolioImage(imageId) {
        return await adminRepository.deletePortfolioImage(imageId);
    },

    async addAdmin(adminData) {
        adminData.senha = await bcrypt.hash(adminData.senha, saltRounds);
        return await adminRepository.addAdmin(adminData);
    },

    async loginAdmin(email, senha) {
        const admin = await adminRepository.findAdminByEmail(email);
        if (admin && await bcrypt.compare(senha, admin.senha)) {
            const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { token, admin };
        }
        throw new Error('Credenciais inválidas');
    },

    async countUsers() {
        const clientes = await adminRepository.countUsersByRole('cliente');
        const fotografos = await adminRepository.countUsersByRole('fotografo');
        return { clientes: clientes[0].count, fotografos: fotografos[0].count };
    },
};
