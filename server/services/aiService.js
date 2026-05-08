const { OpenAI } = require("openai");

// Initialize Mistral (Cloud Fallback)
const mistralClient = new OpenAI({
    apiKey: process.env.MISTRAL_API_KEY,
    baseURL: process.env.MISTRAL_BASE_URL || "https://api.mistral.ai/v1",
});

// Initialize Ollama (Local Primary)
const ollamaClient = new OpenAI({
    apiKey: "ollama", // API key is not required for local Ollama, but OpenAI client needs something
    baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
});

/**
 * Generate a completion trying Ollama first, falling back to Mistral
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} systemPrompt - Optional system prompt
 * @returns {Promise<string>} - The generated response content
 */
const generateCompletion = async (prompt, systemPrompt = "You are a professional AI business assistant.") => {
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
    ];

    try {
        console.log("Attempting to use local Ollama...");
        const response = await ollamaClient.chat.completions.create({
            model: process.env.OLLAMA_MODEL || "llama3:latest",
            messages: messages,
            temperature: 0.7,
        });
        
        console.log("Successfully generated response using Ollama.");
        return response.choices[0].message.content.trim();
        
    } catch (ollamaError) {
        console.warn("Ollama failed or not running. Falling back to Mistral API...", ollamaError.message);
        
        try {
            const response = await mistralClient.chat.completions.create({
                model: process.env.AI_MODEL || "mistral-tiny",
                messages: messages,
                temperature: 0.7,
            });

            console.log("Successfully generated response using Mistral.");
            return response.choices[0].message.content.trim();
            
        } catch (mistralError) {
            console.error("Both Ollama and Mistral Generation Failed:", mistralError.message);
            throw mistralError;
        }
    }
};

module.exports = {
    generateCompletion,
    mistralClient // Export if needed
};
