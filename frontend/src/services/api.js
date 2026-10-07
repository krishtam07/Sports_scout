const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  getHealth: () => fetchJson('/health'),
  getDashboard: () => fetchJson('/dashboard'),
  getBatting: (params = {}) => {
    const query = new URLSearchParams();
    if (params.team && params.team !== 'ALL') query.append('team', params.team);
    if (params.search) query.append('search', params.search);
    if (params.min_runs) query.append('min_runs', params.min_runs);
    if (params.min_sr) query.append('min_sr', params.min_sr);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.order) query.append('order', params.order);
    return fetchJson(`/batting?${query.toString()}`);
  },
  getBowling: (params = {}) => {
    const query = new URLSearchParams();
    if (params.team && params.team !== 'ALL') query.append('team', params.team);
    if (params.search) query.append('search', params.search);
    if (params.min_wickets) query.append('min_wickets', params.min_wickets);
    if (params.max_economy) query.append('max_economy', params.max_economy);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.order) query.append('order', params.order);
    return fetchJson(`/bowling?${query.toString()}`);
  },
  getStatistics: () => fetchJson('/statistics'),
  getCorrelation: () => fetchJson('/correlation'),
  getProbability: () => fetchJson('/probability'),
  getRegression: () => fetchJson('/regression'),
  getVisualizations: () => fetchJson('/visualizations'),
  getAllRounders: () => fetchJson('/all-rounders'),
  getPlayerProfile: (playerName) => fetchJson(`/player/${encodeURIComponent(playerName)}`),
  comparePlayers: (p1, p2) => fetchJson(`/compare?player1=${encodeURIComponent(p1)}&player2=${encodeURIComponent(p2)}`),
  scoutPlayers: (category = 'batting', metric = 'Runs') => fetchJson(`/scout?category=${category}&metric=${metric}`),
  getTeams: () => fetchJson('/teams'),
  getPlayers: () => fetchJson('/players'),
};
