import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileContract, faClipboardCheck, faDoorOpen, faBell } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

import { isDocente, isAluno, isTecnico, numMecanografico, logout } from "../../auth/auth"

const FuncionalidadesDocentes = () => {
    if (isDocente()) {
        return (
            <>
                <li>
                    <Link to="/criarprova" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon className="mr-4" icon={faFileContract} />
                        <span className="ms-3">Criar provas</span>
                    </Link>
                </li>
                <li>
                    <Link to="/classificarprovas" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon className="mr-4" icon={faClipboardCheck} />
                        <span className="ms-3">Classificar provas</span>
                    </Link>
                </li>
            </>
        )
    } else {
        return (<></>)
    }
}

const FuncionalidadesAlunos = () => {
    if (isAluno()) {
        return (
            <>
                <li>
                    <Link to={`/notificacoes/${numMecanografico()}`} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon className="mr-4" icon={faBell} />
                        <span className="ms-3">Notificações</span>
                    </Link>
                </li>
                <li>
                    <Link to="/provas/porRealizar" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon className="mr-4" icon={faFileContract} />
                        <span className="ms-3">Provas a realizar</span>
                    </Link>
                </li>
                <li>
                    <Link to={`/provas/realizadas/${numMecanografico()}`} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon className="mr-4" icon={faClipboardCheck} />
                        <span className="ms-3">Consultar classificações</span>
                    </Link>
                </li>
            </>
        )
    } else {
        return (<></>)
    }
}
{/*
const FuncionalidadesTecnicos = () => {
    if (isTecnico()) {
        return (
            <>
                <li>
                    <Link to={`/gerirsalas`} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <FontAwesomeIcon className="mr-4" icon={faBell} />
                        <span className="ms-3">Salas</span>
                    </Link>
                </li>
            </>
            
        )
    }
}
*/}

const MainLayout = ({ pagina }) => {
    return (
        <>
            <div>
                <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <FuncionalidadesDocentes />
                            <FuncionalidadesAlunos />
                            <li>
                                <button onClick={() => { logout(); window.location = '/login' }} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <FontAwesomeIcon className="mr-4" icon={faDoorOpen} />
                                    <span className="ms-3">Sair</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>

            <div className="p-4 sm:ml-64">
                <div className="p-4 rounded-lg dark:border-gray-700">
                    {pagina}
                </div>
            </div>
        </>

    );
};

export default MainLayout;