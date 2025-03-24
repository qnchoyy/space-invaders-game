const API_BASE_URL = 'http://localhost:5000/api';

const authenticatedFetch = async (url, options = {}, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };


    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers
    });
};


export const api = {

    saveScore: async (scoreData, token = null) => {
        try {
            console.log('Saving score:', scoreData);


            const response = await authenticatedFetch(
                `${API_BASE_URL}/scores`,
                {
                    method: 'POST',
                    body: JSON.stringify(scoreData)
                },
                token
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error saving score:', errorText);
                throw new Error('Error saving the score');
            }

            const result = await response.json();


            if (result.message === 'Existing result is higher') {
                console.log('Server reports existing result is higher:', result.existingScore);
                return result;
            }

            console.log('Score saved successfully:', result);
            return result;
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    },


    getScores: async (token = null) => {
        try {
            const response = await authenticatedFetch(
                `${API_BASE_URL}/scores`,
                {},
                token
            );

            if (!response.ok) {
                throw new Error('Error retrieving scores');
            }

            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    },


    getTopScores: async (token = null, limit = 10) => {
        try {
            const response = await authenticatedFetch(
                `${API_BASE_URL}/scores/top?limit=${limit}`,
                {},
                token
            );

            if (!response.ok) {
                throw new Error('Error retrieving top scores');
            }

            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    },

    getUserScores: async (userId, token = null) => {
        try {
            const response = await authenticatedFetch(
                `${API_BASE_URL}/scores/user/${userId}`,
                {},
                token
            );

            if (!response.ok) {
                throw new Error('Error retrieving user scores');
            }

            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    },

    hasCompletedAllLevels: async (userId, token = null) => {
        try {
            const scores = await api.getUserScores(userId, token);
            return scores.some(score => score.level === 3 && score.defeatedBoss);
        } catch (error) {
            console.error('API error:', error);
            return false;
        }
    },

    deleteUserScores: async (userId, token = null) => {
        try {
            const response = await authenticatedFetch(
                `${API_BASE_URL}/scores/user/${userId}`,
                { method: 'DELETE' },
                token
            );

            if (!response.ok) {
                throw new Error('Error deleting user scores');
            }

            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }
}; 