import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import './Modal.css'

export function Modal({ children, onClose }) {
    const modalRef = useRef(null)

    useEffect(() => {
        if (modalRef.current) {
            // Busca el primer input dentro del modal y le da focus
            const firstInput = modalRef.current.querySelector('input, textarea, select, [tabindex]:not([tabindex="-1"])');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }, [])

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