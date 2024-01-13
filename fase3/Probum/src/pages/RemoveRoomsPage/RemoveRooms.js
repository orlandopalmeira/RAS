import React, { useState } from 'react';
import axios from 'axios';
import { useEffect} from 'react';

import { apiRoute } from '../../APIGateway/config'

const RemoveRoomsPage = () => {
    const [rooms, setRooms] = useState([]);

    async function getRooms() {
        try {
            const response = await axios.get(apiRoute('/salas'));
            const data = response.data;
            setRooms(data);
        } catch (error) {
            console.error('Erro ao obter salas:', error);
        }
    }
    
    useEffect(() => {
        getRooms();
    }, []);

    async function handleRemoveRoom(roomId) {
        try {
            await axios.delete(apiRoute(`/salas/${roomId}`));
            setRooms(rooms => rooms.filter(room => room._id !== roomId));
        } catch(error) {
            console.error('Erro ao remover sala:', error);
        }
    }

    return (
        <div className="flex h-screen">
            <div className= "w-1/3 bg-gray-700"></div>

            <div className= "w-2/3 p-8 bg-gray-300">
                <div className= "mt-8 mx-auto pl-2 pt-2 pb-2 w-11/12 bg-gray-200 rounded-md">
                    <div className="ml-8 mt-8 mb-12 w-11/12 bg-gray-100 text-center text-3xl font-bold text-gray-500 rounded-md"> ELIMINAR SALAS </div>
                    {rooms.map((room, index) => (
                        <div key={index} className="flex mb-4 items-center justify-between w-2/3 mx-auto bg-white border-2 rounded-md p-2 border-gray-400">
                            <div>
                                Edifício: {room.edificio} | Piso: {room.piso} | Sala: {room.numSala} | Capacidade: {room.capacidade}
                            </div>
                            <button 
                                className="w-32 h-8 bg-gray-200 border-2 rounded-md border-gray-400 hover:bg-gray-400 hover:text-white hover:border-4 hover:border-white focus:bg-gray-500 focus:text-white focus-border-4" 
                                type="button"
                                onClick={() => handleRemoveRoom(room._id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RemoveRoomsPage;