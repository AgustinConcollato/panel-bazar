import { useEffect } from "react"

export function OrderPage() {

    useEffect(() => {
        // fetch('http://localhost:8000/api/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         name: 'Juan Pérez',
        //         email: 'juan@example.com',
        //         password: 'contraseñaSegura'
        //     }),
        // })
        //     .then(response => response.json())
        //     .then(data => console.log(data))
        //     .catch(error => console.error('Error:', error));
        
        fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'juan@example.com',
                password: 'contraseñaSegura'
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    console.log('Login exitoso:', data);
                    // Guarda el token en localStorage o en donde necesites
                    localStorage.setItem('token', data.token);
                } else {
                    console.error('Error de login:', data);
                }
            })
            .catch(error => console.error('Error:', error));

    }, [])

    return (
        <>
            <section>
                <form>

                    <input type="text" placeholder="cliente" />
                    <select name="client">
                        <option value="">Mateo</option>
                        <option value="">Guido</option>
                        <option value="">Facundo</option>
                    </select>
                </form>
                <div>
                    mostrar los pedidso pendientes
                </div>
            </section>
            <section>
                lista de los pedidos terminados del mes
            </section>
        </>
    )
}