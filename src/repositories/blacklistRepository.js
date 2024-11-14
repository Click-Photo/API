const db = require('../database/db.js')

module.exports = {
  async getAllBlacklisted(){
    return db('blacklist').select('*')
  },

  async createBlacklistedUser(user){
  const {idUser, motivo} = user;
    const[id] = await db('blacklist').insert({
      IdUser : idUser,
      motivo
    })

    return {id}
  },

  async deleteBlacklistedUser(id){
    return db('blacklist').where({idUser: id}).del();
  },

  async getEspecifUser(idUser) {
    return db('blacklist').where({ idUser });
  },

  async getEspecifIdByEmail(email){
    const user = await db('user').select('id').where({email}).first();
    const result = await db('blacklist').select('id').where({id: user});
    return result;
  }
  
  

}