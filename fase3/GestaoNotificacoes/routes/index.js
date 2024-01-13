var express = require('express');
var router = express.Router();
var http = require('http');
var connections = {}

const {MessageNotificationsComposer} = require('../composer/messagenotifications_composer')

const {NotificationInfo} = require('../notificationsInfo/notifications_info');
const {NotificationsService} = require('../controller/service');

const notificationsinfo = new NotificationInfo();
const notificationsservice = new NotificationsService(notificationsinfo)

const server = http.createServer(express);
var socketIO = require('socket.io');

var io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", //[alterar]
    methods: ["GET", "POST"]
  }
});

// gerir conexoes webSocket para enviar notificacoes
// query.: numero=a97223 (definido no frontend)
io.on('connection', (socket) => {
  console.log('New webSocket client connected:' + socket["handshake"]["query"]["numero"]);
  connections[socket["handshake"]["query"]["numero"]] = socket;
});

//verifica as conexoes que já não estão ativas
setInterval(() => {
  Object.keys(connections).forEach(function(key) {
    if (connections[key].connected!=true) {
      delete connections[key];
    }
  });
}, 30000);

// servidor http para escutar por clientes
server.listen(8877, () => {
  console.log('Listening on port 8877 for client connections');
});

function sendNotification(obj){
  console.log("here")
  console.log(obj)
  if(Array.isArray(obj)){
    for(let i=0;i<obj.length;i++){
      if(Object.keys(connections).some(key => key === obj[i]["numero"])){
        const msg = MessageNotificationsComposer.composeMessage(obj[i]);
        let s = connections[obj[i]["numero"]];
        s.emit('notification', msg["mensagem"]);   
      } 
    }
  }
}

/*Rota para guardar notificação do registo de um novo docente(s)*/
router.post('/notifications/docente', function(req, res, next) {
  data=new Date()
  if(req.body["docentes"]){
    docentes = req.body["docentes"]
    notificationsservice.notifyNewDocenteAccounts(docentes).then(notificacoes=>{
      res.jsonp({msg:"notificacao de registo de novos docentes guardada.","notificacoes":notificacoes});
    }).catch(error=>{
      console.log(error);
      mensagem="Não foi possível guardar as notificações do registo dos docentes."
      res.status(500).jsonp({ erro: mensagem, msg:error});
    })
  }else{
    nome = req.body["nome"]
    n_mecanografico = req.body["n_mecanografico"]
    email = req.body["email"]
    platform_password = req.body["platform_password"]
    notificationsservice.notifyNewDocenteAccount(nome,n_mecanografico,email,platform_password).then(notificacoes=>{
      res.jsonp({msg:"notificacao de registo de novo docente guardada.","notificacoes":notificacoes});
    }).catch(error=>{
      console.log(error);
      res.status(500).jsonp({ erro:"Não foi possível guardar a notificação do registo do docente.", msg:error });
    })
  }
})


/*Rota para guardar as notificacoes do registo de um novo aluno(s).*/
router.post('/notifications/aluno',function(req,res,next){

  if(req.body["alunos"]){
    alunos = req.body["alunos"]
    notificationsservice.notifyNewAlunoAccounts(alunos).then(notificacoes=>{
      res.jsonp({msg:"notificacao guardada.","notificacoes":notificacoes});
    }).catch(error=>{
      console.log(error);
      res.status(500).jsonp({ erro: "Não foi possível guardar as notificações do registo dos docentes.", msg:error});
    })
  }else{
    nome = req.body["nome"]
    n_mecanografico = req.body["n_mecanografico"]
    email = req.body["email"]
    platform_password = req.body["platform_password"]
    notificationsservice.notifyNewAlunoAccount(nome,n_mecanografico,email,platform_password).then(notificacoes=>{
      res.jsonp({msg:"notificacao guardada.","notificacoes":notificacoes});
    }).catch(error=>{
      console.log(error);
      res.status(500).jsonp({ erro: "Não foi possível guardar a notificação do registo do docente.", msg:error });
    })
  }
})


