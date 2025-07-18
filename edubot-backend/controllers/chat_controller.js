const axios = require("axios");

// Controller for handling chat requests to Edubot
exports.handleChat = async (req, res) => {
  // Extract message and language from request body
  const { message, language } = req.body;

  // Validate input
  if (!message || !language) {
    return res.status(400).json({ error: "Message and language are required." });
  }

  // Set system prompt based on selected language
  let systemPrompt = "";
  if (language === "sinhala") {
    systemPrompt = "Act like a Sinhala Political Science teacher for A/L students in Sri Lanka. Answer in simple Sinhala.";
  } else if (language === "tamil") {
    systemPrompt = "Act like a Tamil Political Science teacher for A/L students in Sri Lanka. Answer in simple Tamil.";
  } else {
    systemPrompt = "Act like a friendly Political Science teacher for A/L students in Sri Lanka. Answer in simple English.";
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
