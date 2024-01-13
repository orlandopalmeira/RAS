import React,{ useState } from 'react';
import MainLayout from "../Layouts/Main";
import { useParams } from 'react-router-dom';
import ProvaCard from '../../components/ProvaCard/prova';
import { apiRoute } from '../../APIGateway/config'
import axios from 'axios';

const Page = () => {
    const {numMecanografico} = useParams()
    const [provasdone,setProvasdone] = useState(null)

    React.useEffect(()=>{
        async function getallProvasdone() {
            var response = await axios.get(apiRoute(`/provas/alunos/${numMecanografico}/realizadas`))
            console.log(response)
            setProvasdone(response.data)
        }
        getallProvasdone();
    },[])



    if(provasdone!=null && provasdone.length>0){
        return(
            <>
                {
                    provasdone.map((prova)=>{
                       return <ProvaCard nome={prova.nome} uc={prova.unidadeCurricular} docentes={prova.docentes} numMecanografico={numMecanografico} provaid={prova._id} versao={prova.versao.numVersao} mensagem="Mostrar Prova"></ProvaCard>
                    })//<p>{JSON.stringify(prova)}</p>/
                }
            </>
        )
    }else{
        return(
            <>
                <div>Ainda não é possível observar as provas que você realizou.Tente mais tarde.</div>
            </>
        )
    }
}

const ClassificationsStudentPage = () => {
    return (
        <MainLayout pagina={<Page />}/>
    )
}    

export default ClassificationsStudentPage;