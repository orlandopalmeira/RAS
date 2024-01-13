import { useState } from 'react';

const FormAleatorizacaoRetrocesso = ({ currentDisplay, setDisplay, setNextDisplay, setProvaData, provaData }) => {
    const [ordemQuestoesAleatoria, setOrdemQuestoesAleatoria] = useState(true)
    const [retrocessoQuestoes, setRetrocessoQuestoes] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        setProvaData({
            retrocesso: retrocessoQuestoes,
            aleatorizacao: ordemQuestoesAleatoria
        })
        setDisplay('none') //> esconde este formulário
        setNextDisplay('block') //> apresenta o próximo formulário
        console.log(provaData) //! DEBUG
    }

    return (
        <div style={{ display: currentDisplay }}>
            <form onSubmit={handleSubmit}>
                <div className="sm:col-span-4">
                    <table>
                        <tbody>
                            <tr>
                                <td>Ordem aleatória das questões</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="ml-4 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        checked={ordemQuestoesAleatoria}
                                        onChange={() => setOrdemQuestoesAleatoria(!ordemQuestoesAleatoria)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Retrocesso nas questões</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="ml-4 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        checked={retrocessoQuestoes}
                                        onChange={() => setRetrocessoQuestoes(!retrocessoQuestoes)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type='submit' className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submeter
                </button>
            </form>
        </div>
    )
}

export default FormAleatorizacaoRetrocesso;