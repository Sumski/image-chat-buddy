
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageBase64 } = await req.json();

    console.log("Function invoked with prompt:", prompt ? "provided" : "empty");
    console.log("Image provided:", imageBase64 ? "yes" : "no");

    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      throw new Error("API key configuration error");
    }

    const messages = [
      { role: 'system', content: 'You are an AI assistant specialized in generating SEO-optimized alt text for images. Your goal is to create concise, accurate, and keyword-rich alt text that improves accessibility and enhances search engine optimization (SEO).\n\nGuidelines:\n1. **Accuracy & Relevance**: Describe the image content clearly and concisely, focusing on its primary subject and key details.\n2. **SEO Optimization**: Include relevant keywords naturally, prioritizing terms that align with how users might search for similar content.\n3. **Clarity & Conciseness**: Keep descriptions between 8-15 words. Avoid unnecessary details that don\'t contribute to SEO value.\n4. **Avoid Redundancy**: Do not include words like "image of" or "picture of" since they are unnecessary.\n5. **Context Awareness**: If a user provides additional context, incorporate it to make the alt text more effective for its intended use.\n6. **Accessibility-Friendly**: Ensure that alt text is readable and beneficial for visually impaired users relying on screen readers.\n7. **No Keyword Stuffing**: Maintain natural language without excessive repetition of keywords.\n8. **Language**: Write alt text in Slovenian language.' }
    ];

    // Add user message with image if present
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt || 'Generate an SEO-optimized alt text in Slovenian language for the uploaded image, ensuring that it is concise, descriptive, and keyword-rich while remaining natural and readable. Follow these guidelines:\n\n1. Describe the image clearly and accurately.\n2. Use relevant keywords to enhance search engine discoverability.\n3. Keep the description between 8-15 words.\n4. Avoid phrases like "image of" or "picture of."\n5. Ensure readability and accessibility for all users.\n6. If provided, consider the user\'s context or suggested keywords.\n\nFor example:\n- Input: A high-quality image of a wooden dining table set in a modern kitchen.\n- Output: "Rustic wooden dining table with chairs in a stylish modern kitchen."\n\nNow generate the optimized alt text for the given image.' },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    console.log("Sending request to OpenAI...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || 'Unknown error occurred');
    }

    const assistantResponse = data.choices[0].message.content;
    console.log("Received response from OpenAI");

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-image function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
