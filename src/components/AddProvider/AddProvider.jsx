import { useState } from 'react'
import './AddProvider.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export function AddProvider() {

    const [code, setCode] = useState('')
    const [suggestions, setSuggestions] = useState([]);
    const [errors, setErrors] = useState(null)

    async function addProvider(e) {
        e.preventDefault()

        setErrors(null)

        const data = new FormData(e.target)

        try {
            const response = await toast.promise(
                fetch('https://api.bazarrshop.com/api/provider', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: data
                }).then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json(); // Obtiene el mensaje del backend
                        throw errorData;
                    }
                    return res.json(); // Devuelve el JSON si todo está bien
                }),
                {
                    pending: 'Agregando proveedor...',
                    success: 'Se agregó correctamente',
                    error: 'Error, no se pudo agregar'
                }
            );

            console.log(response);

        } catch (error) {
            const e = []

            const { errors } = error

            if (errors.name) {
                e.push('Falta completar con el nombre')
            }

            if (errors.provider_code) {
                if (errors.provider_code == 'The provider code field is required.') {
                    e.push('Falta completar con el código de referencia')
                } else {
                    e.push('El código de referencia ya esta asociado a otro proveedor')
                }
            }

            setErrors(e)
        }

    }

    function generateOptionalCodes(e) {
        const value = e.target.value

        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        const words = value.split(' ').filter(w => w.length > 0);

        const codes = [
            'PROV-' + words.map(w => w[0]).join('').toUpperCase(),
            'PROV-' + words.map(w => w.slice(0, 2)).join('').toUpperCase()
        ];

        if (words.length > 1) {
            codes.push('PROV-' + words[0].slice(0, 3).toUpperCase());
        }

        setSuggestions(codes);
    }

    return (
        <section className="section-form">
            <form onSubmit={addProvider} className="form-add-provider">
                <div className="header-form">
                    <h1>Agregar nuevo proveedor</h1>
                    <p>Los campos con <span>*</span> son obligatorios</p>
                </div>
                <div>
                    <div>
                        <p>Nombre del proveedor <span>*</span></p>
                        <input
                            type="text"
                            name='name'
                            className='input'
                            placeholder="Nombre del proveedor"
                            onChange={generateOptionalCodes}
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <p>Código del proveedor <span>*</span></p>
                        <input
                            type="text"
                            name='provider_code'
                            className='input'
                            placeholder="Código de referencia"
                            onChange={e => setCode(e.target.value)}
                            value={code}
                        />
                    </div>
                    <div>
                        {suggestions.length > 0 && (
                            <>
                                <p>Sugerencias</p>
                                <div className="suggestions">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="suggestion-item"
                                            onClick={() => setCode(suggestion)}
                                        >
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <div>
                        <p>Información de contacto</p>
                        <input type="text" name='contact_info' className='input' placeholder="Correo / WhatsApp / Página web" />
                    </div>
                </div>
                <div>
                    <button type="submit" className='btn btn-solid'>Agregar</button>
                </div>
                <div>
                    {errors &&
                        <ul>
                            {errors.map(e => <li className='error'>{e}</li>)}
                        </ul>
                    }
                </div>
            </form>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
                stacked
            />
        </section>
    )
}