import React,{ useState } from 'react';
import MainLayout from "../Layouts/Main";
import NotificationItem from "../../components/Notification/notificationitem"
import NotificationCard from '../../components/Notification/notification';
import { useParams } from 'react-router-dom';
import { apiRoute } from '../../APIGateway/config'
import axios from 'axios';
import io from 'socket.io-client';

const Page = () => {
    const {numMecanografico} = useParams() //numero de aluno
    const [dataNotifications,setdataNotifications]  = React.useState(); 
    const [notification, setNotification] = useState('');                        //state set do texto da notificacao
    const [notificationVisibility, setnotificationVisibility] = useState(false); //state set da visibilidade da notificacao

    
    React.useEffect(()=>{
        async function getNotifications() {
            var response = await axios.get(apiRoute(`/notifications/${numMecanografico}`))
            console.log(response)
            setdataNotifications(response)
        }
        getNotifications();
    },[])

    //websocket para ficar à escuta de notificacoes (suposto colocar só depois do login e nas paginas correspondentes ao aluno- coloquei no login apenas para testar)
    const socket = io(`http://localhost:8877?numero=${numMecanografico}`); // concatenar o número do aluno atual (está hardcoded)
        socket.on('notification', (message) => {
            setNotification(message);
            setnotificationVisibility(true);
    });

    const closeNotification = () => {
        setnotificationVisibility(false);
    }

    if (dataNotifications) {
        //let a = JSON.stringify(dataNotifications.data.notificacoes);
        let notificacoes = dataNotifications.data.notificacoes;
//                    <td>{JSON.stringify(obj.notificacao.notificacao)}</td>
//        return <td>{JSON.stringify(obj.mensagem)}</td>

        return (
            <>
                <NotificationCard id="notificationcard" text={notification} visible={notificationVisibility} onClick={closeNotification} />
                <div style={{ fontWeight: 'bold',fontSize: "25px" }}>Dashboard Notifications</div> 
                {
                    notificacoes.map(obj=>{
                        return <NotificationItem title={obj.notificacao.notificacao} message={obj.mensagem}/>
                })
                
                }
            </>
        )
    }else{
        return <div></div>;
    }
}

const NotificationsPage = () => {
        return (
            <MainLayout pagina={<Page />}/>
        )
}    

export default NotificationsPage;