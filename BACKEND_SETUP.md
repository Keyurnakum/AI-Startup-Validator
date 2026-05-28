#!/usr/bin/env node

/**
 * StartupIQ — Backend Setup & Integration Guide
 * 
 * This file provides complete instructions for setting up and integrating
 * the StartupIQ backend with the Anthropic Claude API.
 */

// ════════════════════════════════════════════════════════════════════════
// STEP 1: GET ANTHROPIC API KEY
// ════════════════════════════════════════════════════════════════════════

const SETUP_STEPS = `
📋 SETUP INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Create Anthropic Account
  1. Visit: https://console.anthropic.com
  2. Sign up or log in
  3. Verify your email

STEP 2: Get API Key
  1. Go to: https://console.anthropic.com/account/keys
  2. Click "Create Key"
  3. Copy the key (format: sk-ant-xxxxx...)
  4. Keep it safe! Don't share or commit to git

STEP 3: Add to StartupIQ
  1. Open StartupIQ in browser
  2. Start an analysis
  3. When prompted, paste your API key
  4. Key is stored securely in browser localStorage

✅ DONE! Your backend is ready.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

// ════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION DETAILS
// ════════════════════════════════════════════════════════════════════════

const IMPLEMENTATION = {
  files: {
    'js/config.js': {
      purpose: 'Central configuration management',
      size: '~4KB',
      loaded: 'First',
      exports: 'CONFIG object',
    },
    'js/api.js': {
      purpose: 'Anthropic API wrapper with retry logic',
      size: '~12KB',
      loaded: 'Second',
      exports: 'AIService object',
      features: [
        'Automatic retry with exponential backoff',
        'Request timeout management (30s)',
        'Comprehensive error handling',
        'JSON validation',
        'Input sanitization',
      ],
    },
    'js/utils.js': {
      purpose: 'UI utilities and formatting',
      size: '~3KB',
      loaded: 'Third',
      exports: 'Toast, Router, Loader utilities',
    },
    'js/app.js': {
      purpose: 'Application logic and form handling',
      size: '~8KB',
      loaded: 'Fourth',
      exports: 'runAnalysis, saveDraft, etc.',
    },
    'data/store.js': {
      purpose: 'Local state and storage management',
      size: '~6KB',
      loaded: 'First (before config)',
      exports: 'AppState, DB objects',
    },
  },

  apiEndpoints: {
    primary: 'https://api.anthropic.com/v1/messages',
    authentication: 'x-api-key header',
    version: '2023-06-01',
  },

  requestStructure: {
    method: 'POST',
    contentType: 'application/json',
    timeout: '30 seconds',
    retries: '2 attempts with exponential backoff',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'your-api-key-here',
      'anthropic-version': '2023-06-01',
    },
    body: {
      model: 'claude-sonnet-4-20250514',
      max_tokens: '2000 (configurable)',
      system: 'system prompt',
      messages: 'array of messages',
    },
  },

  responseStructure: {
    format: 'JSON',
    validation: 'Schema checked',
    parsing: 'Robust with error handling',
    fallback: 'Demo analysis on failure',
  },

  errorHandling: {
    retryable: ['408', '429', '500', '502', '503', 'timeout', 'network'],
    notRetryable: ['400', '401', '403', 'invalid-json', 'schema-error'],
    userMessages: 'Friendly, actionable error messages',
    logging: 'Console error logs for debugging',
  },
};

// ════════════════════════════════════════════════════════════════════════
// CODE EXAMPLES
// ════════════════════════════════════════════════════════════════════════

const CODE_EXAMPLES = `
// Example 1: Analyze a Startup Idea
═══════════════════════════════════════════════════════════════════════════

const result = await AIService.analyzeStartup({
  idea: "An AI tool that automatically generates startup pitch decks",
  industry: "B2B SaaS",
  model: "SaaS Subscription",
  audience: "Startup founders and VCs",
  market: "North America",
  problem: "Founders spend days creating pitch decks",
  budget: "$200k-500k initial funding",
});

console.log(result);
// Output:
// {
//   score: 78,
//   scoreLabel: "Strong",
//   summary: "...",
//   tam: "$1.2B",
//   viability: "High",
//   riskLevel: "Medium",
//   tags: [...],
//   swot: {...},
//   competitors: [...],
//   risks: [...],
//   revenueModels: [...],
//   roadmap: [...]
// }


// Example 2: Chat with AI Co-Founder
═══════════════════════════════════════════════════════════════════════════

const aiResponse = await AIService.chat(
  "How should I approach customer acquisition?",
  [
    { role: 'user', content: 'My startup helps developers learn AI' },
    { role: 'assistant', content: 'That\'s a great market with strong demand...' },
  ],
  currentAnalysis
);

console.log(aiResponse);
// Output: "Here's my recommendation: Start with..."


// Example 3: Quick Idea Score
═══════════════════════════════════════════════════════════════════════════

const quickScore = await AIService.quickScore(
  "A marketplace for freelance data scientists"
);

console.log(quickScore);
// Output: { score: 65, oneliner: "Solid market, needs differentiation" }


// Example 4: Error Handling
═══════════════════════════════════════════════════════════════════════════

try {
  const result = await AIService.analyzeStartup(formData);
  console.log('Analysis successful:', result);
} catch (err) {
  if (err.message.includes('API key')) {
    console.error('Invalid API key - please check your credentials');
    AIService.clearApiKey(); // Clear bad key
  } else if (err.message.includes('timeout')) {
    console.error('Request timeout - network may be slow');
  } else if (err.message.includes('429')) {
    console.error('Rate limited - please wait before retrying');
  } else {
    console.error('Unexpected error:', err.message);
  }
}


