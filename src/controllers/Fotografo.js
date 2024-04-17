const db = require('../database/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const moment = require('moment');

module.exports = {
    async getAllFotografos (req, res) {
        try{
            const fotografos = await db('fotografo').select('*');
            res.status(200).json(fotografos);
        } catch (err){
            console.error('clientes não encontrados', err);
            res.status(500).json({message: "Fotografos não encontrados"})
        }
    }
}