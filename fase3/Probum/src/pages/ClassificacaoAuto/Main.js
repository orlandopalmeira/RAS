import React,{ useState } from 'react';
import MainLayout from "../Layouts/Main";
import ClassifyCard from '../../components/Classify/classify';
import { apiRoute } from '../../APIGateway/config'
import axios from 'axios';
import { numMecanografico } from "../../auth/auth"

const Page = () => {
    // const {idDocente} = useParams()
    const [provas,setProvas] = useState(null)

    React.useEffect(()=>{
        async function getallProvas() {
            var response = await axios.get(apiRoute(`/provas/docente/${numMecanografico()}`))
            setProvas(response.data)
        }
        getallProvas();
    },[])


    if(provas!=null && provas.length>0){
        return(
            <>
                {
                    provas.map((prova)=>{
                       return <ClassifyCard nome={prova.nome} uc={prova.unidadeCurricular} docentes={prova.docentes} numMecanografico={numMecanografico()} provaid={prova._id} mensagem="Classificar Prova"></ClassifyCard>
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

const ClassificationsAuto = () => {
    return (
        <MainLayout pagina={<Page />}/>
    )
}    

export default ClassificationsAuto;
