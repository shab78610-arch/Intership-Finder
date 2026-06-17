const Internship = require('../models/Internship');

// Get all internships
exports.getInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: internships,
    });
  } catch (err) {
    console.error('Get Internships Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get single internship
exports.getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!internship) {
      return res.status(404).json({ msg: 'Internship not found' });
    }
    
    res.json({
      success: true,
      data: internship,
    });
  } catch (err) {
    console.error('Get Internship Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Create internship
exports.createInternship = async (req, res) => {
  try {
    const { title, company, description, location, stipend, status } = req.body;

    if (!title || !company || !description || !location) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newInternship = new Internship({
      title,
      company,
      description,
      location,
      stipend: stipend || 0,
      status: status || 'open',
      createdBy: req.user.id,
    });

    const internship = await newInternship.save();
    res.status(201).json({
      success: true,
      data: internship,
    });
  } catch (err) {
    console.error('Create Internship Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update internship
exports.updateInternship = async (req, res) => {
  try {
    const { title, company, description, location, stipend, status } = req.body;
    
    let internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ msg: 'Internship not found' });
    }

    internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { 
        title: title || internship.title,
        company: company || internship.company,
        description: description || internship.description,
        location: location || internship.location,
        stipend: stipend !== undefined ? stipend : internship.stipend,
        status: status || internship.status,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: internship,
    });
  } catch (err) {
    console.error('Update Internship Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete internship
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ msg: 'Internship not found' });
    }

    await internship.deleteOne();
    res.json({
      success: true,
      msg: 'Internship removed successfully',
    });
  } catch (err) {
    console.error('Delete Internship Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};