const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const projectsService = require('../services/projectsService');

const router = express.Router();

// Public read access
router.get('/', async (req, res, next) => {
  try {
    res.json(await projectsService.getAllProjects());
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await projectsService.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Require Google-authenticated sessions for changes
router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const project = await projectsService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const project = await projectsService.updateProject(req.params.id, req.body);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const deleted = await projectsService.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
