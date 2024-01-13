import React, { useState } from 'react';
import MainLayout from "../Layouts/Main";

import { numMecanografico } from '../../auth/auth'
import FormProvaNameAndAlunos from "./FormProvaNameAndAlunos";
import FormularioDataAndDuracao from './FormDataAndDuracao';
import FormAleatorizacaoRetrocesso from './FormAleatorizacaoRetrocesso';
import FormVersoes from './FormVersoes';


const Page = () => {

    //> Informações da prova em memória
    const [prova, setProva] = useState({
        nome: '',
        docentes: [numMecanografico()],
        unidadeCurricular: '',
        retrocesso: false,
        versoes: []
    })

    const setProvaData = (data) => {
        setProva({...prova, ...data}) //> Acrescenta os campos do objecto "data" nos do objecto "prova"
    }

    //> Adiciona uma versão à prova
    // const addVersao = (versao) => {
    //     setProva({...prova, versoes: [...(prova.versoes), versao]})
    // }

    //> Adiciona uma questão a uma versão
    const addQuestaoInVersao = (versaoKey, questao) => {
        const novaProva = { ...prova };
        novaProva.versoes[versaoKey].questoes.push(questao)
        setProva(novaProva)
    }
 
    //> Dados da interface gráfica
    const [displayForm1, setDisplayForm1] = useState('block') //> para controlar a visibilidade do formulário de nome de prova e alunos
    const [displayForm2, setDisplayForm2] = useState('none') //> para controlar a visibilidade do formulário da data+hora e duração da prova
    const [displayForm3, setDisplayForm3] = useState('none') //> para controlar a visibilidade do formulário de versões, aleatorização de ordem de questões e retrocesso 
    const [displayForm4, setDisplayForm4] = useState('none') //> para controlar a visibilidade do formulário de associar

    return (<>
        <h1 className="text-5xl mb-8">Criar prova</h1>
        {/*//> Formulário de nome de prova e ficheiro de alunos */}
        <FormProvaNameAndAlunos
            currentDisplay={displayForm1}
            setDisplay={setDisplayForm1}
            nextDisplay={setDisplayForm2}
            setProvaData={setProvaData}  //> altera os dados da prova em memória
            provaData={prova}
        />
        {/*//> Formulário de nome data+hora e duracao da prova*/}
        <FormularioDataAndDuracao
            setProvaData={setProvaData}  //> altera os dados da prova em memória
            currentDisplay={displayForm2}
            setDisplay={setDisplayForm2}
            setNextDisplay={setDisplayForm3}
            provaData={prova}
        />
        {/*//> Formulário de ordem aleatória de questões e retrocesso*/}
        <FormAleatorizacaoRetrocesso
            currentDisplay={displayForm3}
            setDisplay={setDisplayForm3}
            setNextDisplay={setDisplayForm4}
            setProvaData={setProvaData}
            provaData={prova}
        />
        {/*//>Formulário onde são associadas as versões a horários e são criadas questões  */}
        <FormVersoes
            currentDisplay={displayForm4}
            setDisplay={setDisplayForm4}
            provaData={prova}
            addQuestaoInVersao={addQuestaoInVersao}
            
        />
    </>)
}

const CreateProvaPage = () => {
    return (
        <MainLayout pagina={<Page />} />
    )
}

export default CreateProvaPage;