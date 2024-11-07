import { useState } from 'react'
import { api } from '../../services/api'
import './SearchInput.css'
import { Loading } from '../Loading/Loading'

export function SearchInput({ onSelect, setSelected }) {
    const { Products } = api

    const [query, setQuery] = useState('')
    const [filteredOptions, setFilteredOptions] = useState([])
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const products = new Products()

    async function handleChange(event) {
        const value = event.target.value
        setQuery(value)
        setSelected({})

        if (value.trim() === '') {
            setFilteredOptions([]);
            setQuery('')
            return;
        } else {
            setIsLoading(true)
            const response = await products.search({ options: { name: value.trim(), page: 1 } })

            if (response) {
                setIsLoading(false)
                const filtered = response.data.filter(option =>
                    option.name.toLowerCase().includes(value.toLowerCase())
                )
                setFilteredOptions(filtered)
            }

            setHighlightedIndex(0)
        }


    }

    function handleKeyDown(event) {
        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) =>
                Math.min(prevIndex + 1, filteredOptions.length - 1)
            )
        } else if (event.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault()
            if (filteredOptions[highlightedIndex]) {
                onSelect(filteredOptions[highlightedIndex]);
                setQuery(filteredOptions[highlightedIndex].name);
                setFilteredOptions([]);
            }
        }
    }

    function handleOptionClick(option) {
        onSelect(option)
        setQuery(option.name)
        setFilteredOptions([])
    }

    return (
        <div className="search-container">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Nombre"
                name='name'
                className='input'
                autoComplete='off'
                required
            />
            {(
                filteredOptions.length > 0 && (
                    <ul className="options-list">
                        {isLoading ?
                            <Loading /> :
                            filteredOptions.map((option, index) => (
                                <li
                                    key={option.id}
                                    className={highlightedIndex === index ? 'highlighted' : ''}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.name}
                                </li>
                            ))}
                    </ul>
                )
            )}
        </div>
    );
}