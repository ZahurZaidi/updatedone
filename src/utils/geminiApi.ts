import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBBJWvVK4k8F5K5Bd_oHTn5Yjp1pEsmeHs';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface IngredientAnalysis {
  benefits: string;
  safety_usage_limit: string;
  side_effects: string;
  suitable_skin_types: string;
  how_to_use: string;
  mechanism_of_action: string;
}

export interface RoutineStep {
  step: number;
  product_type: string;
  product_name: string;
  instructions: string;
  timing: string;
  benefits: string;
}

export interface RoutineResponse {
  morning_routine: RoutineStep[];
  evening_routine: RoutineStep[];
  general_tips: string;
  frequency_notes: string;
}

export async function analyzeIngredient(ingredient: string): Promise<IngredientAnalysis> {
  try {
    const prompt = `You are a skincare expert with extensive knowledge about cosmetic ingredients. Analyze the ingredient "${ingredient}" and provide detailed information.

Please respond with a JSON object containing exactly these fields:
{
  "benefits": "Detailed benefits of this ingredient for skin",
  "safety_usage_limit": "Safe usage limits and concentrations",
  "side_effects": "Potential side effects and precautions",
  "suitable_skin_types": "Which skin types can safely use this ingredient",
  "how_to_use": "Instructions on how to properly use this ingredient",
  "mechanism_of_action": "How this ingredient works on the skin"
}

Make sure to provide comprehensive, accurate information for each field. If the ingredient is not commonly used in skincare, mention that in the benefits section.`;

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }
    );

    if (!response.data.candidates || !response.data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure from API');
    }

    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const analysisData = JSON.parse(jsonMatch[0]);
        
        // Validate that all required fields are present
        const requiredFields = ['benefits', 'safety_usage_limit', 'side_effects', 'suitable_skin_types', 'how_to_use', 'mechanism_of_action'];
        const missingFields = requiredFields.filter(field => !analysisData[field]);
        
        if (missingFields.length > 0) {
          // Fill missing fields with default values
          missingFields.forEach(field => {
            analysisData[field] = 'Information not available in response';
          });
        }
        
        return analysisData;
      } catch (parseError) {
        throw new Error('Failed to parse API response as JSON');
      }
    } else {
      // Fallback analysis if JSON parsing fails
      return {
        benefits: extractSection(responseText, ['benefit', 'advantage', 'good']) || 'Benefits information not available',
        safety_usage_limit: extractSection(responseText, ['safety', 'limit', 'concentration']) || 'Safety information not available',
        side_effects: extractSection(responseText, ['side effect', 'caution', 'warning']) || 'Side effects information not available',
        suitable_skin_types: extractSection(responseText, ['skin type', 'suitable']) || 'Suitable for most skin types',
        how_to_use: extractSection(responseText, ['how to use', 'application']) || 'Usage instructions not available',
        mechanism_of_action: extractSection(responseText, ['mechanism', 'how it works']) || 'Mechanism information not available'
      };
    }
  } catch (error: any) {
    console.error('Error analyzing ingredient:', error);
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to analyze ingredient');
  }
}

export async function generateSkincareRoutine(skinType: string, skinConcerns: string[]): Promise<RoutineResponse> {
  try {
    const prompt = `You are a skincare expert. Create a detailed morning and evening skincare routine for someone with ${skinType} skin and the following concerns: ${skinConcerns.join(', ')}.

Please provide a comprehensive routine with specific product types, application instructions, timing, and benefits. Format your response as a JSON object with this exact structure:

{
  "morning_routine": [
    {
      "step": 1,
      "product_type": "Cleanser",
      "product_name": "Gentle Foaming Cleanser",
      "instructions": "Apply to damp skin, massage gently for 30 seconds, rinse with lukewarm water",
      "timing": "5-10 minutes",
      "benefits": "Removes overnight buildup without stripping skin"
    }
  ],
  "evening_routine": [
    {
      "step": 1,
      "product_type": "Oil Cleanser",
      "product_name": "Cleansing Oil",
      "instructions": "Apply to dry skin, massage for 1 minute, add water to emulsify, rinse",
      "timing": "2-3 minutes",
      "benefits": "Removes makeup and sunscreen effectively"
    }
  ],
  "general_tips": "General advice for this skin type and concerns",
  "frequency_notes": "How often to use certain products"
}

Provide 4-6 steps for morning routine and 5-7 steps for evening routine. Include specific timing and detailed instructions.`;

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }
    );

    if (!response.data.candidates || !response.data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure from API');
    }

    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const routineData = JSON.parse(jsonMatch[0]);
        
        // Validate the structure
        if (!routineData.morning_routine || !routineData.evening_routine) {
          throw new Error('Invalid routine structure in response');
        }
        
        // Ensure all required fields are present
        if (!routineData.general_tips) {
          routineData.general_tips = "Follow this routine consistently for best results. Always patch test new products.";
        }
        if (!routineData.frequency_notes) {
          routineData.frequency_notes = "Use active ingredients gradually and adjust frequency based on skin tolerance.";
        }
        
        return routineData;
      } catch (parseError) {
        throw new Error('Failed to parse routine data from API response');
      }
    } else {
      // Fallback routine if JSON parsing fails
      return createFallbackRoutine(skinType, skinConcerns);
    }
  } catch (error: any) {
    console.error('Error generating routine:', error);
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to generate routine');
  }
}

