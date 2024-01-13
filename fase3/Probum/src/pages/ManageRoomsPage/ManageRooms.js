import axios from 'axios';
import { apiRoute } from '../../APIGateway/config'
import { Link } from 'react-router-dom';

const ManageRoomsPage = () => {

    return (
        <div className="flex h-screen">
            <div className= "w-1/3 bg-gray-700"></div>

            <div className= "w-2/3 p-8 bg-gray-300">
                <div className= "mx-auto mt-16 pl-2 pt-2 w-11/12 h-5/6 bg-gray-200 rounded-md">
                    <div className="mx-8 my-8 p-2 w-11/12 h-12 bg-gray-100 text-center text-3xl font-bold text-gray-500 rounded-md"> GESTÃO DE SALAS </div>
                    <div className="flex mt-64">
                        <Link to="/adicionarsalas">
                            <button className="w-48 h-20 ml-64 bg-gray-200 border-2 rounded-md border-gray-400" type="button">
                                ADICIONAR
                            </button>
                        </Link>
                        <Link to="/removersalas">
                        <button className="w-48 h-20 ml-24 bg-gray-200 border-2 rounded-md border-gray-400" type="button">
                            ELIMINAR
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageRoomsPage;