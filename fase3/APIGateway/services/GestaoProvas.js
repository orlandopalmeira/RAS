const axios = require('axios');

module.exports.gestaoProvasAccessPoint = process.env.GESTAO_PROVAS_AP || 'http://localhost:7777';
module.exports.gestaoProvasRoute = (route) => this.gestaoProvasAccessPoint + route

module.exports.getProvasOfDocente = (idDocente) => {
    return axios.get(this.gestaoProvasRoute(`/provas/docente/${idDocente}`))
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
        });
}

module.exports.checkProvaName = (provaName) => {
    return axios.get(this.gestaoProvasRoute(`/provas/checkname?name=${provaName}`))
        .then((result) => {
            let resp = result.data //> formato: {result: boolean}
            if (!resp.result) { //> O nome da prova é válido
                return true
            } else {
                throw new Error('Error: InvalidProvaName -> ' + provaName)
            }
        }).catch((err) => {
            throw err
        });
}

module.exports.registerProva = (prova) => {
    return axios.post(this.gestaoProvasRoute('/provas'), prova)
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
        });
}

module.exports.getProvasNaoRealizadas = (numMecAluno) => {
    return axios.get(this.gestaoProvasRoute(`/provas/alunos/${numMecAluno}/naoRealizadas`))
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
        });
}

module.exports.getProvasRealizadas = (numMecAluno) => {
    return axios.get(this.gestaoProvasRoute(`/provas/alunos/${numMecAluno}/realizadas`))
        .then((result) => {
            console.log(result)
            return result.data
        }).catch((err) => {
            throw err
    });
}

module.exports.getQuestoes = (idProva,versao) => {
    return axios.get(this.gestaoProvasRoute(`/provas/questoes/${idProva}/${versao}`))
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
    });
}

module.exports.getResolucoesAlunoProva = (numMecAluno,idProva) => {
    return axios.get(this.gestaoProvasRoute(`/provas/resolucoes/aluno/${numMecAluno}/${idProva}`))
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
        });
}

module.exports.registerResolucao = (resolucao) => {
    return axios.post(this.gestaoProvasRoute('/provas/resolucoes'), resolucao)
    .then((result) => {
        return result.data
    }).catch((err) => {
        throw err
    });
}

module.exports.checkProvaName = (provaName) => {
    return axios.get(this.gestaoProvasRoute(`/provas/checkname?name=${provaName}`))
        .then((result) => {
            let resp = result.data //> formato: {result: boolean}
            if (!resp.result) { //> O nome da prova é válido
                return true
            } else {
                throw new Error('Error: InvalidProvaName -> ' + provaName)
            }
        }).catch((err) => {
            throw err
        });
}

module.exports.corrigeProva = (idProva) => {
    return axios.get(this.gestaoProvasRoute(`/provas/${idProva}/resolucoes/correcaoAuto`))
        .then((result) => {
            let resp = result.data //> formato: {result: boolean}
            if (!resp.result) { //> O nome da prova é válido
                return true
            } else {
                throw new Error('Error: Classificacao falhou -> ' + idProva)
            }
        }).catch((err) => {
            throw err
        });
}
