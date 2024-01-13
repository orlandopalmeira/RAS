const axios = require('axios');

module.exports.gestaoNotificacoesAccessPoint = 'http://localhost:8888';
module.exports.gestaoNotificacoesRoute = (route) => this.gestaoNotificacoesAccessPoint + route

module.exports.getnotifications = (id) => {
    return axios.get(this.gestaoNotificacoesRoute(`/notifications/${id}`))
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
        });
}

module.exports.sendnotifications = (prova,versoes) => {
    let alunos = []
    versoes.forEach((v) => {
        let room = "Ed."+v.edificio + "-" + v.piso + "." +v.sala;
        let date = v.data.split(' ');
        let data = date[0];
        let time = date[1];
        let valunos = v.alunos;
        let ids = []
        valunos.forEach((id)=> ids.push({"id":id}))
        let aluno = {    
            "sala": room,
            "data": data,
            "hora": time,
            "alunos": ids
        };
        alunos.push(aluno)
    });
    let notificacao = {
        "prova":prova,
        "alunos":alunos
    };
    //console.log(notificacao);
    return axios.post(this.gestaoNotificacoesRoute(`/notifications/newprova`),notificacao)
            .then((result) => {
                return result.data
            }).catch((err) => {
                throw err
    });  
}