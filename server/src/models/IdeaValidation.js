const mongoose = require('mongoose');

const ideaValidationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    startupName: { type: String, required: true, trim: true },
    idea: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    targetAudience: { type: String, trim: true },
    analysis: {
      summary: String,
      swot: {
        strengths: [String],
        weaknesses: [String],
        opportunities: [String],
        threats: [String],
      },
      marketResearch: String,
      competitorAnalysis: String,
      startupScore: Number,
      growthRecommendations: [String],
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.IdeaValidation || mongoose.model('IdeaValidation', ideaValidationSchema);
