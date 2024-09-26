const db = require('../database/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const moment = require('moment');

module.exports = {
    async getAllAdmins(req,res){
        try{
            const admins  = await db('admin').select('*');
            res.status(200).json(admins);
        } catch(err){
            console.error('admins não encontrados', err);
            res.status(500).json({message: "Administradores não encontrados"})
        }
    },
    async createAdmin (req,res){
        const{
            nome,
            telefone,
            email,
            CPF,
            CEP,
            senha,
        } = req.body;

        try{
            const resultsEmail = await db('')
        }
        catch(err){
            console.error('admins não encontrados', err);
            res.status(500).json({message: "Administradores não encontrados"})
        }
    }
}