import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { donateToNonprofit } from '../services/apiService';

// This component allows users to donate to a specific nonprofit organization.
// It takes the nonprofitId and nonprofitName as props, along with an onClose function to close the form.
// The component manages the donation amount, loading state, error messages, and success messages.
// It uses the donateToNonprofit function from the apiService to handle the donation process.

const DonationForm = ({ nonprofitId, nonprofitName, onClose }) => {
    useEffect(() => {
        console.log('DonationForm received nonprofitId:', nonprofitId); // Debugging log 
    }, [nonprofitId]);

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // This function handles the form submission for the donation.
    // It prevents the default form submission behavior, sets the loading state,
    // clears any previous error messages, and attempts to process the donation.
    // If successful, it sets the success state and clears the amount input.
    // If an error occurs, it sets the error state with a message.
    // Finally, it resets the loading state.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            console.log(nonprofitId, amount);
            await donateToNonprofit(nonprofitId, amount);
        
            setSuccess(true);
            setAmount('');
        } catch (err) {
            console.log(err);
            setError('Donation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // This function handles the change in the donation amount input field.

    return (
        <div className="donation-form">
            <h2>Donate to {nonprofitName}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter donation amount"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Donate'}
                </button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">Thank you for your donation!</p>}
            </form>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

DonationForm.propTypes = {
    nonprofitId: PropTypes.string.isRequired,
    nonprofitName: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DonationForm;