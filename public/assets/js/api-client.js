/**
 * API Client
 * Menangani semua komunikasi dengan backend
 */

class APIClient {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.timeout = 10000;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: this.timeout,
        };

        const config = { ...defaultOptions, ...options };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Games API
    async getAllGames() {
        return this.request('/games');
    }

    async getGameById(gameId) {
        return this.request(`/games/${gameId}`);
    }

    async getGamesByCategory(category) {
        return this.request(`/games/category/${category}`);
    }

    async getGamesByAge(age) {
        return this.request(`/games/age/${age}`);
    }

    async getGameCategories() {
        return this.request('/games/categories');
    }

    // Gameplay API
    async startGameSession(gameId, playerId) {
        return this.request('/gameplay/start', {
            method: 'POST',
            body: JSON.stringify({ gameId, playerId }),
        });
    }

    async submitAnswer(sessionId, questionId, answer, timeSpent) {
        return this.request(`/gameplay/${sessionId}/answer`, {
            method: 'POST',
            body: JSON.stringify({ questionId, answer, timeSpent }),
        });
    }

    async endGameSession(sessionId) {
        return this.request(`/gameplay/${sessionId}/end`, {
            method: 'POST',
        });
    }

    async getSessionDetails(sessionId) {
        return this.request(`/gameplay/${sessionId}`);
    }

    // Leaderboard API
    async getLeaderboard(gameId = null, limit = 10) {
        let endpoint = `/leaderboard?limit=${limit}`;
        if (gameId) {
            endpoint += `&gameId=${gameId}`;
        }
        return this.request(endpoint);
    }

    async getPlayerStats(playerId) {
        return this.request(`/leaderboard/${playerId}`);
    }

    async addScore(playerId, gameId, score, accuracy) {
        return this.request('/leaderboard/score', {
            method: 'POST',
            body: JSON.stringify({ playerId, gameId, score, accuracy }),
        });
    }

    // Health Check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create global instance
const api = new APIClient();

// Check API availability
window.addEventListener('load', async () => {
    try {
        await api.healthCheck();
        console.log('✅ API is connected');
    } catch (error) {
        console.error('❌ API Connection Error:', error);
    }
});

export default APIClient;
