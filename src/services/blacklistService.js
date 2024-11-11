const blacklistRepository = require('../repositories/blacklistRepository.js');

module.exports = {
  async getAllBlacklisted(){
    return await blacklistRepository.getAllBlacklisted();
  },

  async createBlacklistedUser(user) {
    const { idUser, motivo } = user;
    const result = await blacklistRepository.getEspecifUser(idUser); // Adicionado await

    if (result.length > 0) {
      return { message: "Usuário já bloqueado!" };
    }

    const id = await blacklistRepository.createBlacklistedUser(user);
    return { message: "Usuario bloqueado!" };
  },


  async deleteBlacklistedUser(id){
    return await blacklistRepository.deleteBlacklistedUser(id)
  },

  async getEspecifIdByEmail (email){
    return await blacklistRepository.getEspecifIdByEmail(email);
  }
}
