import React, { useState } from 'react';
import axios from 'axios';

import { apiRoute } from '../../APIGateway/config'
import ModalPropostaCalendarizacao from './ModalPropostaCalendarizacao';

const getPropostasCalendarizacao = async (alunos, dataHora, duracao) => {
    let body = { alunos, dataHora, duracao }
    body.dataHora = body.dataHora.replace('T', ' ')
    let response = (await axios.post(apiRoute('/salas/calendarizacao'), body)).data
    return response
}

/**
 * >currentDisplay: 'block' ou 'none', indica se o formulário deve estar visível ou não
 * >setDisplay(block ou none): Função que altera a visibilidade do formulário
 * >setProvaData(data): Função que altera os dados da prova em memória
 * >provaData: Dados actuais da prova
 * >alunos: Lista de alunos que vão ser inscritos na prova.
 */
const FormularioDataAndDuracao = ({ currentDisplay, setDisplay, setNextDisplay, setProvaData, provaData }) => {
    const [dataHoraProva, setDataHoraProva] = useState('')
    const [duracaoProva, setDuracaoProva] = useState(0)

    //> Modal de apresentação de propostas de calendarizacao
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPropostas, setModalPropostas] = useState([])

    //> Função para apresentar o modal
    const modal = (propostasCalendarizacao) => {
        setModalPropostas(propostasCalendarizacao);
        setModalVisible(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        getPropostasCalendarizacao(provaData.alunos, dataHoraProva, parseInt(duracaoProva))
            .then((result) => {
                if (!result || result.length === 0) { //> Não existe uma calendarizacão possível para o que o docente quer
                    alert('Não foi possível encontrar obter uma calendarização tendo em conta o número de alunos e as salas disponíveis.\nPor favor, insira outra data e hora para a realização da prova.')
                } else {
                    modal(result) //> Apresenta as propostas de calendarizacao
                    console.log(result)
                    setProvaData({ 
                        versoes: result.map((v,i) => {
                            v.numVersao = i+1;
                            v.data = dataHoraProva.replace('T',' ');
                            v.duracao = parseInt(duracaoProva);
                            v.sala = result[i].numSala;
                            v.piso = result[i].piso;
                            v.edificio = result[i].edificio;
                            v.questoes=[];
                            return v
                        }) 
                    }) //> considero como versão porque há uma versão por horário
                    setDisplay('none') //> Esconde este formulário
                    setNextDisplay('block') //> Apresenta o próximo formulário
                    console.log(provaData) //! DEBUG
                }
            }).catch((err) => {
                alert(err.response.data.msg);
            });
    };

    return (
        <div style={{ display: currentDisplay }}>
            <ModalPropostaCalendarizacao propostas={modalPropostas} isOpen={modalVisible} onRequestClose={() => setModalVisible(false)} />
            <form onSubmit={handleSubmit}>
                <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Data e hora da prova
                    </label>
                    <div className="mt-2 mb-4">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                                id="dataHoraProva"
                                type="datetime-local"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                value={dataHoraProva}
                                onChange={(e) => setDataHoraProva(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                step="60"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Duração da prova (em minutos)
                    </label>
                    <div className="mt-2 mb-4">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                                id="duracaoProva"
                                type="number"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                value={duracaoProva}
                                onChange={(e) => setDuracaoProva(e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </div>
                <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submeter
                </button>
            </form>
        </div>
    );
};

export default FormularioDataAndDuracao;
