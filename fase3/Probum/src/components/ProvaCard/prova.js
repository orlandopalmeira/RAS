import {React} from 'react'
import './ProvaCard.css'
import { Link } from 'react-router-dom';

export default function ProvaCard({nome,uc,docentes,numMecanografico,mensagem,provaid,versao}){
    return(
        <>
            <div className='prova-card'>
                <h3><b>Prova</b>: {nome}</h3>
                <p><b>Unidade Curricular</b>: {uc}</p>
                <p><b>Docentes</b>: {docentes.map((docente)=>{return docente})}</p>
                <div className='button-style'><Link to={`/provas/realizadas/${numMecanografico}/${provaid}/${versao}`}>{mensagem}</Link></div>
            </div>
        </>
    )
}