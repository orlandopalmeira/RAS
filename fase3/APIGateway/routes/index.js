var express = require('express');
var router = express.Router();

const GestaoProvas = require('../services/GestaoProvas')
const GestaoUtilizadores = require('../services/GestaoUtilizadores')
const GestaoNotificacoes = require('../services/GestaoNotificacoes')
const GestaoSalas = require('../services/GestaoSalas')

router.post('/login', function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    GestaoUtilizadores.login(email, password)
        .then((result) => {
            res.jsonp({ msg: 'Login bem sucedido!', token: result.token });
        }).catch((err) => {
            if (err.message === 'Error: InvalidEmail' || err.message === 'Error: InvalidPassword') {
                res.status(401).jsonp({ msg: err.message });
            }
            else {
                console.log(err.message)
                res.status(500).jsonp({ msg: err.message });
            }
        });
})

router.post('/register', function (req, res, next) {
    let userData = req.body
    GestaoUtilizadores.register(userData)
        .then((result) => {
            res.jsonp({ msg: 'Registo bem sucedido!', token: result.token });
        }).catch((err) => {
            if (err.message === 'Error: InvalidEmail' || err.message === 'Error: InvalidPassword') {
                res.status(401).jsonp({ msg: err.message });
            }
            else {
                console.log(err.message)
                res.status(500).jsonp({ msg: err.message });
            }
        });
})

router.get('/users', function (req, res, next) {
    GestaoUtilizadores.getUsers()
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
});

router.get('/users/alunos/:numMecanografico', function (req, res, next) {
    let numAluno = req.params["numMecanografico"]
    GestaoUtilizadores.verifyUser(numAluno)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        })
})

/**
 * Rota para validar o nome da prova e os dados dos alunos
 * Use cases: Criar prova, ...
*/
router.post('/provas/checkNameAndAlunos', function (req, res, next) {
    let provaName = req.body.provaName;
    let alunos = req.body.alunos;
    let verifAlunos = GestaoUtilizadores.verifyAlunos(alunos)
    let verifProvaName = GestaoProvas.checkProvaName(provaName)
    Promise.all([verifProvaName, verifAlunos])
    .then(([rPName, rAlunos]) => {
        if(!rPName){ //> Nome de prova inválido 
            res.status(400).jsonp({ msg: `Error: InvalidProvaName -> '${provaName}'` });
        } else if(!rAlunos){ //> Números de alunos inválidos
            res.status(400).jsonp({ msg: `Error: Ficheiro de alunos com alunos inválidos/inexistentes` });
        } else { //> Tudo bem
            res.sendStatus(200)
        }
    }).catch((err) => {
        res.status(500).jsonp({ msg: err.message });
    });
});

/**
 * Rota para solicitar propostas de calendarização tendo em conta os alunos, data+hora e duração da prova.
 */
router.post('/salas/calendarizacao', function (req, res, next) {
    let { alunos, dataHora, duracao } = req.body;
    GestaoSalas.propostasCalendarizacao(alunos, dataHora, duracao)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        });
})

/**
 * Rota para obter todas as salas
 */
router.get('/salas', function (req, res, next) {
    GestaoSalas.getAllSalas()
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        });
})

/**
 * >Rota para eliminar uma sala
 */
router.delete('/salas/:idSala', function (req, res, next) {
    let id_sala = req.params.idSala;
    GestaoSalas.removeSala(id_sala)
        .then((result) => {
            res.jsonp(result)
            }).catch((err) => {
                res.status(500).jsonp({ msg: err.message })
        });
});

/**
 * Rota para filtrar notificacoes de um dado aluno.
 */
router.get('/notifications/:id', function (req, res, next) {
    GestaoNotificacoes.getnotifications(req.params.id)
        .then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        });
})


/**
 * Rota para submeter uma prova
 */
router.post('/provas/register', function (req, res, next) {
    let prova = req.body
    //> Alocação de salas
    let alocacoes = prova.versoes.map(versao => ({ idSala: versao._id, dataHora: versao.data, duracao: versao.duracao }))
    console.log(alocacoes) //!DEBUG

    let alocaSalasPromise = GestaoSalas.alocaSalas(alocacoes)
    let registaProvaPromise = GestaoProvas.registerProva(prova)
    console.log(prova)

    Promise.all([alocaSalasPromise, registaProvaPromise])
        .then(([salasResult, provaResult]) => {
            res.jsonp(provaResult)
            if(provaResult.acknowledged==true) GestaoNotificacoes.sendnotifications(prova.nome,prova.versoes)
        }).catch((err) => {
            console.log(err)
            res.status(500).jsonp({ msg: err.message });
        });
})

/**
 * Obtém as provas ainda não realizadas pelo aluno
 */
router.get('/provas/alunos/:numMecAluno/naoRealizadas', function (req, res, next) {
    let numMecAluno = req.params.numMecAluno
    GestaoProvas.getProvasNaoRealizadas(numMecAluno)
        .then((result) => {
            res.jsonp(result)
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message })
        });
})

/**
 * Obtém as provas já realizadas pelo aluno
 */
router.get('/provas/alunos/:numMecAluno/realizadas', function (req, res, next) {
    let numMecAluno = req.params.numMecAluno
    GestaoProvas.getProvasRealizadas(numMecAluno)
        .then((result) => {
            res.jsonp(result)
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message })
        });
})

/**
 * Obtém as resolucoes de uma aluno a uma prova
 */
 router.get('/provas/resolucoes/aluno/:numMecAluno/:idProva', function (req, res, next) {
    let numMecAluno = req.params.numMecAluno
    let idProva = req.params.idProva
    GestaoProvas.getResolucoesAlunoProva(numMecAluno,idProva)
        .then((result) => {
            res.jsonp(result)
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message })
    });
})

/**
 * Obtém as questoes de uma prova de uma dada versao
 */
router.get('/provas/questoes/:id/:versao',function(req,res,next){
    let idProva = req.params.id
    let versao = req.params.versao
    GestaoProvas.getQuestoes(idProva,versao)
        .then((result) => {
            res.jsonp(result)
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message })
    });
})

/**
 * Regista a resolução de um alunos
 */
router.post('/provas/resolucoes', function (req, res, next) {
    let resolucao = req.body
    GestaoProvas.registerResolucao(resolucao)
        .then((result) => {
            res.jsonp(result)
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message })
        });
})

/**
* faz a classificação automatica
*/
router.get('/provas/:idProva/resolucoes/correcaoAuto', function (req, res, next) {
    let idProva = req.params.idProva
    GestaoProvas.corrigeProva(idProva)
        .then((_) => {
            res.jsonp({ msg: `Prova: ${idProva} corrigida com sucesso!` })
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        });

})

router.get('/provas/docente/:idDocente', function (req, res, next) {
    let idDocente = req.params.idDocente
    GestaoProvas.getProvasOfDocente(idDocente)
        .then((result) => {
            res.jsonp(result)
        }).catch((err) => {
            res.status(500).jsonp({ msg: err.message });
        });

})

module.exports = router;