export async function generateSkinInsights(assessmentData: any): Promise<string> {
  try {
    const prompt = `Based on this skin assessment data, provide personalized insights and recommendations:

Skin Type: ${assessmentData.skin_type}
Hydration Level: ${assessmentData.hydration_level}
Assessment Answers: ${JSON.stringify(assessmentData.assessment_answers)}

Please provide:
1. A brief analysis of their skin condition
2. Key recommendations for their skin type
3. Lifestyle factors that might be affecting their skin
4. 3-4 specific actionable tips

Keep the response concise and friendly, around 150-200 words.`;

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      }
    );

    if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      return "Based on your assessment, we've identified your skin type and can provide personalized recommendations. Explore the features to get detailed analysis and routines tailored for you.";
    }
  } catch (error: any) {
    console.error('Error generating insights:', error);
    return "Based on your assessment, we've identified your skin type and can provide personalized recommendations. Explore the features to get detailed analysis and routines tailored for you.";
  }
}

// Helper function to extract sections from text
function extractSection(text: string, keywords: string[]): string {
  const lines = text.split('\n');
  
  for (const keyword of keywords) {
    const startIndex = lines.findIndex(line => 
      line.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (startIndex !== -1) {
      let content = '';
      for (let i = startIndex; i < Math.min(startIndex + 3, lines.length); i++) {
        const line = lines[i].trim();
        if (line && !line.includes(':') && !line.startsWith('-')) {
          content += line + ' ';
        }
      }
      if (content.trim()) return content.trim();
    }
  }
  
  // If no specific section found, return first few sentences
  const sentences = text.split('.').slice(0, 2);
  return sentences.join('.') + (sentences.length > 1 ? '.' : '');
}

// Helper function to create fallback routine
function createFallbackRoutine(skinType: string, skinConcerns: string[]): RoutineResponse {
  return {
    morning_routine: [
      {
        step: 1,
        product_type: "Cleanser",
        product_name: "Gentle Cleanser",
        instructions: "Apply to damp skin, massage gently, rinse with lukewarm water",
        timing: "1-2 minutes",
        benefits: "Removes overnight buildup"
      },
      {
        step: 2,
        product_type: "Moisturizer",
        product_name: "Lightweight Moisturizer",
        instructions: "Apply to clean, damp skin",
        timing: "1 minute",
        benefits: "Hydrates and protects skin"
      },
      {
        step: 3,
        product_type: "Sunscreen",
        product_name: "Broad Spectrum SPF 30+",
        instructions: "Apply generously to face and neck",
        timing: "1 minute",
        benefits: "Protects from UV damage"
      }
    ],
    evening_routine: [
      {
        step: 1,
        product_type: "Cleanser",
        product_name: "Gentle Cleanser",
        instructions: "Apply to damp skin, massage gently, rinse with lukewarm water",
        timing: "1-2 minutes",
        benefits: "Removes daily buildup"
      },
      {
        step: 2,
        product_type: "Treatment",
        product_name: "Targeted Treatment",
        instructions: "Apply to specific areas of concern",
        timing: "1 minute",
        benefits: "Addresses specific skin concerns"
      },
      {
        step: 3,
        product_type: "Moisturizer",
        product_name: "Night Moisturizer",
        instructions: "Apply to clean skin",
        timing: "1 minute",
        benefits: "Nourishes and repairs overnight"
      }
    ],
    general_tips: `For ${skinType} skin with ${skinConcerns.join(', ')}, consistency is key. Start slowly with new products and always use sunscreen during the day.`,
    frequency_notes: "Use active ingredients 2-3 times per week initially, then increase as tolerated."
  };
}