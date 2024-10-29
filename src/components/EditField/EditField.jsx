export function EditField({ field, value, onChange, type = 'text', options = [] }) {
    return (
        <>
            {type === 'text' && (
                <input type="text" className="input" value={value} onChange={(e) => onChange(field, e.target.value)} />
            )}
            {type === 'textarea' && (
                <textarea className="input" value={value} onChange={(e) => onChange(field, e.target.value)}></textarea>
            )}
            {type === 'number' && (
                <input type="number" className="input" value={value || 0} onChange={(e) => onChange(field, e.target.value)} />
            )}
            {type === 'radio' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label>
                        <input
                            type="radio"
                            value="active"
                            checked={value === 'active'}
                            onChange={() => onChange(field, 'active')}
                        />
                        Activo
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="inactive"
                            checked={value === 'inactive'}
                            onChange={() => onChange(field, 'inactive')}
                        />
                        Inactivo
                    </label>
                </div>
            )}
            {type === 'select' && (
                <select className="input" value={value} onChange={(e) => onChange(field, e.target.value)}>
                    {options.map((option) => (
                        <option key={option.code} value={option.code}>
                            {option.name}
                        </option>
                    ))}
                </select>
            )}
            {type === 'checkbox' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {options.map((option) => (
                        <label className="input-subcategory" key={option.code}>
                            <input
                                type="checkbox"
                                checked={value && value.includes(option.code)}
                                onChange={() => {
                                    const currentValues = value ? value.split('|') : []
                                    const newValue = currentValues.includes(option.code)
                                        ? currentValues.filter(code => code !== option.code)
                                        : [...currentValues, option.code]

                                    onChange(field, newValue.join('|'))
                                }}
                            />
                            {option.name}
                        </label>
                    ))}
                </div>
            )}

        </>
    )
}
