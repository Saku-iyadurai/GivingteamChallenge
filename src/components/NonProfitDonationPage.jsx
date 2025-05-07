import React, { useState } from 'react';
import axios from 'axios';
import DonationForm from './DonationForm';

// This component allows users to search for nonprofits and donate to them.
// It manages the search query, loading state, error messages, and selected nonprofit for donation.
// It uses the axios library to make API requests to a local server for fetching nonprofit data.
// The component also handles the display of the nonprofit list and the donation form.
// The donation form is displayed when a nonprofit is selected for donation.
// The component uses the useState hook to manage state variables and the useEffect hook for side effects.
// The component is structured to provide a user-friendly interface for finding and donating to nonprofits.

const NonProfitDonationPage = () => {
    const [query, setQuery] = useState('');
    const [nonprofits, setNonprofits] = useState([]);
    const [selectedNonprofit, setSelectedNonprofit] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        let isMounted = true; // Track if the component is mounted
        setLoading(true);
        setError(null);
    
        try {
            const response = await axios.post('http://localhost:5001/api/gpt-nonprofits', { query });
            console.log('API Response:', response.data); // Debugging log
            
    
            if (isMounted) {
                // Only update state if the component is still mounted
                if (response.data && Array.isArray(response.data)) {
                    setNonprofits(response.data);
                } else {
                    throw new Error('Invalid response from the server');
                }
            }
        } catch (err) {
            if (isMounted) {
                setError('Failed to fetch nonprofits. Please try again.');
                console.error(err); // Log the error for debugging
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    
        return () => {
            isMounted = false; // Cleanup function to mark the component as unmounted
        };
    };

    // This function handles the selection of a nonprofit for donation.
    const handleSelectNonprofit = (nonprofit) => {
        console.log('Selected Nonprofit:', nonprofit); // Debugging log
        setSelectedNonprofit(nonprofit);
    };

    const handleCloseDonationForm = () => {
        setSelectedNonprofit(null);
    };

    return (
        <div>
        <h1>Find and Donate to a Nonprofit</h1>

        {/* Search Section */}
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your interest (e.g., animal welfare)"
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>

        {/* Nonprofit List */}
        <ul>
            {nonprofits.map((nonprofit) => (
                <li key={nonprofit.id}>
                    <h3>{nonprofit.name}</h3>
                    <p>{nonprofit.description}</p>
                    <a href={nonprofit.link} target="_blank" rel="noopener noreferrer">
                        Visit Website
                    </a>
                    <button onClick={() => handleSelectNonprofit(nonprofit)}>
                        Donate
                    </button>
                </li>
            ))}
        </ul>

        {/* Donation Form */}
        {selectedNonprofit && (
            <DonationForm
                nonprofitId={selectedNonprofit.id} // Pass the nonprofit ID
                nonprofitName={selectedNonprofit.name}
                onClose={handleCloseDonationForm}
            />
        )}
    </div>
    );
};

export default NonProfitDonationPage;