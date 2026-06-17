const Application = require('../models/Application');
const Internship = require('../models/Internship');

// Apply for internship
exports.applyForInternship = async (req, res) => {
  try {
    const { internshipId } = req.body;

    if (!internshipId) {
      return res.status(400).json({ msg: 'Internship ID is required' });
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ msg: 'Internship not found' });
    }

    if (internship.status !== 'open') {
      return res.status(400).json({ msg: 'This internship is no longer accepting applications' });
    }

    const existingApplication = await Application.findOne({
      student: req.user.id,
      internship: internshipId,
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'Already applied for this internship' });
    }

    const application = new Application({
      student: req.user.id,
      internship: internshipId,
      status: 'pending',
    });

    await application.save();
    await application.populate('student', 'name email');
    await application.populate('internship', 'title company');

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err) {
    console.error('Apply Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('internship', 'title company location stipend status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (err) {
    console.error('Get User Applications Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all applications (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email')
      .populate('internship', 'title company location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (err) {
    console.error('Get All Applications Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update application status (Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status. Must be pending, approved, or rejected' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    application.status = status;
    await application.save();

    await application.populate('student', 'name email');
    await application.populate('internship', 'title company');

    res.json({
      success: true,
      data: application,
    });
  } catch (err) {
    console.error('Update Application Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};