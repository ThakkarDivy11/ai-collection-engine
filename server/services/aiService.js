const { OpenAI } = require("openai");

// Initialize OpenAI client with Mistral configuration
// Mistral is OpenAI-compatible, so we can use the same SDK
const openai = new OpenAI({
    apiKey: process.env.MISTRAL_API_KEY,
    baseURL: process.env.MISTRAL_BASE_URL || "https://api.mistral.ai/v1",
});

/**
 * Generate a completion using Mistral AI
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} systemPrompt - Optional system prompt
 * @returns {Promise<string>} - The generated response content
 */
const generateCompletion = async (prompt, systemPrompt = "You are a professional AI business assistant.") => {
    try {
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "mistral-tiny",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        throw error;
    }
};

module.exports = {
    generateCompletion,
    openai // Export the raw client if needed
};
