import { generateSmartFallbackRecipes } from './recipeEngine';

// Storage keys for user configured API keys in demo mode
export const STORAGE_KEYS = {
  PROVIDER: 'whats_cooking_provider', // 'claude' | 'openai' | 'demo'
  CLAUDE_KEY: 'whats_cooking_claude_key',
  OPENAI_KEY: 'whats_cooking_openai_key',
};

export function getStoredApiConfig() {
  const envClaude = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
  const envOpenAI = import.meta.env.VITE_OPENAI_API_KEY || '';

  const storedProvider = localStorage.getItem(STORAGE_KEYS.PROVIDER);
  const storedClaude = localStorage.getItem(STORAGE_KEYS.CLAUDE_KEY) || envClaude;
  const storedOpenAI = localStorage.getItem(STORAGE_KEYS.OPENAI_KEY) || envOpenAI;

  let defaultProvider = storedProvider;
  if (!defaultProvider) {
    if (storedClaude) defaultProvider = 'claude';
    else if (storedOpenAI) defaultProvider = 'openai';
    else defaultProvider = 'demo';
  }

  return {
    provider: defaultProvider,
    claudeKey: storedClaude,
    openAiKey: storedOpenAI,
  };
}

export function saveApiConfig({ provider, claudeKey, openAiKey }) {
  if (provider) localStorage.setItem(STORAGE_KEYS.PROVIDER, provider);
  if (claudeKey !== undefined) localStorage.setItem(STORAGE_KEYS.CLAUDE_KEY, claudeKey);
  if (openAiKey !== undefined) localStorage.setItem(STORAGE_KEYS.OPENAI_KEY, openAiKey);
}

/**
 * Builds the strict prompt requesting 5 varied, chef-quality recipes.
 */
function buildPrompt(ingredients, expiringSoonList, dietaryFilters, varietySeed) {
  return `You are an award-winning recipe developer (think serious home-cooking magazines, not a generic meal-kit bot).
Invent exactly 5 DISTINCT recipes from this pantry. People will cook these tonight.

USER'S CURRENT INGREDIENTS:
${ingredients.map(i => `- ${i}`).join('\n')}

EXPIRING SOON (star these in at least 2 recipes):
${expiringSoonList.length > 0 ? expiringSoonList.map(i => `- ${i} (EXPIRING SOON!)`).join('\n') : 'None marked'}

ACTIVE DIETARY RESTRICTIONS:
${dietaryFilters.length > 0 ? dietaryFilters.join(', ') : 'None'}

VARIETY SEED: ${varietySeed}
Use this seed to choose a different cuisine mix than a previous run with the same pantry.

DIVERSITY — NON-NEGOTIABLE:
- All 5 recipes must be different DISH TYPES. Never return four skillet / medley / hash / broth clones with the ingredient names swapped in.
- Cover at least 4 world cuisines. Pick from: Japanese, Korean, Chinese, Thai, Indian, Mexican, Italian, Greek, North African, Levantine, French, American Southern, Spanish, Vietnamese.
- Cover at least 4 techniques: e.g. stir-fry, simmer/poach, bake/roast, scramble/omelette, stew, steam, sear + pan sauce, toss/salad, stuff/fold, braise.
- Use REAL dish names a human would order or search for (oyakodon, frittata, congee, tacos, spanakorizo, shakshuka, bibimbap-style bowl, korma, fried rice, lemon-garlic chicken, egg-drop soup).
- FORBIDDEN names: "Rustic X & Y Skillet", "Aromatic Medley", "Savory Hash", "Garden Greens Broth", "Pantry Stir-Fry", anything that is just two ingredient names plus "skillet/bowl/medley".
- Each recipe must spotlight a DIFFERENT pairing of pantry items. Do not dump every ingredient into every dish.
- Vary cookTime and difficulty across the five.

COOKING QUALITY:
- Steps must be specific: heat level, minutes, pan type, visual doneness cues, roughly measured seasoning.
- missingIngredients: 1–3 extras that make the dish special (mirin, tortillas, coconut milk, lemon). Do NOT list salt, pepper, or oil unless truly essential and absent.
- matchScore = matchedCount / (matchedCount + missingCount), then add 0.08 if the recipe uses an expiring ingredient. Clamp 0.50–0.99.
- Include cookTime, difficulty (Easy|Medium), and servings.
- dietaryTags should include the cuisine plus any matching diet tags.
- If dietary restrictions are specified, EVERY recipe must comply.
  Kosher: no pork, shellfish, or mixing meat with dairy.
  Halal: no pork or alcohol; treat meat as halal.
  Vegetarian/Vegan/Gluten-Free: strictly honor them.

Return ONLY valid JSON matching this schema:
{
  "recipes": [
    {
      "id": "short-kebab-id",
      "name": "Real Dish Name",
      "hook": "One appetizing line that mentions the cooking method or flavor, not a grocery list",
      "matchedIngredients": ["ingredient from user list"],
      "missingIngredients": ["optional extra"],
      "matchScore": 0.85,
      "cookTime": "22 min",
      "difficulty": "Easy",
      "servings": "2 servings",
      "dietaryTags": ["Japanese", "Quick (<30min)"],
      "steps": ["Step with times and cues", "Step 2"],
      "substitutionTip": "A specific swap, or null"
    }
  ]
}`;
}

