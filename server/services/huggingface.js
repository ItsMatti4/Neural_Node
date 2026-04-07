const axios = require('axios');

const HF_API_BASE = 'https://huggingface.co/api';

let apiKey = process.env.HF_API_KEY || '';

const getApiKey = () => apiKey;
const setApiKey = (key) => { apiKey = key; };

const getHeaders = () => {
  const key = process.env.HF_API_KEY || '';
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers['Authorization'] = `Bearer ${key}`;
  return headers;
};

const hfClient = () =>
  axios.create({
    baseURL: HF_API_BASE,
    headers: getHeaders(),
    timeout: 15000,
  });

const fetchModels = async (params = {}) => {
  const {
    search = '',
    author = '',
    filter = '',
    sort = 'downloads',
    direction = -1,
    limit = 24,
    full = true,
    config = false,
    language = '',
    library = '',
    license = '',
    page = 0,
  } = params;

  const queryParams = {
    sort,
    direction,
    limit,
    full,
    config,
  };

  if (search) queryParams.search = search;
  if (author) queryParams.author = author;
  if (language) queryParams.language = language;
  if (library) queryParams.library = library;

  // Build filter string
  const filters = [];
  if (filter) filters.push(filter);
  if (license) filters.push(`license:${license}`);
  if (filters.length) queryParams.filter = filters.join(',');

  // Pagination via offset
  if (page > 0) queryParams.skip = page * limit;

  const response = await hfClient().get('/models', { params: queryParams });
  return response.data;
};

const fetchModelById = async (modelId) => {
  const response = await hfClient().get(`/models/${modelId}`, {
    params: { full: true, config: true },
  });
  return response.data;
};

const fetchTrendingModels = async (limit = 12) => {
  const response = await hfClient().get('/models', {
    params: { sort: 'trending', direction: -1, limit, full: true },
  });
  return response.data;
};

const fetchModelsByTask = async (task, limit = 20, sort = 'downloads') => {
  const response = await hfClient().get('/models', {
    params: { filter: task, sort, direction: -1, limit, full: true },
  });
  return response.data;
};

const fetchModelReadme = async (modelId) => {
  try {
    const response = await axios.get(
      `https://huggingface.co/${modelId}/resolve/main/README.md`,
      { headers: getHeaders(), timeout: 10000 }
    );
    return response.data;
  } catch {
    return null;
  }
};

const compareModels = async (modelIds) => {
  const promises = modelIds.map((id) => fetchModelById(id).catch(() => null));
  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

const fetchModelStats = async (modelId) => {
  try {
    const response = await hfClient().get(`/models/${modelId}`, {
      params: { full: true, config: true },
    });
    return response.data;
  } catch {
    return null;
  }
};

module.exports = {
  fetchModels,
  fetchModelById,
  fetchTrendingModels,
  fetchModelsByTask,
  fetchModelReadme,
  compareModels,
  fetchModelStats,
  getApiKey,
  setApiKey,
};
