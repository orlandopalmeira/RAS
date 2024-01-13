import axios from "axios";
import {apiRoute} from "../../APIGateway/config";

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import ModalInfo from "../../components/Modals/ModalInfo";

async function sendEditPerfilData(email, password, numMecanografico, nome) {
    const userEditPerfilData = {
        nome: nome,
        email: email,
        password: password,
        numMecanografico: numMecanografico
    }
    return (await axios.post(apiRoute('/editPerf'), userEditPerfilData)).data;
}

const EditPerfilPage = () => {
    //> Informação para ser apresentada no modal
    //> Função para apresentar o modal
    //> Dados do formulário de registo
    const [modalTitle, setModalTitle] = useState(''), [modalMessage, setModalMessage] = useState(''), [modalVisible, setModalVisible] = useState(false),
        modal = (title, message) => {
            setModalTitle(title);
            setModalMessage(message);
            setModalVisible(true);
        }, [email, setEmail] = useState(''), [password, setPassword] = useState(''), [numMecanografico, setNumMecanografico] = useState(''), [name, setName] = useState(''),
        handleSubmit = (e) => {
            e.preventDefault();
            sendEditPerfilData(email, password, numMecanografico, name)
                .then((result) => {
                    Cookies.set('token', result.token); //> define o cookie "token" para ser usado na autenticação
                    if (result.type === "aluno") window.location = '/homealuno/' + result.numMecanografico
                    else if (result.type === "docente") window.location = '/criarprova'
                }).catch((err) => {
                modal('Registo Inválido', err.response.data.message);
            });
        };


    return (
        <>
            {/* <NotificationCard id="notificationcard" text={notification} visible={notificationVisibility} onClick={closeNotification} /> */}
            <ModalInfo title={modalTitle} message={modalMessage} isOpen={modalVisible} onRequestClose={() => setModalVisible(false)} />
            <div className="min-h-screen flex items-center justify-center">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Nome
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="name"
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numMecanografico">
                            Número Mecanográfico
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="numMecanografico"
                            type="text"
                            placeholder="Número Mecanográfico"
                            value={numMecanografico}
                            onChange={(e) => setNumMecanografico(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button typeof='submit'
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit">
                            Submeter
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditPerfilPage;