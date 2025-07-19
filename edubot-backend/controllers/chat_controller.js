const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ChatSession = require("../db/chatSession");

// --- MCQ Question Bank (expand as needed) ---
// Remove MCQ_QUESTIONS and related logic

function getLanguageKey(language) {
  if (language === 'sinhala') return 'si';
  if (language === 'tamil') return 'ta';
  return 'en';
}

function formatMCQ(mcq, index) {
  // index is 0-based
  return `Q${index + 1}. ${mcq.question}\nA. ${mcq.options[0]}\nB. ${mcq.options[1]}\nC. ${mcq.options[2]}\nD. ${mcq.options[3]}\n\nPlease type A, B, C, or D:`;
}

// Helper: detect if user wants to stop MCQ mode
function isStopMCQRequest(message, language) {
  const msg = message.trim().toLowerCase();
  const stopWords = [
    'stop', 'end', 'exit', 'quit', 'enough', 'no', 'cancel', 'back', 'menu', 'main',
    'නවත්වන්න', 'අවසන්', 'නැහැ', 'නැවත', 'ඉවත්', 'ඉවරයි',
    'நிறுத்து', 'முடி', 'இல்லை', 'வெளியேறு', 'மீண்டும்', 'முடிந்தது'
  ];
  return stopWords.some(word => msg.includes(word));
}

// Helper: Extract the MCQ block for the user's language from the AI's output
function extractMCQBlock(aiText, language) {
  const langKey = getLanguageKey(language);
  let header = '';
  if (langKey === 'en') header = '# Language: English';
  if (langKey === 'si') header = '# Language: Sinhala';
  if (langKey === 'ta') header = '# Language: Tamil';
  // Split by ---
  const blocks = aiText.split(/---+/);
  for (const block of blocks) {
    if (block.includes(header)) {
      return block.trim();
    }
  }
  return null;
}

// Helper: Parse the MCQ block into question, options, answer, explanation
function parseMCQBlock(block) {
  // Use regex to extract question, options, answer, explanation
  const questionMatch = block.match(/Q\d+\.(.*?)(?:\n|$)/);
  const optionsMatch = block.match(/A\. (.*?)\nB\. (.*?)\nC\. (.*?)\nD\. (.*?)(?:\n|$)/s);
  const answerMatch = block.match(/Answer:\s*([A-D])/);
  const explanationMatch = block.match(/Explanation:\s*(.*)/);
  if (!questionMatch || !optionsMatch || !answerMatch || !explanationMatch) return null;
  return {
    question: questionMatch[1].trim(),
    options: [optionsMatch[1].trim(), optionsMatch[2].trim(), optionsMatch[3].trim(), optionsMatch[4].trim()],
    answer: answerMatch[1].trim(),
    explanation: explanationMatch[1].trim(),
  };
}

// Helper: Generate a new MCQ using the AI and parse the relevant block
async function generateMCQ(language) {
  const langKey = getLanguageKey(language);
  let prompt = '';
  if (langKey === 'en') {
    prompt = `Generate a single multiple-choice question (MCQ) for Sri Lankan A/L Political Science in the following format. Include all three languages (English, Sinhala, Tamil) as shown, separated by '---'.\n\n# Language: English\nQ1. <question in English>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in English>\n\n---\n\n# Language: Sinhala\nQ2. <question in Sinhala>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in Sinhala>\n\n---\n\n# Language: Tamil\nQ3. <question in Tamil>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in Tamil>\n`;
  } else if (langKey === 'si') {
    prompt = `Generate a single multiple-choice question (MCQ) for Sri Lankan A/L Political Science in the following format. Include all three languages (English, Sinhala, Tamil) as shown, separated by '---'.\n\n# Language: English\nQ1. <question in English>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in English>\n\n---\n\n# Language: Sinhala\nQ2. <question in Sinhala>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in Sinhala>\n\n---\n\n# Language: Tamil\nQ3. <question in Tamil>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in Tamil>\n`;
  } else if (langKey === 'ta') {
    prompt = `Generate a single multiple-choice question (MCQ) for Sri Lankan A/L Political Science in the following format. Include all three languages (English, Sinhala, Tamil) as shown, separated by '---'.\n\n# Language: English\nQ1. <question in English>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in English>\n\n---\n\n# Language: Sinhala\nQ2. <question in Sinhala>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in Sinhala>\n\n---\n\n# Language: Tamil\nQ3. <question in Tamil>\nA. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\nAnswer: <A/B/C/D>\nExplanation: <brief explanation in Tamil>\n`;
  }

  // Use Claude or OpenRouter to generate the MCQ
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "anthropic/claude-3-haiku",
      max_tokens: 800,
      messages: [
        { role: "system", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  let text = response.data?.choices?.[0]?.message?.content || '';
  // Extract the relevant language block
  const block = extractMCQBlock(text, language);
  if (!block) {
    console.error('AI MCQ block extraction failed. Raw response:', text);
    return null;
  }
  // Parse the block
  const mcq = parseMCQBlock(block);
  if (!mcq) {
    console.error('AI MCQ block parsing failed. Block:', block);
    return null;
  }
  return mcq;
}

// Controller for handling chat requests to Edubot
exports.handleChat = async (req, res) => {
  // Extract message, language, and sessionId from request body
  const { message, language, sessionId } = req.body;

  if (!message || !language || !sessionId) {
    return res.status(400).json({ error: "Message, language, and sessionId are required." });
  }

  // Load or create chat session
  let session = await ChatSession.findOne({ sessionId });
  if (!session) {
    session = new ChatSession({ sessionId, messages: [] });
  }

  // --- MCQ PRACTICE MODE ---
  const isMCQRequest = checkIfMCQRequest(message, language);
  const langKey = getLanguageKey(language);

  // Only enter MCQ mode if the user explicitly requests MCQs or is already in MCQ mode
  if (isMCQRequest || (session.mcqState && session.mcqState.active)) {
    // If user wants to stop MCQ mode
    if (isStopMCQRequest(message, language)) {
      session.mcqState = undefined;
      await session.save();
      const byeMsg = langKey === 'en' ? 'MCQ practice ended. You can ask any other Political Science question.' :
        langKey === 'si' ? 'MCQ අභ්‍යාසය අවසන්. ඔබට වෙනත් ප්‍රශ්නයක් අසන්න.' :
        'MCQ பயிற்சி முடிந்தது. நீங்கள் வேறு கேள்வி கேட்கலாம்.';
      session.messages.push({ role: "user", text: message, timestamp: new Date() });
      session.messages.push({ role: "bot", text: byeMsg, timestamp: new Date() });
      await session.save();
      return res.json({ reply: byeMsg });
    }

    // If no MCQ is active or previous set finished, generate a new MCQ
    if (!session.mcqState || !session.mcqState.active || !session.mcqState.currentMCQ) {
      const mcq = await generateMCQ(language);
      if (!mcq) {
        session.mcqState = undefined;
        await session.save();
        const errorMsg = langKey === 'en' ? 'Sorry, could not generate a question. MCQ mode ended. You can ask any other Political Science question.' :
          langKey === 'si' ? 'සමාවෙන්න, ප්‍රශ්නයක් ජනනය කළ නොහැක. MCQ අභ්‍යාසය අවසන්. ඔබට වෙනත් ප්‍රශ්නයක් අසන්න.' :
          'மன்னிக்கவும், கேள்வியை உருவாக்க முடியவில்லை. MCQ பயிற்சி முடிந்தது. நீங்கள் வேறு கேள்வி கேட்கலாம்.';
        session.messages.push({ role: "bot", text: errorMsg, timestamp: new Date() });
        return res.json({ reply: errorMsg });
      }
      session.mcqState = {
        active: true,
        currentMCQ: mcq,
        score: session.mcqState && session.mcqState.score ? session.mcqState.score : 0,
        total: session.mcqState && session.mcqState.total ? session.mcqState.total + 1 : 1
      };
      await session.save();
      // Format MCQ as Markdown
      const reply = `**Q. ${mcq.question}**\n\nA. ${mcq.options[0]}  \nB. ${mcq.options[1]}  \nC. ${mcq.options[2]}  \nD. ${mcq.options[3]}\n\nPlease type A, B, C, or D:`;
      session.messages.push({ role: "user", text: message, timestamp: new Date() });
      session.messages.push({ role: "bot", text: reply, timestamp: new Date() });
      await session.save();
      return res.json({ reply });
    }

    // Otherwise, treat message as an answer
    const mcq = session.mcqState.currentMCQ;
    const userAnswer = message.trim().toUpperCase();
    // If the user gives a valid MCQ answer, continue MCQ mode
    if (["A", "B", "C", "D"].includes(userAnswer)) {
      let feedback = "";
      let correct = false;
      if (userAnswer === mcq.answer) {
        session.mcqState.score = (session.mcqState.score || 0) + 1;
        correct = true;
        feedback = `✅ ${langKey === 'en' ? 'Correct!' : langKey === 'si' ? 'නිවැරදියි!' : 'சரியானது!'} ${mcq.explanation}`;
      } else {
        feedback = `❌ ${langKey === 'en' ? 'Not quite.' : langKey === 'si' ? 'වැරදි.' : 'தவறு.'} ${langKey === 'en' ? 'The correct answer is' : langKey === 'si' ? 'නිවැරදි පිළිතුර' : 'சரியான பதில்'} ${mcq.answer}. ${mcq.explanation}`;
      }
      session.messages.push({ role: "user", text: message, timestamp: new Date() });
      session.messages.push({ role: "bot", text: feedback, timestamp: new Date() });
      // Generate and ask the next MCQ
      const nextMCQ = await generateMCQ(language);
      if (!nextMCQ) {
        session.mcqState = undefined;
        await session.save();
        const errorMsg = langKey === 'en' ? 'Sorry, could not generate a question. MCQ mode ended. You can ask any other Political Science question.' :
          langKey === 'si' ? 'සමාවෙන්න, ප්‍රශ්නයක් ජනනය කළ නොහැක. MCQ අභ්‍යාසය අවසන්. ඔබට වෙනත් ප්‍රශ්නයක් අසන්න.' :
          'மன்னிக்கவும், கேள்வியை உருவாக்க முடியவில்லை. MCQ பயிற்சி முடிந்தது. நீங்கள் வேறு கேள்வி கேட்கலாம்.';
        session.messages.push({ role: "bot", text: errorMsg, timestamp: new Date() });
        return res.json({ reply: `${feedback}\n\n${errorMsg}` });
      }
      session.mcqState.currentMCQ = nextMCQ;
      session.mcqState.total = (session.mcqState.total || 0) + 1;
      await session.save();
      // Format next MCQ as Markdown
      const nextQ = `**Q. ${nextMCQ.question}**\n\nA. ${nextMCQ.options[0]}  \nB. ${nextMCQ.options[1]}  \nC. ${nextMCQ.options[2]}  \nD. ${nextMCQ.options[3]}\n\nPlease type A, B, C, or D:`;
      session.messages.push({ role: "bot", text: nextQ, timestamp: new Date() });
      await session.save();
      return res.json({ reply: `${feedback}\n\n${nextQ}` });
    } else if (isMCQRequest) {
      // If the user is requesting more MCQs, generate a new one
      const nextMCQ = await generateMCQ(language);
      if (!nextMCQ) {
        session.mcqState = undefined;
        await session.save();
        const errorMsg = langKey === 'en' ? 'Sorry, could not generate a question. MCQ mode ended. You can ask any other Political Science question.' :
          langKey === 'si' ? 'සමාවෙන්න, ප්‍රශ්නයක් ජනනය කළ නොහැක. MCQ අභ්‍යාසය අවසන්. ඔබට වෙනත් ප්‍රශ්නයක් අසන්න.' :
          'மன்னிக்கவும், கேள்வியை உருவாக்க முடியவில்லை. MCQ பயிற்சி முடிந்தது. நீங்கள் வேறு கேள்வி கேட்கலாம்.';
        session.messages.push({ role: "bot", text: errorMsg, timestamp: new Date() });
        return res.json({ reply: errorMsg });
      }
      session.mcqState.currentMCQ = nextMCQ;
      session.mcqState.total = (session.mcqState.total || 0) + 1;
      await session.save();
      // Format next MCQ as Markdown
      const nextQ = `**Q. ${nextMCQ.question}**\n\nA. ${nextMCQ.options[0]}  \nB. ${nextMCQ.options[1]}  \nC. ${nextMCQ.options[2]}  \nD. ${nextMCQ.options[3]}\n\nPlease type A, B, C, or D:`;
      session.messages.push({ role: "user", text: message, timestamp: new Date() });
      session.messages.push({ role: "bot", text: nextQ, timestamp: new Date() });
      await session.save();
      return res.json({ reply: nextQ });
    } else {
      // If the user sends a non-MCQ message, exit MCQ mode and switch to general chat
      session.mcqState = undefined;
      await session.save();
      // Continue to general chat mode below
    }
  }

  // --- GENERAL CHAT MODE ---
  // Read guidance from file
  let guidance = "";
  try {
    guidance = fs.readFileSync(path.join(__dirname, "../guidnese.txt"), "utf-8");
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
    // Append user message to history
    session.messages.push({ role: "user", text: message, timestamp: new Date() });

    // Prepare messages for AI (system + full history)
    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...session.messages.map(m => ({ role: m.role, content: m.text }))
    ];

    // Send request to Claude 3 Haiku via OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        max_tokens: 1000,
        messages: aiMessages,
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

    // Append bot reply to history
    session.messages.push({ role: "bot", text: claudeReply, timestamp: new Date() });

    // Save session
    await session.save();

    // Send the reply to the client
    res.json({ reply: claudeReply });
  } catch (error) {
    // Log and handle errors
    console.error("Claude API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Claude." });
  }
};

// Helper function to detect MCQ-related requests
function checkIfMCQRequest(message, language) {
  const messageLower = message.toLowerCase();
  
  // English keywords
  const englishMCQKeywords = [
    'mcq', 'multiple choice', 'practice mcq', 'mcq practice', 'let\'s practice mcq',
    'mcq question', 'multiple choice question', 'practice questions', 'quiz',
    'test me', 'give me a question', 'ask me a question'
  ];
  
  // Sinhala keywords
  const sinhalaMCQKeywords = [
    'mcq', 'බහුවරණ', 'අභ්‍යාස', 'ප්‍රශ්න', 'mcq අභ්‍යාස', 'අභ්‍යාස කරමු',
    'ප්‍රශ්නයක් දෙන්න', 'මට ප්‍රශ්නයක් දෙන්න', 'පුහුණු කරමු'
  ];
  
  // Tamil keywords
  const tamilMCQKeywords = [
    'mcq', 'பன்முக', 'பயிற்சி', 'கேள்வி', 'mcq பயிற்சி', 'பயிற்சி செய்வோம்',
    'ஒரு கேள்வி கேள்வி', 'எனக்கு ஒரு கேள்வி கொடுங்கள்', 'பயிற்சி செய்வோம்'
  ];
  
  let keywords = englishMCQKeywords;
  if (language === 'sinhala') {
    keywords = sinhalaMCQKeywords;
  } else if (language === 'tamil') {
    keywords = tamilMCQKeywords;
  }
  
  return keywords.some(keyword => messageLower.includes(keyword));
}

// Export the function for testing
exports.checkIfMCQRequest = checkIfMCQRequest;
