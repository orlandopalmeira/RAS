import React, { useEffect, useState } from 'react';

const Relogio = () => {
    const [dataHora, setDataHora] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDataHora(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <span className='font-bold'>{dataHora.toISOString().replace('T', ' ').slice(0, 19)}</span>
    );
};

export default Relogio;
