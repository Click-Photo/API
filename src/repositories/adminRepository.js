const db = require('../database/db');

module.exports = {
    async getAllAdmins() {
        return db('admin').select('*');
    },

    async findAdminByEmail(email) {
        return db('admin').select('*').where({ email }).first();
    },

    async createAdmin(adminData) {
        return db('admin').insert(adminData);
    },

    async getAllFotografos() {
        return db('user').select('*').where({ role: "fotografo" });
    },

    async getAllClientes() {
        return db('user').select('*').where({ role: "cliente" });
    },

    async addCliente(clienteData) {
        return db('user').insert(clienteData);
    },

    async deleteCliente(id) {
        return db('user').where({ id, role: "cliente" }).delete();
    },

    async addFotografo(fotografoData) {
        return db('user').insert(fotografoData);
    },

    async deleteFotografo(id) {
        return db('user').where({ id, role: "fotografo" }).delete();
    },

    async deleteJob(jobId) {
        return db('jobs').where({ id: jobId }).delete();
    },

    async deletePortfolioImage(imageId) {
        return db('portfolio').where({ id: imageId }).delete();
    },

    async addAdmin(adminData) {
        return db('admin').insert(adminData);
    },

    async findAdminByEmail(email) {
        return db('admin').where({ email }).first();
    },

    async countUsersByRole(role) {
        return db('user').where({ role }).count();
    }
};
