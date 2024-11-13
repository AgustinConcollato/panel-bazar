import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Search.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export function Search() {

    const [search, setSearch] = useState(null)
    const [results, setResults] = useState({ products: null })

    const refInputSearch = useRef()
    const refResults = useRef()

    const navigate = useNavigate()

    const handleFocus = () => {
        if (search) {
            const resultsSession = JSON.parse(sessionStorage.getItem('results'))
            resultsSession ? setResults(resultsSession) : a()
        }
    }

    const handleChange = (e) => {
        setSearch(e.target.value.trim())
    }

    document.onclick = ({ target }) => {
        if (refInputSearch.current === target) {
            sessionStorage.clear()
            return
        }

        if (refResults.current && !refResults.current.contains(target) && results.products) {
            sessionStorage.setItem('results', JSON.stringify(results))
            setResults({ products: null })
        }
    }

    document.onkeyup = (e) => {
        if (e.keyCode === 27 && results.products) {
            sessionStorage.setItem('results', JSON.stringify(results))
            setResults({ products: null })
            refInputSearch.current.blur()
        }
    }

    const a = async () => {
        // setResults(await searcher(search, 20))
    }

    useEffect(() => {
        if (search != null) {
            a()
        }
    }, [search])

    return (
        <>
            <search>
                <form onSubmit={e => {
                    e.preventDefault()
                    navigate('/search/' + search)
                }}>
                    <input
                        type="text"
                        placeholder="Buscar producto"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        ref={refInputSearch}
                    />
                    <button type='submit'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </form>
                {results.products &&
                    <div className='container-results'>
                        <div className='results' ref={refResults}>
                            {results.products.length !== 0
                                ? results.products.map(e =>
                                    <Link title={e.name} key={e.id} to={`/product/${e.id}`} onClick={() => setResults({ products: null })}>
                                        <img src={e.picture.split('|')[0]} alt="" />
                                        <p className='result-name'>
                                            {e.name}
                                            <br />
                                            <span>{e.code}</span>
                                        </p>
                                        <p>$ {e.price_wholesaler}</p>
                                    </Link>
                                )
                                : <p className='product-not-found'>{results.message}</p>
                            }
                        </div>
                        <div className='option-search'>
                            <Link to={'/search/' + search}>Todos los resultados de "{search}"</Link>
                        </div>
                    </div>
                }
            </search>
        </>
    )
}