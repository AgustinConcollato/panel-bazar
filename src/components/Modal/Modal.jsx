import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import './Modal.css'

export function Modal({ children, onClose }) {
    const modalRef = useRef(null)

    useEffect(() => {
        // Foco en el primer input
        if (modalRef.current) {
            const firstInput = modalRef.current.querySelector(
                'input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            if (firstInput) {
                firstInput.focus();
            }
        }

        // Manejar la tecla Escape
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return createPortal(
        <div className='modal' ref={modalRef}>
            <div className="container-children">
                {children}
            </div>
            <div className="background-modal" onClick={onClose}></div>
        </div>,
        document.getElementById("root")
    )
}