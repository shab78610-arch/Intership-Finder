const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternship,        // ← ADD THIS (was missing)
  createInternship,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Routes
router.get('/', getInternships);
router.get('/:id', getInternship);  // ← This was causing the error
router.post('/', auth, roleCheck(['admin']), createInternship);
router.put('/:id', auth, roleCheck(['admin']), updateInternship);
router.delete('/:id', auth, roleCheck(['admin']), deleteInternship);

module.exports = router;