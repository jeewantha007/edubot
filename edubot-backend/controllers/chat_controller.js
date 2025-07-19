const axios = require("axios");
const fs = require("fs");

// Controller for handling chat requests to Edubot
exports.handleChat = async (req, res) => {
  // Extract message and language from request body
  const { message, language } = req.body;

  // Validate input
  if (!message || !language) {
    return res.status(400).json({ error: "Message and language are required." });
  }

  // Read guidance from file
  let guidance = "";
  try {
    guidance = fs.readFileSync(require("path").join(__dirname, "../guidnese.txt"), "utf-8");
  } catch (err) {
    guidance = ""; // fallback if file not found
  }

  // Set system prompt based on selected language
  let systemPrompt = "";
  if (language === "sinhala") {
    systemPrompt = `${guidance}\n\nAct like a Sinhala Political Science teacher for A/L students in Sri Lanka. Answer in simple Sinhala.`;
  } else if (language === "tamil") {
    systemPrompt = `${guidance}\n\nAct like a Tamil Political Science teacher for A/L students in Sri Lanka. Answer in simple Tamil.`;
  } else {
    systemPrompt = `${guidance}\n\nYou are a helpful Political Science teacher for Sri Lankan A/L students. \nAlways format your answers in clear, structured Markdown, following these rules:\n- Start with a short summary sentence.\n- Then, list the main points using bullet points or numbers.\n- Bold important terms (e.g., **Democracy**).\n- Use short paragraphs (2-3 sentences max per paragraph).\n- If possible, provide a relevant example (preferably related to Sri Lanka).\n- End with a brief recap to reinforce the main idea.\n- Do NOT write large text blocks; break up information for easy reading.\n- Use Markdown for formatting (bold, lists, etc.).`;
  }

  try {
    // Send request to Claude 3 Haiku via OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        max_tokens: 1000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract Claude's reply from the response
    const claudeReply = response.data?.choices?.[0]?.message?.content || "No response from Claude.";
    // Send the reply to the client
    res.json({ reply: claudeReply });
  } catch (error) {
    // Log and handle errors
    console.error("Claude API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Claude." });
  }
};
