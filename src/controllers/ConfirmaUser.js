const express = require('express');
const ConfirmaUserService = require('../services/confirmaUserService');

module.exports = {
    async createUser(req, res){
        try{
            const user = req.body;
            const createUser = await  ConfirmaUserService.createUser(user);
            res.status(201).json(createUser);
        } catch(err){
            console.log(err);
            res.status(500).json({message: "Erro ao criar usuário: ", err})
        }
    },

    async verifyTicketConfirmUser(req,res){
        try{
            const user = req.body;
            const verifyTicket = await ConfirmaUserService.verifyTicketConfirmUser(user)
            res.status(201).json(verifyTicket);
        } catch(err){
            console.log(err);
            res.status(500).json({message: "Erro ao verificar ticket: ", err})
        }
    }
}