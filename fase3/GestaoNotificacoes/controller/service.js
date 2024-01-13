var mongoose = require('mongoose');
const { Logger } = require('../controller/logger');
const { send } = require('../composer/messagenotifications_emailer');
const {MessageNotificationsComposer} = require('../composer/messagenotifications_composer')

class NotificationsService{

    constructor(notificationDB){
        this.notificationsDB = notificationDB
    }

    /*Guardar notificação da adicao de um novo docente*/
    async notifyNewDocenteAccount(nome,n_mecanografico,email,platform_password){
        try{
            const docente = {"_id":new mongoose.Types.ObjectId(),"notificacao":"Registo docente","numero":n_mecanografico,"platform_password":platform_password,"email":email,"nome":nome,"lida":false};
            let v = await this.notificationsDB.saveDocenteNotification(docente);
            const logger = new Logger(new Date(),"DB (notificação de adição de um novo docente)")
            logger.addLog()
            const msg = MessageNotificationsComposer.composeMessage(v);
            let body = msg["mensagem"]
            send(email,email,'Registo no sistema',body) // send email sender,receiver,subject,body
            const logger2 = new Logger(new Date(),"EMAIL > enviada notificacao do registo de: "+email)
            logger2.addLog()

            return v
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error; 
        }
    }

    /*Guardar notificações da adições de novos docentes*/
    async notifyNewDocenteAccounts(docentes){
        try{
            let notificacoes = []
            for (let i = 0; i < docentes.length; i++) {
                let v = await this.notifyNewDocenteAccount(docentes[i].nome,docentes[i].n_mecanografico,docentes[i].email,docentes[i].platform_password)
                notificacoes.push(v); 
                const logger = new Logger(new Date(),"DB (notificação de adição de um novo docente)")
                logger.addLog()

                const msg = MessageNotificationsComposer.composeMessage(v);
                let email = docentes[i].n_mecanografico+"@alunos.uminho.pt"
                let body = msg["mensagem"]
                send(email,email,'Registo no sistema',body) // send email sender,receiver,subject,body
                const logger2 = new Logger(new Date(),"EMAIL > enviada notificacao do registo de: "+email)
                logger2.addLog()
    
            }          
            return notificacoes
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error; 
        }
    }

    /*Guardar notificação da adicao de um novo aluno*/
    async notifyNewAlunoAccount(nome,n_mecanografico,email,platform_password){
        try{
            const aluno = {"_id": new mongoose.Types.ObjectId(),"notificacao":"Registo aluno","numero":n_mecanografico,
            "platform_password":platform_password,"email":email,"nome":nome,"lida":false};
            let v = await this.notificationsDB.saveAlunoNotification(aluno);
            const logger = new Logger(new Date(),"DB (notificação de adição de um novo aluno)")
            logger.addLog()

            const msg = MessageNotificationsComposer.composeMessage(v);
            let body = msg["mensagem"]
            send(email,email,'Registo no sistema',body) // send email sender,receiver,subject,body
            const logger2 = new Logger(new Date(),"EMAIL > enviada notificacao do registo de: "+email)
            logger2.addLog()

            return v
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error;
        }
    }

    /*Guardar notificações da adições de novos alunos*/
    async notifyNewAlunoAccounts(alunos){
        try{
            let alunos=[]
            for (let i = 0; i < alunos.length; i++) {
                let v = await this.notifyNewAlunoAccount(alunos[i].nome,alunos[i].n_mecanografico,alunos[i].email,alunos[i].platform_password);
                alunos.push(v);
                const logger = new Logger(new Date(),"DB (notificação de adição de um novo aluno)")
                logger.addLog()
                const msg = await MessageNotificationsComposer.composeMessage(v);
                let email = alunos[i].n_mecanografico+"@alunos.uminho.pt"
                let body = msg["mensagem"]
                send(email,email,'Registo no sistema',body) // send email sender,receiver,subject,body
                const logger2 = new Logger(new Date(),"EMAIL > enviada notificacao do registo de: "+email)
                logger2.addLog()
            }
            return alunos;   
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error;
        }      
    }

    /*Filtrar todas as notificações correspondentes a um determinado user.*/
    async getNotifications(idUser){
        try{
            let v = await this.notificationsDB.getallNotifications(idUser)
            const logger = new Logger(new Date(),"DB (filtragem das notificações do aluno "+idUser+")")
            logger.addLog()
            return v
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error;
        }
        
    }

    /*Filtrar todas as notificações correspondentes a um determinado user que ainda não foram lidas.*/
    async checkNotReadNotifications(idUser){
        try{
            let v = await this.notificationsDB.getallNotReadNotifications(idUser)
            const logger = new Logger(new Date(),"DB (filtragem das notificações não lidas do aluno "+idUser+")")
            logger.addLog()
            return v
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error; 
        } 
    }

