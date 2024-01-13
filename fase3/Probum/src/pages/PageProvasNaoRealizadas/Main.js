import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { compareAsc } from 'date-fns';

import MainLayout from "../Layouts/Main";
import Relogio from '../../components/Relogio/Relogio';
import { Link } from 'react-router-dom';
import { apiRoute } from "../../APIGateway/config";

function getProvasNaoRealizadas(numMecAluno) {
    return axios.get(apiRoute(`/provas/alunos/${numMecAluno}/naoRealizadas`))
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
        });
}

const ButtonRealizarProva = ({ idProva, dataHora, provaData }) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (compareAsc(new Date(dataHora), new Date()) <= 0) {
                setEnabled(true);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [dataHora]);

    if(enabled){
        return <Link title="Realizar prova" 
                     className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
                     to="/prova/realizar"
                     state={provaData}
                >Realizar prova</Link>
    } else {
        return <button title="Prova ainda não iniciada" 
                       className="bg-gray-500 text-white font-semibold py-2 px-4 rounded" 
                       disabled={true}>Realizar prova</button>
    }
}

const ProvaCard = ({ provaData }) => {
    let { _id, nome, unidadeCurricular, retrocesso, aleatorizacao, versao } = provaData //> _id é o id da prova
    let { data, edificio, piso, sala, duracao, numVersao } = versao
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px' }}>
            <h2 className="text-xl"><strong>{nome}</strong></h2> <hr />
            <div className="grid grid-rows-1 grid-flow-col gap-4">
                <div>
                    <p><strong>Unidade Curricular:</strong> {unidadeCurricular}</p>
                    <p><strong>Versão:</strong> {numVersao}</p>
                    <p><strong>Data e Hora:</strong> {data}</p>
                    <p><strong>Local:</strong> Sala {sala}, Edifício {edificio}, Piso {piso}</p>
                    <p><strong>Duração:</strong> {duracao} minutos</p>
                    {!retrocesso || aleatorizacao ? <p><strong>Observações:</strong></p> : <></>}
                    {!retrocesso ? <p>- Sem retrocesso nas questões</p> : <></>}
                    {aleatorizacao ? <p>- Ordem de questões aleatória</p> : <></>}
                </div>

                <div className='flex justify-end items-end'>
                    <ButtonRealizarProva idProva={_id} dataHora={data} provaData={provaData}/>    
                </div>
            </div>
            {/* <pre>{JSON.stringify(provaData,null,2)}</pre> */}
        </div>
    );
};

const Page = ({ numMecAluno }) => {
    const [provas, setProvas] = useState(null);

    useEffect(() => {
        getProvasNaoRealizadas(numMecAluno)
            .then((result) => {
                setProvas(result);
            }).catch((err) => {
                alert(err.response.data.msg);
            });
    }, [numMecAluno]);

    if (provas === null) {
        return (<p>Loading...</p>);
    } else if (provas.length === 0) {
        return (<p>Não está inscrito em nenhuma prova.</p>);
    } else {
        return (
            <>
                <div className="flex justify-end">
                    <Relogio />
                </div>
                {provas.map((prova, index) => <ProvaCard key={index} provaData={prova} />)}
            </>
        );
    }
}

const PageProvasNaoRealizadas = ({ numMecAluno }) => {
    return (
        <MainLayout pagina={<Page numMecAluno={numMecAluno} />} />
    )
}

export default PageProvasNaoRealizadas;