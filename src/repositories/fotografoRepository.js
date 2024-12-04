const db = require('../database/db');

module.exports = {
    async getAllFotografos() {
        return db('user').select('*').where({ role: "fotografo" });
    },

    async getEspecifFotografo(id) {
        return db('user').select('*').where({ id }).first();
    },

    async updateFotografo(id, data) {
        return db('user').where({ id }).update(data);
    }
};
