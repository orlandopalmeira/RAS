var mongoose = require('mongoose')

var NotificacaoSchema = new mongoose.Schema({
    "_id":String,
    notificacao: String,
    numero: String,
    platform_password:String,
    email: String,
    nome: String,
    lida: Boolean,
    prova: String,
    sala: String,
    data: String,
    hora: String
})

module.exports = mongoose.model('notificacoes', NotificacaoSchema)