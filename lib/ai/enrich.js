import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";

const MODEL = "qwen25-3b-food";
const ENDPOINT_NAME = process.env.SAGEMAKER_ENDPOINT;

const client = new SageMakerRuntimeClient({
  region: process.env.AWS_REGION,
});

const SYSTEM_PROMPT = `
You are an expert food taxonomy, restaurant catalog enrichment, menu intelligence and food search optimization engine.
Your goal is to make this food item highly discoverable in search while PREVENTING KEYWORD STUFFING.

CRITICAL RELEVANCE RULES:
- If an item is a combo (e.g., "Kadhai Paneer with Roti"), set "is_combo" to true. 
- For combos, DO NOT repeat the main dish name (e.g., "Kadhai Paneer") in every alias or search term. This prevents combos from incorrectly outranking the standalone dish.
- Ensure "normalized_name" is clean and represents the dish accurately.
- DO NOT keyword stuff. Provide diverse, high-quality search terms instead of repeating the same word.
- Limit tags, keywords, and terms to the most highly relevant items.

JSON FORMATTING RULES:
1. Return ONLY a single valid JSON object.
2. NO markdown formatting (no \`\`\`json).
3. NO explanations, preambles, or conversational text.
4. NEVER omit any field from the schema.
5. If a value is unknown, use an empty string "" or empty array []. Never return null.
6. Ensure there are NO trailing commas.

YOU MUST STRICTLY FOLLOW THIS EXACT SCHEMA AND INCLUDE ALL KEYS:
{
  "cuisine": "",
  "tags": [],
  "is_combo": false,
  "food_type": "",
  "enrichment": {
    "version": "v3",
    "model": "qwen25-3b-food",
    "normalized_name": "",
    "taxonomy": {
      "cuisine_family": "",
      "cuisine_region": "",
      "cuisine_sub_region": "",
      "course": "",
      "dish_family": "",
      "dish_type": "",
      "cooking_methods": [],
      "proteins": []
    },
    "ingredient_entities": [
      {
        "name": "",
        "confidence": 0.0,
        "importance": 0.0
      }
    ],
    "spice_level": "",
    "course": "",
    "dietary_tags": [],
    "allergens": [],
    "search_aliases": [],
    "search_keywords": [],
    "search_terms": [],
    "misspellings": [],
    "search_document": "",
    "confidence_score": 0.95,
    "reviewed": false
  }
}

EXAMPLE RESPONSE (For "Kadhai Paneer"):
{
  "cuisine": "Indian",
  "tags": ["north indian", "main course", "paneer", "spicy", "curry", "vegetarian"],
  "is_combo": false,
  "food_type": "veg",
  "enrichment": {
    "version": "v3",
    "model": "qwen25-3b-food",
    "normalized_name": "Kadhai Paneer",
    "taxonomy": {
      "cuisine_family": "Asian",
      "cuisine_region": "North Indian",
      "cuisine_sub_region": "Punjabi",
      "course": "Main Course",
      "dish_family": "Curry",
      "dish_type": "Vegetarian",
      "cooking_methods": ["Stir Frying", "Simmering"],
      "proteins": ["Paneer"]
    },
    "ingredient_entities": [
      { "name": "Paneer", "confidence": 0.99, "importance": 1.0 },
      { "name": "Bell Pepper", "confidence": 0.95, "importance": 0.8 }
    ],
    "spice_level": "medium",
    "course": "Main Course",
    "dietary_tags": ["vegetarian", "gluten-free"],
    "allergens": ["dairy"],
    "search_aliases": ["karahi paneer", "kadahi paneer"],
    "search_keywords": ["capsicum", "cottage cheese", "kadai masala"],
    "search_terms": ["best kadhai paneer", "paneer curry", "spicy paneer main course"],
    "misspellings": ["kadai panir", "kadhi paneer"],
    "search_document": "Kadhai Paneer is a spicy North Indian main course vegetarian curry made with cottage cheese, bell peppers, and kadai masala.",
    "confidence_score": 0.95,
    "reviewed": false
  }
}
`;

function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in response");
    return JSON.parse(match[0]);
  }
}

function extractModelOutput(raw) {
  if (!raw) return "";

  try {
    const decoded = new TextDecoder().decode(raw);
    const json = JSON.parse(decoded);

    return (
      json.choices?.[0]?.message?.content ||
      json.generated_text ||
      json[0]?.generated_text ||
      decoded
    );
  } catch {
    return new TextDecoder().decode(raw);
  }
}

export async function enrichFoodItem(foodItem) {
  if (!ENDPOINT_NAME) {
    throw new Error("Missing SAGEMAKER_ENDPOINT env variable");
  }

  const command = new InvokeEndpointCommand({
    EndpointName: ENDPOINT_NAME,
    ContentType: "application/json",
    Accept: "application/json",

    Body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Enrich this food item using the schema strictly:\n\n${JSON.stringify(
            foodItem,
            null,
            2
          )}\n\nIMPORTANT: Output ONLY a single valid JSON object. No backticks, no markdown, no explanations.`,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  try {
    const response = await client.send(command);
    const textOutput = extractModelOutput(response.Body);
    
    // Log for debugging if parsing fails later
    console.log("Raw model output:", textOutput.substring(0, 200) + "...");

    const result = safeParseJSON(textOutput);

    // safety patch (never trust model fully)
    result.enrichment = result.enrichment || {};
    result.enrichment.version = "v3";
    result.enrichment.model = MODEL;
    result.enrichment.generated_at = new Date().toISOString();

    return result;
  } catch (err) {
    console.error("❌ SageMaker enrichment failed:", err);
    throw err;
  }
}