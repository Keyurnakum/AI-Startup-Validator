const OpenAI = require('openai');

function localAnalysis({ startupName, idea, industry, targetAudience }) {
  const baseScore = Math.min(100, Math.max(40, Math.round((idea.length / 8) + 50)));

  return {
    summary: `${startupName} targets ${targetAudience || 'a broad audience'} in ${industry || 'its market'} with a differentiated idea: ${idea.slice(0, 180)}${idea.length > 180 ? '...' : ''}`,
    swot: {
      strengths: ['Clear value proposition', 'AI-driven scalability potential'],
      weaknesses: ['Execution risk for early teams', 'Needs validated customer acquisition channels'],
      opportunities: ['Growing AI adoption across industries', 'Potential strategic partnerships'],
      threats: ['Fast-moving competitors', 'Changing regulations and platform dependency'],
    },
    marketResearch: `Market demand appears promising for ${industry || 'this segment'}, but validate willingness to pay with interviews and landing-page tests.`,
    competitorAnalysis: 'Differentiate on speed, UX quality, and measurable customer outcomes versus incumbents.',
    startupScore: baseScore,
    growthRecommendations: [
      'Run 20 customer discovery interviews in your primary segment.',
      'Launch a focused MVP for one high-value use case.',
      'Track activation, retention, and referral metrics weekly.',
    ],
  };
}

async function analyzeIdea(input) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return localAnalysis(input);
  }

  const client = new OpenAI({ apiKey });
  const prompt = `Return strict JSON with keys: summary, swot{strengths,weaknesses,opportunities,threats}, marketResearch, competitorAnalysis, startupScore, growthRecommendations. Analyze startup idea. Input: ${JSON.stringify(input)}`;

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || '{}');

    return {
      summary: parsed.summary || '',
      swot: {
        strengths: parsed.swot?.strengths || [],
        weaknesses: parsed.swot?.weaknesses || [],
        opportunities: parsed.swot?.opportunities || [],
        threats: parsed.swot?.threats || [],
      },
      marketResearch: parsed.marketResearch || '',
      competitorAnalysis: parsed.competitorAnalysis || '',
      startupScore: Number(parsed.startupScore) || 0,
      growthRecommendations: parsed.growthRecommendations || [],
    };
  } catch (_error) {
    return localAnalysis(input);
  }
}

module.exports = { analyzeIdea };
