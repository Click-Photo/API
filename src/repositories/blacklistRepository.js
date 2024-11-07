const db = require('../database/db.js')

module.exports = {
  async getAllBlacklisted(){
    return db('blacklist').select('*')
  },

  async createBlacklistedUser(user){
    const {idUser, motivo} = user
    const[id] = await db('blacklist').insert({
      IdUser,
      motivo
    })

    return {id}
  },

  async deleteBlacklistedUser(id){
    return db('blacklist').where(id).del();
  },

  async getEspecifUser(id){
    return db('blacklist').where({idUser: id})
  }

}
