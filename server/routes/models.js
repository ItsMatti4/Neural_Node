const express = require('express');
const router = express.Router();
const hf = require('../services/huggingface');
const { cacheMiddleware } = require('../middleware/cache');

// GET /api/models - List models with filters
router.get('/', cacheMiddleware(900), async (req, res) => {
  try {
    const models = await hf.fetchModels(req.query);
    res.json(models);
  } catch (err) {
    console.error('Error fetching models:', err.message);
    res.status(502).json({ error: 'Failed to fetch models from HuggingFace', details: err.message });
  }
});

// GET /api/models/trending
router.get('/trending', cacheMiddleware(600), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const models = await hf.fetchTrendingModels(limit);
    res.json(models);
  } catch (err) {
    console.error('Error fetching trending:', err.message);
    res.status(502).json({ error: 'Failed to fetch trending models', details: err.message });
  }
});

// GET /api/models/compare?ids=id1,id2,id3
router.get('/compare', cacheMiddleware(900), async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ error: 'No model IDs provided' });

    const modelIds = ids.split(',').map((id) => id.trim()).filter(Boolean).slice(0, 4);
    if (modelIds.length < 2) return res.status(400).json({ error: 'At least 2 model IDs required' });

    const models = await hf.compareModels(modelIds);
    res.json(models);
  } catch (err) {
    console.error('Error comparing models:', err.message);
    res.status(502).json({ error: 'Failed to compare models', details: err.message });
  }
});

// GET /api/models/task/:task
router.get('/task/:task', cacheMiddleware(900), async (req, res) => {
  try {
    const { task } = req.params;
    const { limit = 20, sort = 'downloads' } = req.query;
    const models = await hf.fetchModelsByTask(task, parseInt(limit), sort);
    res.json(models);
  } catch (err) {
    console.error('Error fetching by task:', err.message);
    res.status(502).json({ error: 'Failed to fetch models by task', details: err.message });
  }
});

// GET /api/models/:id - Model details (must be last)
router.get('/:id(*)', cacheMiddleware(900), async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await hf.fetchModelById(modelId);
    res.json(model);
  } catch (err) {
    console.error('Error fetching model:', err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'Model not found' });
    }
    res.status(502).json({ error: 'Failed to fetch model details', details: err.message });
  }
});

// GET /api/models/:id/readme
router.get('/:id(*)/readme', async (req, res) => {
  try {
    const modelId = req.params.id;
    const readme = await hf.fetchModelReadme(modelId);
    if (!readme) return res.status(404).json({ error: 'README not found' });
    res.json({ content: readme });
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch README', details: err.message });
  }
});

module.exports = router;
