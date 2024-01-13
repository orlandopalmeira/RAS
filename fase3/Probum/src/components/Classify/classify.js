import {React} from 'react'
import './ClassifyCard.css'
import axios from 'axios';
import { apiRoute } from '../../APIGateway/config'


function classificaProvas(provaid){
    axios.get(apiRoute(`/provas/${provaid}/resolucoes/correcaoAuto`))
}

export default function ProvaCard({nome,uc,docentes,numMecanografico,mensagem,provaid,versao}){
    return(
        <>
            <div className='classify-card'>
                <h3><b>Prova</b>: {nome}</h3>
                <p><b>Unidade Curricular</b>: {uc}</p>
                <p><b>Docentes</b>: {docentes.map((docente)=>{return docente})}</p>
                <div className='button-style'>
                    <button onClick={classificaProvas(provaid)}>Classificar</button>
                </div>
            </div>
        </>
    )
}
