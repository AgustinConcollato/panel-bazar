import { useState, useEffect, useRef } from 'react'
import { api, urlStorage } from '../../services/api'
import './SearchInput.css'
import { Loading } from '../Loading/Loading'
import { Link, useNavigate } from 'react-router-dom'

export function SearchInput() {
    const { Products } = api

    const [query, setQuery] = useState('')
    const [filteredOptions, setFilteredOptions] = useState([])
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [isLoading, setIsLoading] = useState(false)
    const [hidden, setHidden] = useState(true)
    const [total, setTotal] = useState(0)

    const inputRef = useRef(null)
    const dropdownRef = useRef(null)
    const optionRefs = useRef([])
    const navigate = useNavigate()

    const products = new Products()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setHidden(true)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'

            })
        }
    }, [highlightedIndex])

    async function handleChange(event) {
        const value = event.target.value
        setQuery(value)

        if (value.trim() === '') {
            setHidden(true)
            setFilteredOptions([])
            return
        } else {
            setIsLoading(true)
            const response = await products.search({ options: { name: value, page: 1, panel: true } })

            if (response) {
                setFilteredOptions(response.data)
                setTotal(response.total)
                setIsLoading(false)
                setHidden(false)
            }
        }

        setHighlightedIndex(-1)
    }

    function handleKeyDown(event) {
        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) =>
                prevIndex === -1 ? 0 : Math.min(prevIndex + 1, filteredOptions.length - 1)
            )
        } else if (event.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, -1))
        } else if (event.key === 'Enter') {

            if (highlightedIndex < 0) return

            event.preventDefault()
            const selectedOption = filteredOptions[highlightedIndex]
            if (selectedOption) {
                navigate('producto/' + selectedOption.id)

                setQuery(selectedOption.name)
                setHidden(true)
            }
        }
    }

    function handleOptionClick(option) {
        setQuery(option.name)
        setHidden(true)
    }

    return (
        <div ref={dropdownRef}>
            <input
                type="text"
                id='search'
                ref={inputRef}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Buscar productos por nombre"
                name="name"
                className="input"
                autoComplete="off"
                required
                onFocus={() => query && setHidden(false)}
            />
            {(!hidden && filteredOptions.length > 0) ? (
                <div className='container-options-list'>
                    <ul className="options-list">
                        {isLoading ? (
                            <Loading />
                        ) : (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={option.id}
                                    className={highlightedIndex === index ? 'highlighted' : ''}
                                    ref={(el) => (optionRefs.current[index] = el)}
                                >
                                    <Link to={'producto/' + option.id} onClick={() => handleOptionClick(option)}>
                                        <img
                                            src={`${urlStorage}/${JSON.parse(option.thumbnails)[0]}`}
                                            alt=""
                                        />
                                        {option.name}
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                    {total > 20 &&
                        <button type="submit">Ver todos los resultados</button>
                    }
                </div>
            ) : (
                !hidden && (
                    <div className='container-options-list'>
                        <ul className="options-list">
                            <li className="no-results">No hay resultados</li>
                        </ul>
                    </div>
                )
            )}
        </div>
    )
}
