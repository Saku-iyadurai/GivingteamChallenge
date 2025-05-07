import { useState, useEffect } from 'react';

// This custom hook is designed to handle API calls in a React application.
// It manages the loading state, error handling, and data fetching.
// It takes an API function and an optional initial data value as parameters.

const useApi = (apiFunction, initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFunction();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiFunction]);

    return { data, loading, error };
};

export default useApi;