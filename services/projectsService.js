const { ObjectId } = require('mongodb');

let projectsCollection;

function setProjectsCollection(collection) {
  if (!collection) throw new Error('A MongoDB projects collection is required.');
  projectsCollection = collection;
}

function getCollection() {
  if (!projectsCollection) throw new Error('Projects database is not connected.');
  return projectsCollection;
}

function validateProject(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const requiredText = ['title', 'description', 'technologies', 'status'];
  if (!requiredText.every((key) => typeof data[key] === 'string' && data[key].trim())) return false;
  if (!['Planning', 'In Progress', 'Completed', 'On Hold'].includes(data.status)) return false;
  if (data.url !== undefined && data.url !== '') {
    try {
      const parsed = new URL(data.url);
      if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    } catch { return false; }
  }
  for (const key of ['startDate', 'endDate']) {
    if (data[key] !== undefined && data[key] !== '') {
      if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(data[key]) || Number.isNaN(Date.parse(data[key]))) return false;
    }
  }
  return true;
}

function normalizeProject(data) {
  const project = {
    title: data.title.trim(),
    description: data.description.trim(),
    technologies: data.technologies.trim(),
    status: data.status,
    updatedAt: new Date()
  };
  for (const key of ['url', 'startDate', 'endDate']) {
    if (typeof data[key] === 'string' && data[key].trim()) project[key] = data[key].trim();
  }
  return project;
}

async function getAllProjects() {
  return getCollection().find({}).sort({ createdAt: -1 }).toArray();
}

function validateId(id) {
  if (!ObjectId.isValid(id)) {
    const error = new Error('Project ID must be a valid MongoDB ObjectId.');
    error.status = 400;
    throw error;
  }
}

async function getProjectById(id) {
  validateId(id);
  return getCollection().findOne({ _id: new ObjectId(id) });
}

async function createProject(data) {
  if (!validateProject(data)) {
    const error = new Error('Project data is invalid.');
    error.status = 400;
    throw error;
  }
  const project = { ...normalizeProject(data), createdAt: new Date() };
  const result = await getCollection().insertOne(project);
  return { ...project, _id: result.insertedId };
}

async function updateProject(id, data) {
  validateId(id);
  if (!validateProject(data)) {
    const error = new Error('Project data is invalid.');
    error.status = 400;
    throw error;
  }
  const result = await getCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: normalizeProject(data) },
    { returnDocument: 'after' }
  );
  return result.value;
}

async function deleteProject(id) {
  validateId(id);
  const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

module.exports = { setProjectsCollection, validateProject, validateId, getAllProjects, getProjectById, createProject, updateProject, deleteProject };