import React from 'react';
import { Button, Modal } from 'flowbite-react';

const PropostasComponent = ({ propostas }) => {
    return (
        <ul style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {propostas.map((proposta, index) => (
                <li key={index} className="mb-4 p-4 border border-gray-300 rounded">
                    <p><strong>Proposta n.º {index + 1}</strong></p>
                    <p><strong>Edifício:</strong> {proposta.edificio}</p>
                    <p><strong>Sala:</strong> {proposta.numSala}</p>
                    <p><strong>Piso:</strong> {proposta.piso}</p>
                    <p><strong>Capacidade:</strong> {proposta.capacidade}</p>
                    <p><strong>Alunos:</strong> {proposta.alunos.join(', ')}</p>
                </li>
            ))}
        </ul>
    )
}

const ModalPropostaCalendarizacao = ({ propostas, isOpen, onRequestClose }) => {
    return (
        <Modal show={isOpen} onClose={onRequestClose} style={{ maxHeight: '100vh' }}>
            <Modal.Header>Propostas de calendarização</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <PropostasComponent propostas={propostas} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="gray" style={{ background: 'lightblue' }} onClick={onRequestClose}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}


export default ModalPropostaCalendarizacao;