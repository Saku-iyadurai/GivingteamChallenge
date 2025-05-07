import React, { useState } from 'react';
import { searchNonprofits } from '../services/apiService';

const NonprofitSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            const data = await searchNonprofits(searchTerm);
            setResults(data.nonprofits || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch nonprofits. Please try again.');
        }
    };

    return (
        <div>
            <h2>Search for Nonprofits</h2>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter nonprofit name"
            />
            <button onClick={handleSearch}>Search</button>
            {error && <p className="error">{error}</p>}
            <ul>
                {results.map((nonprofit) => (
                    <li key={nonprofit.id}>{nonprofit.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default NonprofitSearch;