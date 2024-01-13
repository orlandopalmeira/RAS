import React, { useState } from "react"
import { Button, Modal } from 'flowbite-react';
import axios from 'axios'

import { apiRoute } from "../../APIGateway/config";

const ESCOLHA_MULTIPLA = 1
const VERDADEIRO_FALSO = 2

const NewTH = ({ children }) => (<th className="text-left">{children}</th>)
const NewTD = ({ children }) => (<td><div className="ml-4">{children}</div></td>)

const todasAsVersoesTemQuestoes = (prova) => {
    return prova.versoes.every(versao => versao.questoes.length > 0);
}

const submitProva = (prova) => {
    const fieldsProva = ['nome', 'docentes', 'unidadeCurricular', 'retrocesso', 'aleatorizacao', 'versoes']
    const fieldsVersao = ['alunos', 'sala', 'edificio', 'piso', 'data', 'questoes', 'numVersao', 'duracao', '_id'] //> _id é o id da sala
    const fieldsQuestao = ['descricao', 'tipo', 'cotacao', 'desconto', 'opcoes']
    const fieldsOpcao = ['texto', 'correcta']
    //> Eliminação de campos desnecessários
    Object.keys(prova).forEach(field => {
        if (!fieldsProva.find(f => f === field)) {//> O campo da prova é desnecessário na base de dados 
            delete prova[field]
        }
    })
    prova.versoes.forEach(versao => {
        Object.keys(versao).forEach(field => {
            if (!fieldsVersao.find(f => f === field)) {//> O campo da versao é desnecessário na base de dados 
                delete versao[field]
            }
        })
        versao.questoes.forEach(questao => {
            Object.keys(questao).forEach(field => {
                if (!fieldsQuestao.find(f => f === field)) {//> O campo da questao é desnecessário na base de dados 
                    delete questao[field]
                }
            })
            questao.opcoes.forEach(opcao => {
                Object.keys(opcao).forEach(field => {
                    if (!fieldsOpcao.find(f => f === field)) {//> O campo da questao é desnecessário na base de dados 
                        delete opcao[field]
                    }
                })
            })
        })
    });
    //! TALVEZ NOTIFICAR AQUI OS ALUNOS INSCRITOS
    return axios.post(apiRoute('/provas/register'), prova)
        .then((result) => {
            return result
        }).catch((err) => {
            alert(err.response.data.msg)
            throw err
        });
}

