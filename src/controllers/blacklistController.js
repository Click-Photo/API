const blacklistService = require ('../services/blacklistService.js')

module.exports = {
  async getAllBlackListed(){
    try{
      const users = await blacklistService.getAllBlacklisted();
      res.status(200).json(users)
    } catch(err){
      console.error("Erro: ",err)
      res.status(500).json({error: 'Erro ao puxar usuarios: ',err})
    }
  },


  async createBlacklistedUser(){
    try{
      const user = req.body;
      const createBlacklisted = await blacklistService.createBlacklistedUser(user);
      res.status(200).json(createBlacklisted);    
    } catch(err){
      console.error("Erro: ",err)
      res.status(500).json({error: 'Erro ao bloquear usuario',err})
    }
  },

  async deleteBlacklistedUser(){
    try{
      const user = await blacklistService.deleteBlacklistedUser();
      res.status(200).json(user)
    } catch (err){
      console.error("Erro: ",err)
      res.status(500).json({error: 'Erro ao desbloquear usuario',err})
    }
  }
}
