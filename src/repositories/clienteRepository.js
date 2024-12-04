const db = require('../database/db');

module.exports = {
    async getAllClientes() {
        return db('user').select('*').where({role: "cliente"});
    },

    async getEspecifCliente(id) {
        return db('user').select('*').where({id}).first();
    },

    async updateClientes(id, data) {
        return db('user').where({id}).update(data);
    }
}