/*{     "prova": "RAS-2223-1",
        "alunos": [{    //VERSAO 1
                        "sala": "0.08",
                        "data": "20-01-2024",
                        "hora": "10:00",
                        "alunos": [{"id":"pg54232"},{"id":"pg73463"}]
                     },
                     {  //VERSAO 2
                        "sala": "0.04",
                        "data": "20-01-2024",
                        "hora": "15:00",
                        "alunos":  [{"id":"a84544"},{"id":"a67544"}]
                     }]      
}*/ //Rota para notificar a criacao de uma nova prova.
router.post('/notifications/newprova',function(req,res,next){

      prova = req.body["prova"]
      alunos = req.body["alunos"]
      console.log(prova)
      console.log(alunos)
      console.log(req.body["alunos"].alunos)
      data = new Date()
      notificationsservice.notifyInscricaoProva(prova,alunos).then(notificacoes=>{
      //notificacoes guardadas com exito
      res.jsonp({msg:"notificação da criacao de uma nova prova guardada.","notificacoes":notificacoes});
      //enviar as notificacoes
      sendNotification(notificacoes)

    }).catch(error=>{
      console.log(error);
      res.status(500).jsonp({ erro: "Não foi possível notificar a criação de uma nova prova.", msg:error });
    })
})


//Rota para notificar a edicao de uma prova.
router.post('/notifications/editprova',function(req,res,next){

    prova = req.body["prova"]
    alunos = req.body["alunos"]
    console.log(alunos)
    notificationsservice.notifyEditInscricaoProva(prova,alunos).then(notificacoes=>{
    console.log(notificacoes);
    //notificacoes guardadas com exito
    res.jsonp({msg:"notificacao guardada.","notificacoes":notificacoes});

    //enviar as notificacoes
    sendNotification(notificacoes)

  }).catch(error=>{
    console.log(error);
    res.status(500).jsonp({ erro: "Não foi possível notificar a edição de uma nova prova.", msg:error });
  })
})

/*Rota para obter notificacoes nao lidas de um user*/
router.get('/notifications/unread/:id',function(req,res,next){
  idUser = req.params.id
  notificationsservice.checkNotReadNotifications(idUser).then(notificacoes=>{
    const processed = MessageNotificationsComposer.composeMessages(notificacoes);
    res.jsonp({"notificacoes":processed});
  }).catch(error=>{
    console.log(error);
    res.status(500).jsonp({ erro: "Não foi possível obter as notificacoes por ler do user.", msg:error});
  })
})


/*Rota para obter notificacoes de um user*/
router.get('/notifications/:id',function(req,res,next){
  idUser = req.params.id
  notificationsservice.getNotifications(idUser).then(notificacoes=>{
    const processed = MessageNotificationsComposer.composeMessages(notificacoes);
    res.jsonp({"notificacoes":processed});
  }).catch(error=>{
    console.log(error);
    res.status(500).jsonp({ erro: "Não foi possível obter as notificacoes do user.", msg:error});
  })
})

/*
{     "provaInfo": "RAS-2223-1",
      "studentsIds": [{"id":"a84544",password:"dger"},...]
}
*/
/*Rota para notificar os lançamentos de notas.*/
router.post('/notifications/grades',function(req,res,next){
  provaInfo = req.body["provaInfo"]
  studentsIds = req.body["studentsIds"]
  notificationsservice.notifyStudentsGradesPublished(provaInfo,studentsIds).then(notificacoes=>{
    res.jsonp({msg:"notificacoes dos lançamentos de notas guardadas.","notificacoes":notificacoes});

    sendNotification(notificacoes)
  }).catch(error=>{
    console.log(error);
    res.status(500).jsonp({ erro: "Não foi notificar o lançamento das notas.", msg:error});
  })
})


/*Rota para notificar a remoção das salas.
-> notificar o docente responsavel
- é da responsabilidade do docente notificar os alunos editando a prova com nova sala(notificacao) -> rota 4
*/
router.post('/notifications/unavailableroom',function(req,res,next){
  provaInfo = req.body["provaInfo"]
  salaInfo = req.body["salaInfo"]
  docenteID = req.body["docenteID"]

  notificationsservice.notifyUnavaibleSala(salaInfo,provaInfo,docenteID).then(notificacoes=>{

    res.jsonp({msg:"notificacao de sala indisponivel guardada.","notificacoes":notificacoes});
    sendNotification(notificacoes)

  }).catch(error=>{
    console.log(error);
    res.status(500).jsonp({ erro: "Não foi possível enviar e guardar a notificacao de sala indisponivel.", msg:error});
  })
})

module.exports = router;