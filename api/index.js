// Vercel serverless entry point
// All /api/* requests are rewritten here by vercel.json
'use strict';

const path = require('path');

// Ensure backend modules can be required with their own relative paths
// by resolving them from the backend directory
const app = require('../backend/server');

module.exports = app;
