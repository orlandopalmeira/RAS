const axios = require('axios');


module.exports.gestaoSalasAccessPoint = process.env.GESTAO_SALAS_AP || 'http://localhost:7778';
module.exports.gestaoSalasRoute = (route) => this.gestaoSalasAccessPoint + route


module.exports.propostasCalendarizacao = async (alunos, dataHora, duracao) => {
    let body = { alunos, dataHora, duracao };
    let response = await axios.post(this.gestaoSalasRoute('/salas/calendarizacao'), body)
    return response.data
}

module.exports.alocaSalas = async (alocacoes) => {
    let response = await axios.post(this.gestaoSalasRoute('/salas/alocar'), alocacoes)
    return response.data
}

module.exports.getAllSalas = async () => {
    let response = await axios.get(this.gestaoSalasRoute('/salas'))
    return response.data
}

module.exports.removeSala = async (idSala) => {
    let response = await axios.delete(this.gestaoSalasRoute(`/salas/${idSala}`))
    return response.data
}