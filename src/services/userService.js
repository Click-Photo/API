const UserRepository = require('../repositories/userRepository')

module.exports = {
    async getAllUsers(){
        return await UserRepository.getAllUsers()
    },

    async createUser(user){
        return await UserRepository.createUser(user)
    },

    async updateUser(user,idUser){
        return await UserRepository.updateUser(user,idUser)
    },

    async deleteUser(id){
        return await UserRepository.deleteUser(id)
    },

    async reqPasswordReset(userEmail){
        return await UserRepository.reqPasswordReset(userEmail)
    },

    async verifyPasswordResetTicket(userTicket){
        return await UserRepository.verifyPasswordResetTicket(userTicket)
    },

    async resetPassword(userEmail, user){
        return await UserRepository.resetPassword(userEmail, user)
    },

    async authLogin(user){
        return await UserRepository.authLogin(user)
    }
}