/**
 * Parses raw LLM text into JSON safely, stripping code fences if needed.
 */
function cleanAndParseJson(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

/**
 * Calls Claude (Anthropic API)
 */
async function callClaudeApi(apiKey, ingredients, expiringSoonList, dietaryFilters, varietySeed) {
  const prompt = buildPrompt(ingredients, expiringSoonList, dietaryFilters, varietySeed);
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.95,
      system:
        'You are a creative executive chef. Output STRICT JSON only — no markdown, no preamble. Recipes must be diverse cuisines and techniques, never 4 clones of the same skillet/hash/soup template.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorBody || response.statusText}`);
  }

  const data = await response.json();
  const textContent = data.content?.map(c => c.text).join('') || '';
  const parsed = cleanAndParseJson(textContent);
  if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
    throw new Error('Invalid JSON structure returned by Claude');
  }
  return parsed.recipes;
}

/**
 * Calls OpenAI API
 */
async function callOpenAiApi(apiKey, ingredients, expiringSoonList, dietaryFilters, varietySeed) {
  const prompt = buildPrompt(ingredients, expiringSoonList, dietaryFilters, varietySeed);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a creative executive chef. Output STRICT JSON only. Recipes must be diverse cuisines and techniques, never 4 clones of the same skillet/hash/soup template.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.95,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  const parsed = cleanAndParseJson(content);
  if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
    throw new Error('Invalid JSON structure returned by OpenAI');
  }
  return parsed.recipes;
}

/**
 * Main generate function with automatic provider dispatch and graceful fallback
 */
export async function generateRecipes({ ingredients, expiringSoonList, dietaryFilters, apiConfig }) {
  const { provider, claudeKey, openAiKey } = apiConfig || getStoredApiConfig();
  const varietySeed = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (provider === 'claude' && claudeKey) {
    return await callClaudeApi(claudeKey, ingredients, expiringSoonList, dietaryFilters, varietySeed);
  }

  if (provider === 'openai' && openAiKey) {
    return await callOpenAiApi(openAiKey, ingredients, expiringSoonList, dietaryFilters, varietySeed);
  }

  if (claudeKey) {
    return await callClaudeApi(claudeKey, ingredients, expiringSoonList, dietaryFilters, varietySeed);
  }

  if (openAiKey) {
    return await callOpenAiApi(openAiKey, ingredients, expiringSoonList, dietaryFilters, varietySeed);
  }

  await new Promise(resolve => setTimeout(resolve, 1400));
  return generateSmartFallbackRecipes(ingredients, expiringSoonList, dietaryFilters, varietySeed);
}
