const Story = require('../../models/Story');

// ==========================================
// 1. GET ALL ACTIVE STORIES
// ==========================================
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({ isActive: true }).sort({ order: 1 });
    
    res.status(200).json({
      status: 'success',
      results: stories.length,
      data: { stories }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ==========================================
// 2. CREATE A NEW STORY (Fixed with Multer support)
// ==========================================
exports.createStory = async (req, res) => {
  try {
    // Cloudinary ka direct secure CDN url req.file.path me aata hai
    const finalImageUrl = req.file ? req.file.path : req.body.imageUrl;

    if (!finalImageUrl) {
      return res.status(400).json({ status: 'error', message: 'Media file asset is required' });
    }

    const storyData = {
      title: req.body.title,
      description: req.body.description,
      imageUrl: finalImageUrl, // Database me direct Cloud link save hoga
      order: req.body.order || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const newStory = await Story.create(storyData);
    res.status(201).json({ status: 'success', data: { story: newStory } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ==========================================
//  update  STORY (Fixed with Multer support)
// ==========================================

exports.updateStory = async (req, res) => {
  try {
    const updateData = { ...req.body };
    

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedStory = await Story.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedStory) {
      return res.status(404).json({ status: 'fail', message: 'No story found with that ID' });
    }

    res.status(200).json({ status: 'success', data: { story: updatedStory } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ==========================================
// 3. GET SINGLE STORY BY ID
// ==========================================
exports.getSingleStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        status: 'fail',
        message: 'No story found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { story }
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};


// ==========================================
// 5. DELETE STORY FROM DATABASE
// ==========================================
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);

    if (!story) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'No story found with that ID' 
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};