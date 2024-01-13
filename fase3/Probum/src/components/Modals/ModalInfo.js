import React from 'react';
import { Button, Modal } from 'flowbite-react';


const ModalInfo = ({ title, message, isOpen, onRequestClose }) => {
    return (
        <Modal show={isOpen} onClose={onRequestClose}>
            <Modal.Header>{title}</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    {message}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="gray" style={{background: 'lightblue'}} onClick={onRequestClose}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalInfo;