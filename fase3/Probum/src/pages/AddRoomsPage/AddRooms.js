import axios from 'axios';

import { apiRoute } from '../../APIGateway/config'


const AddRoomsPage = () => {

    return (
        <div className="flex h-screen">
            <div className= "w-1/3 bg-gray-700"></div>

            <div className= "w-2/3 p-8 bg-gray-300">
                <div className= "mt-8 mx-auto pl-2 pt-2 pb-2 w-11/12 h-full bg-gray-200 rounded-md">
                    <div className="ml-8 mt-8 mb-12 w-11/12 bg-gray-100 text-center text-3xl font-bold text-gray-500 rounded-md"> ADICIONAR SALAS </div>
                    <div className="flex mt-64 items-center justify-between w-2/3 mx-auto bg-white border-2 rounded-md p-2 border-gray-400">
                        <input
                            type="file"
                            id="inputFile"
                            placeholder="Inserir ficheiro"
                        />
                        <button className="w-32 h-8 bg-gray-200 border-2 rounded-md border-gray-400" type="button">
                            Submit
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default AddRoomsPage;