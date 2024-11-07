const blacklistRepository = require('../repositories/blacklistRepository.js');

module.exports = {
  async getAllBlacklisted(){
    return await blacklistRepository.getAllBlacklisted();
  },

  async createBlacklistedUser(user){
    const {idUser,motivo} = user
    const result = blacklistRepository.getEspecifUser(idUser)

    if (result.length>0){
      return {message: "Usuário já bloqueado!"}
    }

    const id = await blacklistRepository.createBlacklistedUser(user)
  },

  async deleteBlacklistedUser(id){
    return await blacklistRepository.deleteBlacklistedUser(id)
  }
}
