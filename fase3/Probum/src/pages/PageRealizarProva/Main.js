import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'flowbite-react'
import axios from 'axios'

import { numMecanografico } from '../../auth/auth'
import MainLayout from '../Layouts/Main';
import Relogio from '../../components/Relogio/Relogio';
import { apiRoute } from '../../APIGateway/config';

const ESCOLHA_MULTIPLA = 1
const VERDADEIRO_FALSO = 2

async function submeterResolucao(resolucao) {
    let response = await axios.post(apiRoute('/provas/resolucoes'),resolucao)
    return response.data
}

const QuestVF = ({ visivel, questao, setResposta }) => {
    const [opcoesEscolhidas, setOpcoesEscolhidas] = useState([])

    const handleChangeVF = (e,value) => {
        let re = /q(\d+)op(\d+)/
        let optionID = parseInt(re.exec(e.target.name)[2])

        setOpcoesEscolhidas(prevOpcoes => {
            if(value === 'V'){
                return [...prevOpcoes, optionID];
            } else {
                return prevOpcoes.filter(opId => opId !== optionID);
            }
        })
    }

    useEffect(() => {
        setResposta(questao.id, { opcoesEscolhidas: opcoesEscolhidas })
    }, [opcoesEscolhidas, questao.id])

    return (
        <div style={{ display: visivel ? 'block' : 'none' }}>
            <p><strong>Cotação: </strong>{questao.cotacao}</p>
            <p>{questao.descricao}</p>
            <div>
                <table>
                    <tbody>
                        {questao.opcoes.map(opcao =>
                            <tr key={opcao.id}>
                                <td>{opcao.texto}</td>
                                <td>
                                    <label>Verdadeira</label>
                                    <input type="radio" onChange={(e) => handleChangeVF(e,'V')} name={`q${questao.id}op${opcao.id}`}/>
                                    <label>Falsa</label>
                                    <input type="radio" onChange={(e) => handleChangeVF(e,'F')} name={`q${questao.id}op${opcao.id}`}/>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const QuestEscMultipla = ({ visivel, questao, setResposta }) => {
    const [opcoesEscolhidas, setOpcoesEscolhidas] = useState([])

    const handleChangeCheckBox = (e) => {
        let re = /q(\d+)op(\d+)/
        let optionID = parseInt(re.exec(e.target.name)[2])
        setOpcoesEscolhidas(prevOpcoes => {
            if (e.target.checked) {
                return [...prevOpcoes, optionID];
            } else {
                return prevOpcoes.filter(opId => opId !== optionID);
            }
        });
    }

    useEffect(() => {
        setResposta(questao.id, { opcoesEscolhidas: opcoesEscolhidas })
    }, [opcoesEscolhidas, questao.id])

    return (
        <div style={{ display: visivel ? 'block' : 'none' }}>
            <p><strong>Cotação: </strong>{questao.cotacao}</p>
            <p>{questao.descricao}</p>
            <div>
                <table>
                    <tbody>
                        {questao.opcoes.map(opcao =>
                            <tr key={opcao.id}>
                                <td>{opcao.texto}</td>
                                <td>
                                    <input type="checkbox" onChange={handleChangeCheckBox} name={`q${questao.id}op${opcao.id}`} checked={opcoesEscolhidas.includes(opcao.id)} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const QuestaoForm = ({ visivel, questao, setResposta }) => {
    if (questao.tipo === ESCOLHA_MULTIPLA) {
        return <QuestEscMultipla questao={questao} setResposta={setResposta} visivel={visivel} />
    } else if (questao.tipo === VERDADEIRO_FALSO) {
        return <QuestVF questao={questao} setResposta={setResposta} visivel={visivel} />
    }
}

const Page = ({ provaData }) => {
    const [indiceQuestaoVisivel, setIndiceQuestaoVisivel] = useState(0)
    const [visibilidadeQuestoes, setVisibilidadeQuestoes] = useState(provaData.versao.questoes.map((questao, i) => { return { [i]: false } }).reduce((a, b) => { return { ...a, ...b } }))
    const [resolucao, setResolucao] = useState({
        idAluno: numMecanografico(),
        idProva: provaData._id,
        idVersao: provaData.versao.id,
        respostas: provaData.versao.questoes.map(questao => {
            return {
                idQuestao: questao.id,
                cotacao: 0,
                respostaAberta: "",
                opcoesEscolhidas: []
            }
        })
    })

    const setResposta = (idQuestao, resposta) => {
        let indiceRespostas = resolucao.respostas.findIndex(resp => resp.idQuestao === idQuestao)
        let respostaNaLista = resolucao.respostas[indiceRespostas]
        respostaNaLista.opcoesEscolhidas = resposta.opcoesEscolhidas || []
        respostaNaLista.respostaAberta = resposta.respostaAberta || ""
        let novaListaRespostas = [
            ...resolucao.respostas.slice(0, indiceRespostas),
            respostaNaLista,
            ...resolucao.respostas.slice(indiceRespostas + 1, resolucao.respostas.length)
        ]
        setResolucao({ ...resolucao, respostas: novaListaRespostas })
        console.log(resolucao) //!DEBUG
    }

    const avancarQuestao = () => {
        if (indiceQuestaoVisivel + 1 < provaData.versao.questoes.length) {
            setVisibilidadeQuestoes({
                ...visibilidadeQuestoes,
                ...{ [indiceQuestaoVisivel]: false },
                ...{ [indiceQuestaoVisivel + 1]: true }
            })
            setIndiceQuestaoVisivel(indiceQuestaoVisivel + 1)
        }
    }

    const retrocederQuestao = () => {
        if (indiceQuestaoVisivel - 1 >= 0) {
            setVisibilidadeQuestoes({
                ...visibilidadeQuestoes,
                ...{ [indiceQuestaoVisivel]: false },
                ...{ [indiceQuestaoVisivel - 1]: true }
            })
            setIndiceQuestaoVisivel(indiceQuestaoVisivel - 1)
        }
    }

    useEffect(() => {
        setVisibilidadeQuestoes({ ...visibilidadeQuestoes, '0': true }) //> para apresentar a primeira questão
    }, [])

    const submitResolucao = () => {
        submeterResolucao(resolucao)
        .then((result) => {
            alert('Resolução submetida com sucesso!')
            window.location = `/homealuno/${numMecanografico()}`
        }).catch((err) => {
            alert(`Problema no envio da resolução: ${err.message}`)
        });
    }

    return (<>
        <p>Início: {provaData.versao.data}, hora actual: <Relogio /></p>
        <hr />
        {provaData.versao.questoes.map((questao, i) =>
            <QuestaoForm questao={questao} setResposta={setResposta} visivel={visibilidadeQuestoes[i]} key={i} />
        )}
        <div className="grid grid-rows-1 grid-flow-col gap-4">
            <div className='flex justify-start items-end'>
                {provaData.retrocesso || true ?
                    <Button color='blue' onClick={retrocederQuestao}>Questão anterior</Button>
                    : <></>}
            </div>
            <div className='flex justify-end items-end'>
                <Button color='blue' onClick={avancarQuestao}>Próxima questão</Button>
            </div>
        </div>
        <div className='flex justify-center'>
            <Button color='warning' onClick={submitResolucao}>Terminar prova</Button>
        </div>
    </>)
}

const RealizarProva = () => {
    let { state } = useLocation();
    return (<MainLayout pagina={<Page provaData={state} />} />)
}

export default RealizarProva