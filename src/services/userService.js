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

    async deleteUser(idUser){
        return await UserRepository.deleteUser(idUser)
    },

    async reqPasswordReset(userEmail){
        return await UserRepository.reqPasswordReset(userEmail)
    },

    async verifyPasswordResetTicket(userTicket){
        return await UserRepository.verifyPasswordResetTicket(userTicket)
    },

    async resetPassword(user){
        return await UserRepository.resetPassword(user)
    },

    async authLogin(authUser){
        return await UserRepository.authLogin(authUser)
    }
}