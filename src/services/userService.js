const UserRepository = require('../repositories/userRepository')

module.exports = {
    async getAllUser(){
        return await UserRepository.getAllUsers()
    },

    async createUser(){
        return await UserRepository.createUser()
    },

    async updateUser(){
        return await UserRepository.updateUser()
    },

    async deleteUser(){
        return await UserRepository.deleteUser()
    },

    async reqPasswordReset(){
        return await UserRepository.reqPasswordReset()
    },

    async verifyPasswordResetTicket(){
        return await UserRepository.verifyPasswordResetTicket()
    },

    async resetPassword(){
        return await UserRepository.resetPassword()
    },

    async authLogin(){
        return await UserRepository.authLogin()
    }
}