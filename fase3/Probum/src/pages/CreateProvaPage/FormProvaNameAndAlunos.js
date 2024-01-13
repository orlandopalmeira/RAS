import axios from "axios";
import React, { useState } from 'react';

import { apiRoute } from '../../APIGateway/config'
import ModalInfo from "../../components/Modals/ModalInfo";

const sendFormData = async (provaName, conteudoJsonFile) => {
    const data = {
        provaName: provaName,
        alunos: conteudoJsonFile
    }

    return (await axios.post(apiRoute('/provas/checkNameAndAlunos'), data)).data;
}

const FormProvaNameAndAlunos = ({setProvaData, provaData, currentDisplay, setDisplay, nextDisplay}) => {
    //> Nome da prova e ficheiro de alunos para submissão
    const [provaName, setProvaName] = useState('');
    const [ucName, setUcName] = useState('');
    const [jsonFile, setJsonFile] = useState(null);

    //> Dados de um modal para apresentar possíveis avisos
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    //> Guarda o ficheiro JSON fornecido pelo docente
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setJsonFile(file);
    };

    //> Função para apresentar o modal
    const modal = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        setShowModal(true);
    }

    //> Tratamento da submissão do formulário
    const tratamentoSubmissao = (event) => {
        event.preventDefault();

        if (jsonFile) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const conteudoJsonFile = JSON.parse(e.target.result);
                    sendFormData(provaName, conteudoJsonFile)
                        .then((result) => {
                            setProvaData({
                                nome: provaName,
                                unidadeCurricular: ucName,
                                alunos: conteudoJsonFile.alunos
                            });
                            provaData.nome = provaName;
                            setDisplay('none') //> esconde este formulário
                            nextDisplay('block') //> apresenta o próximo formulário
                        }).catch((err) => {
                            if (err.response) {
                                modal('Erro na submissão', err.response.data.msg);
                            } else {
                                modal('Erro na submissão', err.message);
                            }
                        });
                } catch (err) {
                    modal('Erro ao analisar o ficheiro JSON:', err.message);
                }
            };

            reader.readAsText(jsonFile); //> faz trigger do onload acima
        } else {
            modal('Atenção', 'Não foi fornecido um ficheiro JSON com os alunos a inscrever.');
        }
    }

    //> Componente gráfico do formulário
    return (
        <div style={{display: currentDisplay}}>
            <ModalInfo title={modalTitle} message={modalMessage} isOpen={showModal} onRequestClose={() => setShowModal(false)} />
            <form onSubmit={tratamentoSubmissao}>
                <div className="sm:col-span-4">
                    <label htmlFor="Nome da prova" className="block text-sm font-medium leading-6 text-gray-900">
                        Nome da prova
                    </label>
                    <div className="mt-2 mb-4">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                                type="text"
                                name="name"
                                id="Nome da prova"
                                autoComplete="Nome da prova"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Insira o nome da prova"
                                onChange={(e) => setProvaName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-4">
                    <label htmlFor="Nome da prova" className="block text-sm font-medium leading-6 text-gray-900">
                        Unidade curricular
                    </label>
                    <div className="mt-2 mb-4">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                                type="text"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Insira a unidade curricular"
                                onChange={(e) => setUcName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-4">
                    <label htmlFor="Ficheiro de alunos" className="block text-sm font-medium leading-6 text-gray-900">
                        Ficheiro de alunos
                    </label>
                    <div className="mt-2 mb-4">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                                type="file"
                                name="alunosFile"
                                id="Ficheiro de alunos"
                                autoComplete="Ficheiro de alunos"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                accept=".json"
                                onChange={handleFileChange}
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
    )
}

export default FormProvaNameAndAlunos;