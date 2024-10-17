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
    },

    async updateUser(req, res){
        try{
            const user = req.body;
            const id = req.params;
            const updatedUser = await UserService.updateUser(user,id);
            res.status(200).json(updatedUser);
        } catch(err){
            console.log(err);
            res.status(500).json({message: "Erro ao atualizar usuário: ", err})
        }
    },

    async deleteUser(req,res){
        try{
            const id = req.params;
            await UserService.deleteUser(id);
            res.status(200).json({message: "Usuário deletado com sucesso!"})
        } catch (err){
            console.log(err);
            res.status(500).json({message: "Erro ao deletar usuário: ", err})
        }
    },

    async reqResetPass(req,res){
        try{
            const email = req.body;
            await UserService.reqPasswordReset(email);
            res.status(200).json({message: "Link de redefinição enviado para seu email!"})
        } catch(err){
            console.log(err)
            res.status(500).json({message: "Erro ao solicitar reset de senha"})
        }
    },

    async verifyPasswordResetTicket(req, res){
        try{
            const ticket = req.body;
            await  UserService.verifyPasswordResetTicket(ticket)
            res.status(200).json({message: "Ticket válido!"})

        } catch(err){
            console.log(err);
            res.status(500).json({message: "Tickec inválido!"})
        }
    },

    async resetPassword(req,res){
        try{
            const user = req.body;
            await UserService.resetPassword(user);
            res.status(200).json({message: "Senha resetada com sucesso!"})
        } catch(err){
            console.log(err);
            res.status(500).json({message: "Erro ao alterar senha."})
        }
    },

    async authUser(req,res){
        try{
            const user = req.body;
            const login = await UserService.authLogin(user)
            res.status(200).json({message: login})
        } catch(err){
            console.log(err);
            res.status(401).json({message: "Email ou senha inválidos!"})
        }
    }
}