const QuestaoForm = ({ debug, addQuestao, onRequestClose, isOpen }) => {
    const [questao, setQuestao] = useState({
        descricao: '',
        tipo: ESCOLHA_MULTIPLA,
        cotacao: 0,
        desconto: 0,
        opcoes: []
    })

    const handleSubmit = () => {
        addQuestao({ ...questao })
        setQuestao({
            descricao: '',
            tipo: ESCOLHA_MULTIPLA,
            cotacao: 0,
            desconto: 0,
            opcoes: []
        })
        debug()
        onRequestClose()
    }

    const setQuestaoData = (data) => {
        setQuestao({ ...questao, ...data })
    }

    const addOpcao = (texto, correcta) => {
        setQuestao({ ...questao, opcoes: [...(questao.opcoes), { texto: texto, correcta: correcta }] })
    }

    const setOpcao = (indice, texto, correcta) => {
        let opcoes = questao.opcoes
        let opcao = opcoes[indice]
        if (texto != null) {
            opcao.texto = texto
        }
        if (correcta != null) {
            opcao.correcta = correcta
        }
        setQuestao({ ...questao, opcoes: [...opcoes.slice(0, indice), opcao, ...opcoes.slice(indice + 1, opcoes.length)] })
    }

    return (
        <>
            <Modal show={isOpen} onClose={onRequestClose} style={{ maxHeight: '100vh' }}>
                <Modal.Header>Nova questão</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                        <input type="radio" name="tipo" value={`${ESCOLHA_MULTIPLA}`} onChange={(e) => setQuestaoData({ tipo: ESCOLHA_MULTIPLA })} checked={questao.tipo === ESCOLHA_MULTIPLA} />
                        <label>Escolha múltipla</label> <br />
                        <input type="radio" name="tipo" value={`${VERDADEIRO_FALSO}`} onChange={(e) => setQuestaoData({ tipo: VERDADEIRO_FALSO })} checked={questao.tipo === VERDADEIRO_FALSO} />
                        <label>Verdadeiro/Falso</label>

                        <div className="sm:col-span-4">
                            <label htmlFor="Nome da prova" className="block text-sm font-medium leading-6 text-gray-900">
                                Descrição
                            </label>
                            <div className="mt-2 mb-4">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="Descrição da questão"
                                        onChange={(e) => setQuestaoData({ descricao: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="Nome da prova" className="block text-sm font-medium leading-6 text-gray-900">
                                Cotação
                            </label>
                            <div className="mt-2 mb-4">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="number"
                                        min="0"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="Pontuação máxima da questão"
                                        onChange={(e) => setQuestaoData({ cotacao: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="Nome da prova" className="block text-sm font-medium leading-6 text-gray-900">
                                Desconto
                            </label>
                            <div className="mt-2 mb-4">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="number"
                                        min="0"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="Desconto em caso de resposta incorrecta"
                                        onChange={(e) => setQuestaoData({ desconto: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {questao.tipo === ESCOLHA_MULTIPLA && (
                            <>
                                <button onClick={() => addOpcao('', false)}><u>Adicionar opção</u></button><br />
                                {questao.opcoes.map((opcao, i) =>
                                    <div key={i}>
                                        <label>Opção</label>
                                        <input type="text" onChange={(e) => setOpcao(i, e.target.value, null)} className="border-black	border-2" />

                                        <input onChange={(e) => setOpcao(i, null, true)} className="ml-2" type="radio" name={`correcta${i}`} />
                                        <label>Correcta</label>
                                        <input onChange={(e) => setOpcao(i, null, false)} className="ml-2" type="radio" name={`correcta${i}`} />
                                        <label>Incorrecta</label>
                                    </div>
                                )}
                            </>
                        )}
                        {questao.tipo === VERDADEIRO_FALSO && (
                            <>
                                <button onClick={() => addOpcao('', false)}><u>Adicionar afirmação</u></button><br />
                                {questao.opcoes.map((opcao, i) =>
                                    <div key={i}>
                                        <label>Afirmação</label>
                                        <input type="text" onChange={(e) => setOpcao(i, e.target.value, null)} className="border-black	border-2" />

                                        <input onChange={(e) => setOpcao(i, null, true)} className="ml-2" type="radio" name={`correcta${i}`} />
                                        <label>Verdadeira</label>
                                        <input onChange={(e) => setOpcao(i, null, false)} className="ml-2" type="radio" name={`correcta${i}`} />
                                        <label>Falsa</label>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="gray" style={{ background: 'lightblue' }} onClick={() => handleSubmit()}>Criar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const VersaoForm = ({ versao, numVersao, addQuestaoInVersao, debug }) => {
    const estiloTabela = {
        border: '1px solid black',
        borderCollapse: 'collapse',
    };
    //> Formulário de criar questão
    const [openFormQuestoes, setOpenFormQuestoes] = useState(false)
    const addQuestao = (questao) => addQuestaoInVersao(numVersao, questao)
    return (
        <>
            <QuestaoForm debug={debug} addQuestao={addQuestao} isOpen={openFormQuestoes} onRequestClose={() => setOpenFormQuestoes(false)} />
            <div className="text-2xl mt-4"><b>Versão n.º {numVersao + 1}</b></div>
            <table className="mt-4">
                <tbody>
                    <tr>
                        <NewTH>Edifício:</NewTH>
                        <NewTD>{versao.edificio}</NewTD>
                    </tr>
                    <tr>
                        <NewTH>Sala:</NewTH>
                        <NewTD>{versao.numSala}</NewTD>
                    </tr>
                    <tr>
                        <NewTH>Piso:</NewTH>
                        <NewTD>{versao.piso}</NewTD>
                    </tr>
                    <tr>
                        <NewTH>Capacidade:</NewTH>
                        <NewTD>{versao.capacidade}</NewTD>
                    </tr>
                    <tr>
                        <NewTH>Alunos:</NewTH>
                        <NewTD>{`${(versao.alunos || []).length} alunos`}</NewTD>
                    </tr>
                </tbody>
            </table>
            <div>
                <strong className="text-2xl">Questões</strong>
                <button onClick={() => setOpenFormQuestoes(true)} className="ml-4"><u>Adicionar questão</u></button><br />
                {versao.questoes.map((questao, indexQ) => {
                    if (questao.tipo === ESCOLHA_MULTIPLA) {
                        return (
                            <div key={indexQ} className="border-2 border-gray-500 p-4">
                                <strong>Questão n.º {indexQ + 1}</strong>
                                <p>Cotação: {questao.cotacao} pontos, Desconto: {questao.desconto} pontos</p>
                                <p><b>Descrição: </b>{questao.descricao}</p>
                                <p><b>Opções</b></p>
                                <table style={estiloTabela}>
                                    <thead>
                                        <tr>
                                            <th style={estiloTabela}>Opção</th>
                                            <th style={estiloTabela}>Correcta/Incorrecta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questao.opcoes.map((opcao, indexO) => {
                                            return (
                                                <tr key={indexO}>
                                                    <td style={estiloTabela}>{opcao.texto}</td>
                                                    <td style={estiloTabela}>{opcao.correcta ? 'Correcta' : 'Incorrecta'}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )
                    } else {
                        return (
                            <div key={indexQ} className="border-2 border-gray-500 p-4">
                                <strong>Questão n.º {indexQ + 1}</strong>
                                <p>Cotação: {questao.cotacao} pontos, Desconto: {questao.desconto} pontos</p>
                                <p><b>Descrição: </b>{questao.descricao}</p>
                                <p><b>Opções</b></p>
                                <table style={estiloTabela}>
                                    <thead>
                                        <tr>
                                            <th style={estiloTabela}>Afirmação</th>
                                            <th style={estiloTabela}>Verdadeira/Falsa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questao.opcoes.map((opcao, indexO) => {
                                            return (
                                                <tr key={indexO}>
                                                    <td style={estiloTabela}>{opcao.texto}</td>
                                                    <td style={estiloTabela}>{opcao.correcta ? 'Verdadeira' : 'Falsa'}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                })}
            </div>
            <hr />
        </>
    )
}

const FormVersoes = ({ currentDisplay, setDisplay, provaData, addQuestaoInVersao }) => {
    const sendProva = () => {
        console.log(provaData)
        submitProva(provaData) //! DEBUG
            .then((result) => {
                alert('Prova submetida com sucesso')
                window.location = '/criarprova'
            }).catch((err) => {
                alert(err.response.data.msg)
            });
    }

    return (
        <div style={{ display: currentDisplay }}>
            <table>
                <tbody>
                    <tr>
                        <NewTH>Nome da prova:</NewTH>
                        <NewTD>{provaData.nome}</NewTD>
                    </tr>
                    <tr>
                        <NewTH>Unidade curricular:</NewTH>
                        <NewTD>{provaData.unidadeCurricular}</NewTD>
                    </tr>
                    <tr>
                        <NewTH>Retrocesso nas questões:</NewTH>
                        <NewTD>{provaData.retrocesso ? "Sim" : "Não"}</NewTD>
                    </tr>
                    <tr>
                        <NewTH>Aleatorização da ordem de questões:</NewTH>
                        <NewTD>{provaData.aleatorizacao ? "Sim" : "Não"}</NewTD>
                    </tr>
                    <tr>
                        <NewTH>Número de versões:</NewTH>
                        <NewTD>{(provaData.versoes || []).length.toString()}</NewTD>
                    </tr>
                </tbody>
            </table>
            <Button
                color="blue"
                disabled={!todasAsVersoesTemQuestoes(provaData)}
                title={todasAsVersoesTemQuestoes(provaData) ? 'Registar prova' : 'Existem ainda versões sem questões'}
                onClick={() => sendProva()}
            >Registar prova</Button>
            <hr className="mt-2 border-2" />

            <div>
                {(provaData.versoes || []).map((versao, i) =>
                    <VersaoForm
                        versao={versao}
                        numVersao={i}
                        addQuestaoInVersao={addQuestaoInVersao}
                        key={i}
                        debug={() => console.log(provaData)}
                    />
                )}
            </div>

        </div>
    )
}

export default FormVersoes;