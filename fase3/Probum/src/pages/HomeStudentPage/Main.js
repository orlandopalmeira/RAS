import React,{ useState } from 'react';
import MainLayout from "../Layouts/Main";
import { useParams } from 'react-router-dom';
import NotificationCard from '../../components/Notification/notification';
import io from 'socket.io-client';
import './home.css';

const Page = () => {
    const {numMecanografico} = useParams() //numero de aluno
    const [notification, setNotification] = useState('');                        //state set do texto da notificacao
    const [notificationVisibility, setnotificationVisibility] = useState(false); //state set da visibilidade da notificacao

    
    //websocket para ficar à escuta de notificacoes (suposto colocar só depois do login e nas paginas correspondentes ao aluno- coloquei no login apenas para testar)
    const socket = io(`http://localhost:8877?numero=${numMecanografico}`); // concatenar o número do aluno atual (está hardcoded)
        socket.on('notification', (message) => {
            setNotification(message);
            setnotificationVisibility(true);
    });


    return (
        <>
            <NotificationCard id="notificationcard" text={notification} visible={notificationVisibility} />
            <div style={{ fontWeight: 'bold',fontSize: "35px"}}>Dashboard - Home Page</div> 
            <div style={{ fontSize: "20px" }}>Bem-Vindo, {numMecanografico}</div> 
            <div className="slogan-image-container">
                <div>
                    <h1><p className="slogan">Elevate Learning and Embrace Progress <br /> Probum - Online Exams System</p></h1>
                    <p style={{ letterSpacing: '2px',fontFamily: 'serif',fontSize: "18px",marginTop:"-50px" }}>Experience an unique journey into the future of education with Probum system. Our online exams system empowers learners with a user-friendly interface, innovative features, and secure assessments. Probum ensures a transformative educational experience, where success and technology meet together.</p>
                </div>
                <img src="/_248c1cfe-53a9-4558-940a-ac43243e1724.jpg" alt="Description of the image" />
            </div>
        </>
    )
}

const HomeStudentPage = () => {
        return (
            <MainLayout pagina={<Page />}/>
        )
}    

export default HomeStudentPage;