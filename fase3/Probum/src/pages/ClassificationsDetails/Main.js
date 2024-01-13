import React,{ useState } from 'react';
import MainLayout from "../Layouts/Main";
import { useParams } from 'react-router-dom';
import { apiRoute } from '../../APIGateway/config'
import axios from 'axios';
//{"_id":"65907b3494baca17c692c38f","idAluno":"a97223","idProva":"65907b1b94baca17c692c389","idVersao":1,
//"respostas":[{"idQuestao":1,"cotacao":0,"respostaAberta":"","opcoesEscolhidas":[1]}]}
//

const Page = () =>{
    const {numMecanografico,idProva,versao} = useParams()
    const [resolucao,setResolucao] = useState(null)
    const [prova,setprova] = useState(null)

    React.useEffect(()=>{
        async function getResolucoes() {
            var response1 = await axios.get(apiRoute(`/provas/resolucoes/aluno/${numMecanografico}/${idProva}`))
            console.log(response1)
            setResolucao(response1.data)
        }
        getResolucoes();
    },[]);
    
    React.useEffect(()=>{
        async function getProva() {
            var response2 = await axios.get(apiRoute(`/provas/questoes/${idProva}/${versao}`))
            console.log(response2)
            setprova(response2.data)
        }
        getProva();
    },[])
    
    let n = -1;
    //<p>{JSON.stringify(resolucao)}</p>
    //<p>{JSON.stringify(prova)}</p>
    if(resolucao!=null && prova!=null){
        return(
            <>
                <big><b>Versão: {resolucao.idVersao}</b></big>
                <big><b>  Nota: {resolucao.respostas.map(resp => resp.cotacao).reduce((a,b) => a+b)}</b></big>
                <hr style={{border: "1px solid grey"}}/>
                {
                    resolucao.respostas.map((q)=>{
                    n=n+1;
                    return <div style={{backgroundColor: "#dddddd",padding:"15px",margin:"10px",borderRadius:"10px",width: "600px"}}>
                                <p><b>Exercício nº {q.idQuestao}</b></p>
                                <p>Cotação Obtida: {q.cotacao} pontos</p>
                                <b>Questão : {prova[0].versoes.questoes[n].descricao}</b>
                                <br></br>
                                {prova[0].versoes.questoes[n].opcoes.map((opcao)=>
                                   { if (JSON.stringify(opcao.correcta) === "true") {
                                        return(<div style={{ display: "flex", flexDirection: "column" }}><p style={{color:"green"}}>Alínea {opcao.id} - {opcao.texto} </p><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15px" height="15px" ><path d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z" fill="green"/><path fill="#FFF" d="M392.6,172.9c-5.8-15.1-17.7-12.7-30.6-10.1c-7.7,1.6-42,11.6-96.1,68.8c-22.5,23.7-37.3,42.6-47.1,57c-6-7.3-12.8-15.2-20-22.3C176.7,244.2,152,229,151,228.4c-10.3-6.3-23.8-3.1-30.2,7.3c-6.3,10.3-3.1,23.8,7.2,30.2c0.2,0.1,21.4,13.2,39.6,31.5c18.6,18.6,35.5,43.8,35.7,44.1c4.1,6.2,11,9.8,18.3,9.8c1.2,0,2.5-0.1,3.8-0.3c8.6-1.5,15.4-7.9,17.5-16.3c0.1-0.2,8.8-24.3,54.7-72.7c37-39.1,61.7-51.5,70.3-54.9c0.1,0,0.1,0,0.3,0c0,0,0.3-0.1,0.8-0.4c1.5-0.6,2.3-0.8,2.3-0.8c-0.4,0.1-0.6,0.1-0.6,0.1l0-0.1c4-1.7,11.4-4.9,11.5-5C393.3,196.1,397,184.1,392.6,172.9z"/></svg></div>);
                                    }else{
                                        return(<div style={{ display: "flex", flexDirection: "column" }}><p style={{color:"red"}}>Alínea {opcao.id} - {opcao.texto} </p><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="17px" height="17px"><path fill="red" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"/><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"/><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"/></svg></div>)
                                     }
                                    
                                   } 
                                    
                                )}
                                
                                <p>Resposta dada: {q.opcoesEscolhidas}</p>
                            </div>
                    })
                }
                
            </>
        )
    }else{
        return(
            <>
                <div>Não é possível observar as suas respostas.Tente mais tarde.</div>
            </>
        )
    }
}
const ClassificationsDetailsPage = () =>{
    return <MainLayout pagina={<Page />}/>
}

export default ClassificationsDetailsPage;