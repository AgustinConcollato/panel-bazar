import { createPortal } from 'react-dom'
import './Modal.css'

export function Modal({ children }) {
    return createPortal(
        <div className='modal'>{children}</div>,
        document.getElementById("root")
      )
}