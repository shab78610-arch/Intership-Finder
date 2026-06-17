const express = require('express');
const router = express.Router();
const {
  applyForInternship,
  getUserApplications,
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// User routes
router.post('/', auth, roleCheck(['user']), applyForInternship);
router.get('/my', auth, roleCheck(['user']), getUserApplications);

// Admin routes
router.get('/all', auth, roleCheck(['admin']), getAllApplications);
router.put('/:id', auth, roleCheck(['admin']), updateApplicationStatus);

module.exports = router;