    /*Guardar notificações do lançamento das notas para todos os estudantes envolvidos.*/
    async notifyStudentsGradesPublished(provaInfo,studentsIds){
        try{
            let grades=[]
            for(let i=0;i<studentsIds.length;i++){    
                const nota = {"_id": new mongoose.Types.ObjectId(),"notificacao":"Notas","numero":studentsIds[i].id,"email":"","nome":"","lida":false,"prova":provaInfo};
                let v = await this.notificationsDB.saveGradesNotifications(nota);
                const logger = new Logger(new Date(),"DB (guardada a notificação do lançamento das notas de "+studentsIds[i]+")")
                logger.addLog()
                grades.push(v)

                const msg = await MessageNotificationsComposer.composeMessage(v);
                let email = studentsIds[i].id+"@alunos.uminho.pt"
                let body = msg["mensagem"]
                send(email,email,"Notas lançadas - "+provaInfo,body) // send email sender,receiver,subject,body
                const logger2 = new Logger(new Date(),"EMAIL > enviada notificacao de lançamento das notas")
                logger2.addLog()
                            
            }
            return grades
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error;
        }
    }

    /*Guardar as notificacoes para os alunos de que foram inscritos para uma prova*/
    async notifyInscricaoProva(prova,alunos){
        try{
            let notificacoes = []
            for(let s=0;s<alunos.length;s++){
                for(let a=0;a<alunos[s]["alunos"].length;a++){
                    const inscricao = {"_id": new mongoose.Types.ObjectId(),"notificacao":"Inscrição Prova","numero":alunos[s]["alunos"][a].id,
                    "lida":false,"prova":prova,"sala":alunos[s]["sala"],"data":alunos[s]["data"],"hora":alunos[s]["hora"]};
                    let n = await this.notificationsDB.saveInscricao(inscricao); 
                    const logger = new Logger(new Date(),"DB (guardada a notificação da inscrição de "+alunos[s]["alunos"][a].id+")")
                    logger.addLog()    
                    
                    const msg = MessageNotificationsComposer.composeMessage(n);
                    let email = alunos[s]["alunos"][a].id+"@alunos.uminho.pt"
                    let body = msg["mensagem"]
                    //let r = await send(email,email,'Inscrição numa prova',body) // send email sender,receiver,subject,body
                    const logger2 = new Logger(new Date(),"EMAIL > enviada notificacao da inscricao para "+email)
                    logger2.addLog()    
                    
                    notificacoes.push(n);    
                }
            }
            return notificacoes
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error;
        }
    }

    async notifyEditInscricaoProva(prova,alunos){
        try{
            let notificacoes = []
            for(let s=0;s<alunos.length;s++){
                for(let a=0;a<alunos[s]["alunos"].length;a++){
                    const numero=alunos[s]["alunos"][a].id;
                    const sala=alunos[s]["sala"];
                    const data=alunos[s]["data"];
                    const hora=alunos[s]["hora"];
                    let id= new mongoose.Types.ObjectId()
                    let add = await this.notificationsDB.addeditInscricao(id,prova,data,hora,sala,numero); 
                    let n = await this.notificationsDB.editInscricao(prova,data,hora,sala,numero); 
                    notificacoes.push({"notificacao":"Edição Prova","prova":prova,"numero":numero,"sala":sala,"data":data,"hora":hora});    
                    const logger = new Logger(new Date(),"DB (guardada a notificação de edição/inscrição de "+numero+")")
                    logger.addLog()    
                    
                    const msg = MessageNotificationsComposer.composeMessage({"notificacao":"Edição Prova","prova":prova,"numero":numero,"sala":sala,"data":data,"hora":hora});
                    let email = alunos[s]["alunos"][a].id+"@alunos.uminho.pt"
                    let body = msg["mensagem"]
                    send(email,email,'Alterações na realização da prova',body) // send email sender,receiver,subject,body
                    const logger2 = new Logger(new Date(),"EMAIL > enviada notificacao da inscricao para "+email)
                    logger2.addLog()
                }
            }
            return notificacoes
        }catch(error){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error;
        }
    }

    async notifyUnavaibleSala(salaInfo,provaInfo,docenteID){
        try{
            let notificacoes = []
            const unavailable = {"_id":new mongoose.Types.ObjectId(),"notificacao":"sala indisponivel","numero":docenteID,
            "lida":false,"prova":provaInfo,"sala":salaInfo};
            let n = await this.notificationsDB.saveUnavailable(unavailable); 
            const logger = new Logger(new Date(),"DB (guardada a notificação de sala indisponivel)")
            logger.addLog()    
            
            const msg = MessageNotificationsComposer.composeMessage(n);
            let email = docenteID+"@alunos.uminho.pt"
            let body = msg["mensagem"]
            send(email,email, 'Sala indisponível',body) // send email sender,receiver,subject,body
            const logger2 = new Logger(new Date(),"EMAIL > enviada notificacao da inscricao para "+email)
            logger2.addLog()           
            notificacoes.push(n);    
            return notificacoes
        }catch(err){
            const logger = new Logger(new Date(),"error:"+error)
            logger.addLog()     
            throw error;
        }
    }
}

module.exports.NotificationsService = NotificationsService;