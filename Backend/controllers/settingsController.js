import Settings from '../models/Settings.js';

// Get user settings
export const getUserSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.userId });

    if (!settings) {
      settings = await Settings.create({ userId: req.userId });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update user settings
export const updateUserSettings = async (req, res, next) => {
  try {
    const { theme, voiceSpeed, voiceGender, notificationsEnabled } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { userId: req.userId },
      {
        ...(theme && { theme }),
        ...(voiceSpeed && { voiceSpeed }),
        ...(voiceGender && { voiceGender }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
