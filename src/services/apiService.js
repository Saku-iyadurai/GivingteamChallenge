import axios from 'axios';

const BACKEND_BASE_URL = 'http://localhost:5000/api';

// Function to fetch all nonprofits
export const searchNonprofits = async (searchTerm) => {
    try {
        const response = await axios.get(`${BACKEND_BASE_URL}/search/${searchTerm}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching nonprofits: ' + error.message);
    }
};

// Function to fetch all teams
export const donateToNonprofit = async (nonprofitId, amount) => {
    try {
        const response = await axios.post(`${BACKEND_BASE_URL}/donate`, { nonprofitId, amount });
        return response.data;
    } catch (error) {
        throw new Error('Error processing donation: ' + error.message);
    }
};

// Function to fetch Fundraiser details
export const getFundraiserDetails = async (fundraiserId) => {
    try {
        const response = await axios.get(`${BACKEND_BASE_URL}/fundraiser/${fundraiserId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching fundraiser details: ' + error.message);
    }
};