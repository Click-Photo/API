const db = require('../database/db');

module.exports = {
    async createReport(idUser, idPostagem, tipo, motivo) {
        return db('reports').insert({
            idUser, 
            idPostagem, 
            tipo, 
            motivo
        });
    },

    async getReports() {
        const jobsReports = await db('reports')
          .select(
            'reports.id as reportId',  
            'reports.idPostagem',      
            'reports.tipo',            
            'jobs.titulo as jobTitle', 
            'jobs.descricao as jobDescription',  
            'jobs.preco as jobPrice', 
            'jobs.local as jobLocation',  
            'jobs.status as jobStatus' 
          )
          .join('jobs', 'reports.idPostagem', '=', 'jobs.id')
          .where('reports.tipo', 'job');
    
      
        const portfolioReports = await db('reports')
          .select(
            'reports.id as reportId',  
            'reports.idPostagem',   
            'reports.tipo',        
            'portfolio.fotoUrl as portfolioImageUrl',  
            'portfolio.descricao as portfolioDescription'  
          )
          .join('portfolio', 'reports.idPostagem', '=', 'portfolio.id')
          .where('reports.tipo', 'photo');
    
        const reports = [...jobsReports, ...portfolioReports];
         
        return reports;
    },

    async resolveReport(idPostagem, tipo, deletePost){
        await db('reports').where({ idPostagem }).del();

        if(deletePost){
            if(tipo === 'job'){
                return await db('jobs').where({ id: idPostagem }).del();
            }else{
                return await db('portfolio').where({ id: idPostagem }).del();
            }
        }
    }
}