// app/api/v1/ai/explain/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { soil, weather, market, crops, prompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Check if user is asking for detailed explanation
    const isDetailedRequest = prompt && (
      prompt.toLowerCase().includes('explain') ||
      prompt.toLowerCase().includes('why') ||
      prompt.toLowerCase().includes('how') ||
      prompt.toLowerCase().includes('detail') ||
      prompt.toLowerCase().includes('science') ||
      prompt.toLowerCase().includes('deeper') ||
      prompt.toLowerCase().includes('more info')
    );

    const systemPrompt = `You are an AI farming assistant helping Indian farmers understand crop recommendations. You have access to:

**Soil Data:** ${JSON.stringify(soil, null, 2)}
**Weather Conditions:** ${JSON.stringify(weather, null, 2)}  
**Market Prices:** ${JSON.stringify(market, null, 2)}
**Recommended Crops:** ${JSON.stringify(crops, null, 2)}

CONTEXT:
- All monetary values are in Indian Rupees (INR), not USD
- Revenue figures represent expected income per crop cycle/season
- Weather data follows Indian seasonal patterns (monsoon, winter, summer)
- Market conditions reflect Indian agricultural markets and demand

STRICT INSTRUCTIONS:
- Give SPECIFIC, ACTIONABLE recommendations - never say "you know your farm best"
- Provide DEFINITIVE advice based on the data provided
- Use confident language: "I recommend", "This crop will perform well", "Based on your conditions"
- Avoid vague statements like "it depends on you" or "choose what works for you"
- Be helpful and informative, not deferential
- Use simple language but be decisive and specific
- Focus on concrete benefits and clear reasoning`;

    let userPrompt;

    if (!prompt) {
      // Default simple explanation when no specific question is asked
      userPrompt = `Please explain in specific terms why these crops were recommended for this farmer's land. 

Be DEFINITIVE and SPECIFIC in your recommendations. Structure your response like this:
1. Start with a clear statement: "Based on your soil and weather conditions, I recommend these crops:"
2. For each crop, give SPECIFIC reasons why it will work well (soil pH match, ideal rainfall, strong market demand)
3. Mention expected revenue in INR and why it's profitable
4. End with a clear action plan: "Start with [specific crop] this season because [specific reason]"

DO NOT say:
- "You know your farm best"
- "It depends on your preference" 
- "Choose what works for you"
- Any vague or deferential language

DO say:
- "I recommend [crop] because [specific reason]"
- "This crop will give you [specific benefit]"
- "Based on your conditions, [crop] is the best choice"

Keep it under 3 paragraphs but be decisive and helpful.`;

    } else if (isDetailedRequest) {
      // Detailed explanation when farmer asks for more info
      userPrompt = `The farmer is asking: "${prompt}"

Since they're asking for more details, provide a thorough explanation with scientific backing. Include:
- Specific soil properties and how they benefit each crop
- Weather patterns and their agricultural impact  
- Indian market analysis and INR price trends
- Crop rotation benefits and soil health impacts
- Specific agricultural techniques for Indian farming conditions

Use technical terms but explain them clearly. Be thorough AND decisive - give specific recommendations, not general advice. 

NEVER defer to "you know best" - instead provide expert guidance based on the data.`;

    } else {
      // Regular follow-up questions
      userPrompt = `The farmer is asking: "${prompt}"

Answer their question based on the soil, weather, market, and crop data provided. Your response should be:
- Specific and actionable (not vague advice)
- Focused on Indian farming conditions and INR economics
- Decisive - give clear recommendations based on the data
- Practical - something the farmer can immediately act on

Provide EXPERT GUIDANCE, not general suggestions. Use phrases like:
- "Based on your data, I recommend..."
- "This approach will work because..."
- "The best strategy for your farm is..."

AVOID saying farmers should make their own decisions - that's why they're asking you!`;
    }

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error("Explain API error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation. Please try again." },
      { status: 500 }
    );
  }
}
