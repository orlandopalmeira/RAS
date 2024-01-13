import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { isAuthenticated, isDocente, isAluno, numMecanografico } from "./auth/auth"
import LoginPage from "./pages/LoginPage/Main";
import CreateProvaPage from "./pages/CreateProvaPage/Main";
import HomeStudentPage from "./pages/HomeStudentPage/Main";
import NotificationsPage from "./pages/NotificationsPage/notificationspage";
import RegisterPage from "./pages/RegistationPage/registationpage";
import EditPerfilPage from "./pages/EditPerf/editperfpage";
import PageProvasNaoRealizadas from "./pages/PageProvasNaoRealizadas/Main";
import AddRoomsPage from "./pages/AddRoomsPage/AddRooms";
import RemoveRoomsPage from "./pages/RemoveRoomsPage/RemoveRooms";
import ManageRoomsPage from "./pages/ManageRoomsPage/ManageRooms";
import RealizarProva from "./pages/PageRealizarProva/Main";
import ClassificationsDetailsPage from "./pages/ClassificationsDetails/Main"
import ClassificationsAuto from "./pages/ClassificacaoAuto/Main";
import ClassificationsStudentPage from "./pages/PageClassifications/Main";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/notificacoes/:numMecanografico" element={<NotificationsPage />} />
                <Route path="/homealuno/:numMecanografico" element={<HomeStudentPage />} />
                <Route path="/provas/realizadas/:numMecanografico" element={isAluno() ? <ClassificationsStudentPage /> : <Navigate to="/login" />} />
                <Route path="/provas/realizadas/:numMecanografico/:idProva/:versao" element={isAluno() ? <ClassificationsDetailsPage /> : <Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/criarprova" element={isDocente() ? <CreateProvaPage /> : <Navigate to="/login" />} />
                <Route path="/editPerf" element={isAuthenticated() ? <EditPerfilPage /> : <Navigate to="/login" />} />
                <Route path="/provas/porRealizar" element={isAluno() ? <PageProvasNaoRealizadas numMecAluno={numMecanografico()} /> : <Navigate to="/login" />} />
                <Route path="/prova/realizar" element={isAluno() ? <RealizarProva /> : <Navigate to="/login" /> }/>
                <Route path="/classificarprovas" element={isDocente() ? <ClassificationsAuto /> : <Navigate to="/login"/>} />
                
                <Route path="/gerirsalas" element={<ManageRoomsPage />} />
                <Route path="/adicionarsalas" element={<AddRoomsPage />} /> 
                <Route path="/removersalas" element={<RemoveRoomsPage />} />
                <Route path="*" element={<Navigate to="/login" />}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
