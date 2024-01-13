class MessageNotificationsComposer {
    static composeMessages(notificacoes) {
        for (let i = 0; i < notificacoes.length; i++) {
            if (notificacoes[i]["notificacao"] == "Registo docente") {
                notificacoes[i] = MessageNotificationsComposer.composeRegisterMessage(notificacoes[i]);
            }
            if (notificacoes[i]["notificacao"] == "Registo aluno") {
                notificacoes[i] = MessageNotificationsComposer.composeRegisterMessage(notificacoes[i]);
            }
            if (notificacoes[i]["notificacao"] == "Inscrição Prova") {
                notificacoes[i] = MessageNotificationsComposer.composeNewExamMessage(notificacoes[i]);
            }
            if (notificacoes[i]["notificacao"] == "Notas") {
                notificacoes[i] = MessageNotificationsComposer.composeGradedExamMessage(notificacoes[i]);
            }
            if (notificacoes[i]["notificacao"] == "Edição Prova") {
                notificacoes[i] = MessageNotificationsComposer.composeEditExamMessage(notificacoes[i]);
            }
        }
        return notificacoes;
    }

    static composeMessage(notificacao) {
        if (notificacao["notificacao"] == "Registo docente") {
            notificacao = MessageNotificationsComposer.composeRegisterMessage(notificacao);
        }
        if (notificacao["notificacao"] == "Registo aluno") {
            notificacao = MessageNotificationsComposer.composeRegisterMessage(notificacao);
        }
        if (notificacao["notificacao"] == "Inscrição Prova") {
            notificacao = MessageNotificationsComposer.composeNewExamMessage(notificacao);
        }
        if (notificacao["notificacao"] == "Edição Prova") {
            notificacao = MessageNotificationsComposer.composeEditExamMessage(notificacao);
        }
        if (notificacao["notificacao"] == "Notas") {
            notificacao = MessageNotificationsComposer.composeGradedExamMessage(notificacao);
        }
        if (notificacao["notificacao"] == "sala indisponivel") {
            notificacao = MessageNotificationsComposer.composeUnavailableRoomMessage(notificacao);
        }
        return notificacao;
    }

    static composeRegisterMessage(notificacao) {
        const message = "Olá, " + notificacao['nome'] +"!\r\n" + "Viemos informar que você foi registado(a) no sistema com o email: " + notificacao['email'] +" e password: "+notificacao['platform_password']+".";
        const newmessage = { notificacao , "mensagem":message}
        return newmessage
    }

    static composeNewExamMessage(notificacao) {
        const message = "Olá, " + notificacao["numero"] +"!\r\n" +  "Viemos informar que foi inscrito para a prova: " + notificacao["prova"] + ".\r\n" +
        "A prova realizar-se-á na sala " + notificacao["sala"] + " no dia " + notificacao["data"] + " às " + notificacao["hora"] + "H.";
        const newmessage = { notificacao , "mensagem":message}
        return newmessage;
    }

    static composeEditExamMessage(notificacao) {
        const message = "Olá, " + notificacao["numero"] +"!\r\n" + " Viemos informar que houve alterações em relação à prova: " + notificacao["prova"] + ".\r\n" +
        "A prova realizar-se-á na sala " + notificacao["sala"] + " no dia " + notificacao["data"] + " às " + notificacao["hora"] + "H.";
        const newmessage = { notificacao , "mensagem":message}
        return newmessage;
    }

    static composeGradedExamMessage(notificacao) {
        const message = "Olá, " + notificacao["numero"] +"!\r\n" + " Viemos informar que foram lançadas as suas notas da prova: " + notificacao["prova"]+ ".";
        const newmessage = { notificacao , "mensagem":message}
        return newmessage;
    }

    static composeUnavailableRoomMessage(notificacao){
        const message = "Olá, " + notificacao["numero"] +"!\r\n" + " Viemos informar que a sala " + notificacao["sala"]+ " se encontra indisponível. Assim, a realização do teste "+ notificacao["prova"] +
        " terá de ser feita noutra sala.";
        const newmessage = { notificacao , "mensagem":message}
        return newmessage;
    }

}

module.exports.MessageNotificationsComposer = MessageNotificationsComposer;
