const express = require('express');
const UserService = require('../services/userService');

module.exports = {
    async getAllUsers(req, res){
        try{
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch(err){
            console.error('erro: ',err);
            res.status(500).json({error: "Erro ao puxar usuários: ", err})
        }
    },

    async createUser(req,res){
        try{
            const user = req.body;
            const createUser = await  UserService.createUser(user);
            res.status(201).json(createUser);
        } catch(err){
            console.log(err);
            res.status(500).json({message: "Erro ao criar usuário: ", err})
        }
    }
}