// Example 5: Clear API Key (Logout)
═══════════════════════════════════════════════════════════════════════════

AIService.clearApiKey();
console.log('API key cleared - next analysis will prompt for new key');


// Example 6: Get Current Configuration
═══════════════════════════════════════════════════════════════════════════

CONFIG.log();
// Outputs: Current config including model, timeout, retries, demo mode


// Example 7: Validate Environment
═══════════════════════════════════════════════════════════════════════════

const env = CONFIG.validateEnvironment();
console.log('Is valid:', env.isValid);
console.log('Issues:', env.issues);
`;

// ════════════════════════════════════════════════════════════════════════
// BACKEND FEATURES
// ════════════════════════════════════════════════════════════════════════

const FEATURES = [
  '✅ Automatic Retry Logic — Exponential backoff for transient failures',
  '✅ Request Timeout — 30-second timeout with graceful fallback',
  '✅ Input Validation — Comprehensive checks on all inputs',
  '✅ Error Recovery — Demo analysis on API failures',
  '✅ Secure Storage — API key stored locally in browser',
  '✅ JSON Parsing — Robust parsing with full validation',
  '✅ User-Friendly Errors — Clear, actionable error messages',
  '✅ Rate Limiting — Respects API rate limits with backoff',
  '✅ Response Validation — Schema checking on all responses',
  '✅ Fallback Analysis — Seamless degradation on failure',
];

// ════════════════════════════════════════════════════════════════════════
// TESTING CHECKLIST
// ════════════════════════════════════════════════════════════════════════

const TESTING_CHECKLIST = `
🧪 TESTING & VALIDATION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SETUP
  [ ] API key obtained from console.anthropic.com
  [ ] Key added to app (stores in localStorage)
  [ ] CONFIG loads without errors
  [ ] AIService methods available in console

HAPPY PATH
  [ ] Analysis completes successfully
  [ ] Result shows valid score (1-100)
  [ ] All analysis fields populated
  [ ] Chat works with analysis context
  [ ] Quick score returns valid JSON

ERROR SCENARIOS
  [ ] Invalid API key → Shows helpful message
  [ ] Missing API key → Prompts for key
  [ ] Network timeout → Shows timeout message
  [ ] Rate limit (429) → Retries automatically
  [ ] Server error (500) → Shows server error message
  [ ] Invalid input → Shows validation error
  [ ] Empty response → Falls back to demo analysis
  [ ] Malformed JSON → Falls back to demo analysis

EDGE CASES
  [ ] Very long idea (1000+ chars) → Handles gracefully
  [ ] Special characters in input → Encoded properly
  [ ] Rapid successive requests → Queued appropriately
  [ ] Offline mode → Falls back to demo
  [ ] Multiple concurrent analyses → Handled properly
  [ ] Key cleared mid-analysis → Prompts again
  [ ] Browser storage quota exceeded → Graceful degradation

PERFORMANCE
  [ ] First analysis < 15 seconds
  [ ] Subsequent analyses < 15 seconds
  [ ] Retry adds < 5 seconds overhead
  [ ] UI remains responsive during API calls
  [ ] Memory usage stays reasonable

SECURITY
  [ ] API key never logged to console
  [ ] API key not in HTML
  [ ] No credentials in error messages
  [ ] Requests use HTTPS (production)
  [ ] LocalStorage isolated per origin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

// ════════════════════════════════════════════════════════════════════════
// TROUBLESHOOTING
// ════════════════════════════════════════════════════════════════════════

const TROUBLESHOOTING = `
🔧 TROUBLESHOOTING GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM: "API key required" error
SOLUTION: 
  1. Get API key from https://console.anthropic.com/account/keys
  2. Paste when prompted
  3. Check localStorage: localStorage.getItem('anthropic_api_key')

PROBLEM: "Invalid API key" error
SOLUTION:
  1. Verify key format starts with "sk-ant-"
  2. Check for copy/paste errors (no spaces)
  3. Key may have been revoked - get new one
  4. Clear old key: AIService.clearApiKey()

PROBLEM: Request timeout
SOLUTION:
  1. Check internet connection
  2. Try again - may be transient
  3. Check if API is experiencing outages
  4. Verify firewall/proxy isn't blocking api.anthropic.com

PROBLEM: Rate limit (429) errors
SOLUTION:
  1. Wait 1-2 minutes before retrying
  2. Reduce frequency of requests
  3. Check API quota: https://console.anthropic.com/account

PROBLEM: "Could not parse response" error
SOLUTION:
  1. This is rare and triggers demo analysis
  2. Check browser console for details
  3. Try again - may be temporary
  4. Report if persists

PROBLEM: Demo/fallback analysis showing
SOLUTION:
  1. This is normal when API is unavailable
  2. Check network status
  3. Verify API key is valid
  4. Check browser console for error details
  5. Try clearing API key and entering new one

PROBLEM: Missing analysis fields
SOLUTION:
  1. Check CONFIG.VALIDATION settings
  2. Ensure all required form fields filled
  3. Verify API response is valid JSON
  4. Check browser console for parsing errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

// ════════════════════════════════════════════════════════════════════════
// EXPORT AND DISPLAY
// ════════════════════════════════════════════════════════════════════════

console.log(SETUP_STEPS);
console.log('Implementation:', IMPLEMENTATION);
console.log('Features:', FEATURES);
console.log(CODE_EXAMPLES);
console.log(TESTING_CHECKLIST);
console.log(TROUBLESHOOTING);

module.exports = {
  SETUP_STEPS,
  IMPLEMENTATION,
  FEATURES,
  CODE_EXAMPLES,
  TESTING_CHECKLIST,
  TROUBLESHOOTING,
};
