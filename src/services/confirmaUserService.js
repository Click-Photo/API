const confirmaUserRepository = require('../repositories/confirmaUserRepository');

module.exports = {
    async createUser(user){
        return await confirmaUserRepository.createUser(user);
    },

    async verifyTicketConfirmUser (ticket){
        return await confirmaUserRepository.verifyTicketConfirmUser(ticket);
    }
 
}