//> Página de login
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { isDocente, isAluno, isTecnico, numMecanografico } from "../../auth/auth"


import { apiRoute } from '../../APIGateway/config'
import ModalInfo from '../../components/Modals/ModalInfo';


async function sendLoginData(email, password) {
    const userLoginData = {
        email: email,
        password: password
    }
    return (await axios.post(apiRoute('/login'), userLoginData)).data;
}

const LoginPage = () => {

    //> Informação para ser apresentada no modal
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    //> Função para apresentar o modal
    const modal = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    }

    //> Dados do formulário de login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //> Submete dados do formulário de login
    const handleSubmit = (e) => {
        e.preventDefault();
        sendLoginData(email, password)
            .then((result) => {
                console.log("resultado:")
                console.log(result.token)
                Cookies.set('token', result.token); //> define o cookie "token" para ser usado na autenticação
                if(isAluno()) window.location = '/homealuno/'+numMecanografico()
                else if(isDocente()) window.location = '/criarprova'
                else if(isTecnico()) window.location = '/gerirsalas'
            }).catch((err) => {
                let message = "O email ou a password que inseriu estão incorretos. Tente novamente."
                modal('Acesso negado', message);
            });
    };
    
    const linkStyle = {
        margin: "0.4rem",
        textDecoration: "none",
        color: 'blue'
    };

    return (
        <>
            <ModalInfo title={modalTitle} message={modalMessage} isOpen={modalVisible} onRequestClose={() => setModalVisible(false)} />
            <div className="min-h-screen flex items-center justify-center">
                <form className="bg-white shadow-2xl rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
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
                    <div className="flex items-center justify-between">
                        <div style={{justifyContent: 'center'}}>
                        <button typeof='submit' style={{ marginLeft:'90px'}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Entrar
                        </button>
                        <label style={{ marginTop:'10px'}} className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Não possui uma conta? Registe-se<Link style={linkStyle} to={`/register`}>aqui.</Link>
                        </label>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
