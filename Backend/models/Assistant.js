import mongoose from 'mongoose';

const assistantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assistantType: {
      type: String,
      enum: ['JARVIS', 'NOVA', 'ECHO', 'TITAN', 'AURA', 'ZENITH', 'ALPHA', 'ORION', 'VEGA', 'NEXUS'],
      required: true,
    },
    customName: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    glowColor: String,
    avatar: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Assistant', assistantSchema);
