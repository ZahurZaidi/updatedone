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
  rating: number;
  category: string;
}

export interface RoutineStep {
  step: number;
  product_type: string;
  product_name: string;
  instructions: string;
  timing: string;
  benefits: string;
  optional?: boolean;
}

export interface RoutineResponse {
  morning_routine: RoutineStep[];
  evening_routine: RoutineStep[];
  general_tips: string;
  frequency_notes: string;
  weekly_schedule: string;
  product_recommendations: string;
}

export async function analyzeIngredient(ingredient: string): Promise<IngredientAnalysis> {
  try {
    const prompt = `You are a certified dermatologist and cosmetic chemist with 15+ years of experience. Analyze the skincare ingredient "${ingredient}" comprehensively.

Provide a detailed, professional analysis in JSON format with these exact fields:

{
  "benefits": "Comprehensive list of proven benefits with scientific backing. Include specific skin improvements and research findings.",
  "safety_usage_limit": "Detailed safe usage guidelines including concentration percentages, frequency of use, and any regulatory limits. Be specific about daily/weekly limits.",
  "side_effects": "Complete list of potential side effects, contraindications, and warning signs. Include both common and rare reactions.",
  "suitable_skin_types": "Detailed breakdown of which skin types benefit most, which should use with caution, and any skin types that should avoid completely.",
  "how_to_use": "Step-by-step application instructions including timing (AM/PM), layering order with other ingredients, and best practices for maximum efficacy.",
  "mechanism_of_action": "Scientific explanation of how this ingredient works at the cellular level, including molecular pathways and biological processes.",
  "rating": 8,
  "category": "Active Ingredient/Moisturizing Agent/Exfoliant/Antioxidant/etc"
}

Rating scale: 1-10 (1=avoid, 5=neutral, 10=excellent)
Category options: Active Ingredient, Moisturizing Agent, Exfoliant, Antioxidant, Anti-aging, Acne Treatment, Brightening Agent, Soothing Agent, Preservative, Emulsifier, Other

Make each section detailed and informative (3-5 sentences minimum). Include specific percentages, timeframes, and scientific terminology where appropriate.`;

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
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
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
        
        // Validate and set defaults for required fields
        const defaultAnalysis = {
          benefits: 'This ingredient offers various skincare benefits. Further research may be needed for complete understanding.',
          safety_usage_limit: 'Use as directed on product labels. Start with lower concentrations and patch test before full application.',
          side_effects: 'Potential for skin irritation in sensitive individuals. Discontinue use if adverse reactions occur.',
          suitable_skin_types: 'Generally suitable for most skin types, but individual reactions may vary.',
          how_to_use: 'Apply as directed in product instructions. Consider consulting with a dermatologist for personalized advice.',
          mechanism_of_action: 'Works through various pathways to improve skin health and appearance.',
          rating: 6,
          category: 'Skincare Ingredient'
        };

        // Merge with defaults to ensure all fields are present
        const result = { ...defaultAnalysis, ...analysisData };
        
        // Ensure rating is a number between 1-10
        if (typeof result.rating !== 'number' || result.rating < 1 || result.rating > 10) {
          result.rating = 6;
        }
        
        return result;
      } catch (parseError) {
        throw new Error('Failed to parse API response as JSON');
      }
    } else {
      // Enhanced fallback analysis
      return {
        benefits: extractDetailedSection(responseText, ['benefit', 'advantage', 'good', 'improve']) || 'This ingredient provides various skincare benefits including potential improvements in skin texture, hydration, and overall appearance.',
        safety_usage_limit: extractDetailedSection(responseText, ['safety', 'limit', 'concentration', 'dosage']) || 'Use as directed on product packaging. Start with lower concentrations (0.5-1%) and gradually increase. Limit to once daily initially.',
        side_effects: extractDetailedSection(responseText, ['side effect', 'caution', 'warning', 'irritation']) || 'May cause mild irritation, redness, or sensitivity in some individuals. Patch test recommended before first use.',
        suitable_skin_types: extractDetailedSection(responseText, ['skin type', 'suitable', 'recommended']) || 'Generally suitable for normal to oily skin types. Sensitive skin should use with caution.',
        how_to_use: extractDetailedSection(responseText, ['how to use', 'application', 'apply']) || 'Apply to clean, dry skin. Use in evening routine. Follow with moisturizer and always use SPF during the day.',
        mechanism_of_action: extractDetailedSection(responseText, ['mechanism', 'how it works', 'action']) || 'Works at the cellular level to promote skin renewal and improve various skin functions.',
        rating: 6,
        category: 'Skincare Ingredient'
      };
    }
  } catch (error: any) {
    console.error('Error analyzing ingredient:', error);
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to analyze ingredient');
  }
}

export async function generateSkincareRoutine(
  skinType: string, 
  skinConcerns: string[], 
  routineComplexity: '2-step' | '3-4-step' | 'more-than-4-step' = '3-4-step'
): Promise<RoutineResponse> {
  try {
    const stepGuidelines = {
      '2-step': 'Create a minimal 2-step routine (cleanser + moisturizer/SPF)',
      '3-4-step': 'Create a balanced 3-4 step routine with essential products',
      'more-than-4-step': 'Create a comprehensive 5-7 step routine with targeted treatments'
    };

    const prompt = `You are a board-certified dermatologist with expertise in personalized skincare. Create a detailed, professional skincare routine for:

**Patient Profile:**
- Skin Type: ${skinType}
- Primary Concerns: ${skinConcerns.join(', ')}
- Routine Complexity: ${routineComplexity} (${stepGuidelines[routineComplexity]})

**Requirements:**
${stepGuidelines[routineComplexity]}

Provide a comprehensive response in JSON format:

{
  "morning_routine": [
    {
      "step": 1,
      "product_type": "Gentle Cleanser",
      "product_name": "Specific product recommendation with key ingredients",
      "instructions": "Detailed application technique with timing and pressure",
      "timing": "30-60 seconds",
      "benefits": "Specific benefits for this skin type and concerns",
      "optional": false
    }
  ],
  "evening_routine": [
    {
      "step": 1,
      "product_type": "Double Cleanse - Oil Cleanser",
      "product_name": "Specific recommendation with active ingredients",
      "instructions": "Detailed step-by-step application method",
      "timing": "1-2 minutes",
      "benefits": "Targeted benefits for skin concerns",
      "optional": false
    }
  ],
  "general_tips": "Professional advice on routine implementation, timing, and lifestyle factors that affect skin health",
  "frequency_notes": "Detailed schedule for active ingredients, including how to introduce new products safely",
  "weekly_schedule": "Day-by-day breakdown of when to use specific products or treatments",
  "product_recommendations": "Specific ingredient recommendations and product types to look for, including concentration guidelines"
}

**Important Guidelines:**
- For 2-step: Focus on cleanser + moisturizer/SPF combo
- For 3-4-step: Add serum/treatment + separate SPF
- For 5+ step: Include toner, multiple serums, eye cream, treatments
- Always include SPF in morning routine
- Provide specific ingredient percentages where relevant
- Include product introduction timeline for sensitive skin
- Address each listed skin concern specifically
- Make recommendations evidence-based and practical`;

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
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3000,
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
        
        // Ensure all required fields are present with enhanced defaults
        const defaults = {
          general_tips: `For ${skinType} skin with ${skinConcerns.join(', ')}, consistency is crucial. Introduce new products gradually, one at a time, and always patch test. Maintain this routine for 6-8 weeks to see significant results.`,
          frequency_notes: "Start with active ingredients 2-3 times per week, gradually increasing to daily use as tolerated. Always use SPF 30+ during the day when using active ingredients.",
          weekly_schedule: "Week 1-2: Establish basic routine. Week 3-4: Introduce active ingredients slowly. Week 5+: Full routine with monitoring for any reactions.",
          product_recommendations: "Look for products with clinically proven ingredients. Avoid products with excessive fragrance or alcohol. Consider professional consultation for persistent concerns."
        };

        const result = { ...defaults, ...routineData };
        
        // Ensure optional field exists on all steps
        result.morning_routine = result.morning_routine.map((step: any) => ({
          ...step,
          optional: step.optional || false
        }));
        
        result.evening_routine = result.evening_routine.map((step: any) => ({
          ...step,
          optional: step.optional || false
        }));
        
        return result;
      } catch (parseError) {
        throw new Error('Failed to parse routine data from API response');
      }
    } else {
      // Enhanced fallback routine
      return createEnhancedFallbackRoutine(skinType, skinConcerns, routineComplexity);
    }
  } catch (error: any) {
    console.error('Error generating routine:', error);
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to generate routine');
  }
}

export async function generateSkinInsights(assessmentData: any): Promise<string> {
  try {
    const prompt = `As a dermatologist, provide personalized insights based on this comprehensive skin assessment:

**Assessment Results:**
- Skin Type: ${assessmentData.skin_type}
- Hydration Level: ${assessmentData.hydration_level}
- Detailed Responses: ${JSON.stringify(assessmentData.assessment_answers)}

**Provide a professional analysis covering:**
1. **Skin Analysis**: Current condition and key characteristics
2. **Priority Concerns**: Most important issues to address first
3. **Lifestyle Impact**: How daily habits affect their skin
4. **Action Plan**: 4-5 specific, actionable recommendations
5. **Timeline**: Expected improvement timeline with consistent care

Keep the tone professional yet approachable, around 200-250 words. Focus on evidence-based recommendations and realistic expectations.`;

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
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      }
    );

    if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      return `Based on your ${assessmentData.skin_type} skin type with ${assessmentData.hydration_level} hydration levels, here are key insights: Your skin shows specific characteristics that require targeted care. Focus on maintaining your skin barrier, using appropriate cleansing methods, and incorporating products that address your primary concerns. Consistency with a personalized routine will show improvements within 4-6 weeks. Consider professional consultation for optimal results.`;
    }
  } catch (error: any) {
    console.error('Error generating insights:', error);
    return `Based on your ${assessmentData.skin_type} skin type with ${assessmentData.hydration_level} hydration levels, we recommend focusing on gentle, consistent care with products suited to your specific needs. Regular assessment and routine adjustments will help achieve your skincare goals.`;
  }
}

// Enhanced helper function to extract detailed sections from text
function extractDetailedSection(text: string, keywords: string[]): string {
  const lines = text.split('\n');
  
  for (const keyword of keywords) {
    const startIndex = lines.findIndex(line => 
      line.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (startIndex !== -1) {
      let content = '';
      // Get more context - up to 5 lines
      for (let i = startIndex; i < Math.min(startIndex + 5, lines.length); i++) {
        const line = lines[i].trim();
        if (line && line.length > 10) { // Only include substantial content
          content += line + ' ';
        }
      }
      if (content.trim().length > 50) return content.trim();
    }
  }
  
  // If no specific section found, return first substantial paragraph
  const sentences = text.split('.').filter(s => s.trim().length > 20).slice(0, 3);
  return sentences.join('.') + (sentences.length > 0 ? '.' : '');
}

// Enhanced helper function to create fallback routine
function createEnhancedFallbackRoutine(
  skinType: string, 
  skinConcerns: string[], 
  complexity: '2-step' | '3-4-step' | 'more-than-4-step'
): RoutineResponse {
  const baseRoutines = {
    '2-step': {
      morning: [
        {
          step: 1,
          product_type: "Gentle Cleanser",
          product_name: "Mild, pH-balanced cleanser with ceramides",
          instructions: "Apply to damp skin, massage gently for 30 seconds, rinse with lukewarm water",
          timing: "30-60 seconds",
          benefits: "Removes overnight buildup without stripping natural oils",
          optional: false
        },
        {
          step: 2,
          product_type: "Moisturizer with SPF",
          product_name: "Broad-spectrum SPF 30+ moisturizer",
          instructions: "Apply generously to face and neck, reapply every 2 hours",
          timing: "1 minute",
          benefits: "Hydrates skin and provides essential UV protection",
          optional: false
        }
      ],
      evening: [
        {
          step: 1,
          product_type: "Gentle Cleanser",
          product_name: "Same as morning cleanser",
          instructions: "Double cleanse if wearing makeup or sunscreen",
          timing: "1-2 minutes",
          benefits: "Removes daily buildup and prepares skin for treatment",
          optional: false
        },
        {
          step: 2,
          product_type: "Night Moisturizer",
          product_name: "Rich moisturizer with hyaluronic acid",
          instructions: "Apply to slightly damp skin for better absorption",
          timing: "1 minute",
          benefits: "Repairs and hydrates skin overnight",
          optional: false
        }
      ]
    },
    '3-4-step': {
      morning: [
        {
          step: 1,
          product_type: "Gentle Cleanser",
          product_name: "pH-balanced gel or cream cleanser",
          instructions: "Apply to damp skin, massage gently, rinse thoroughly",
          timing: "1 minute",
          benefits: "Prepares skin for active ingredients",
          optional: false
        },
        {
          step: 2,
          product_type: "Vitamin C Serum",
          product_name: "10-15% L-Ascorbic Acid or Magnesium Ascorbyl Phosphate",
          instructions: "Apply 2-3 drops to clean skin, pat gently",
          timing: "30 seconds",
          benefits: "Antioxidant protection and brightening",
          optional: false
        },
        {
          step: 3,
          product_type: "Moisturizer",
          product_name: "Lightweight, non-comedogenic moisturizer",
          instructions: "Apply evenly, allow to absorb",
          timing: "1 minute",
          benefits: "Maintains hydration and skin barrier",
          optional: false
        },
        {
          step: 4,
          product_type: "Sunscreen",
          product_name: "Broad-spectrum SPF 30+ (zinc oxide or titanium dioxide)",
          instructions: "Apply 1/4 teaspoon for face, reapply every 2 hours",
          timing: "1 minute",
          benefits: "Essential UV protection",
          optional: false
        }
      ],
      evening: [
        {
          step: 1,
          product_type: "Oil Cleanser",
          product_name: "Gentle cleansing oil or balm",
          instructions: "Massage into dry skin, add water to emulsify, rinse",
          timing: "1-2 minutes",
          benefits: "Removes makeup and sunscreen effectively",
          optional: true
        },
        {
          step: 2,
          product_type: "Water-based Cleanser",
          product_name: "Gentle foaming or gel cleanser",
          instructions: "Follow oil cleanser or use alone if no makeup",
          timing: "1 minute",
          benefits: "Deep cleans pores and removes remaining impurities",
          optional: false
        },
        {
          step: 3,
          product_type: "Treatment Serum",
          product_name: "Retinol 0.25-0.5% or Niacinamide 5-10%",
          instructions: "Start 2-3 times per week, gradually increase",
          timing: "30 seconds",
          benefits: "Addresses specific skin concerns",
          optional: false
        },
        {
          step: 4,
          product_type: "Night Moisturizer",
          product_name: "Rich moisturizer with peptides or ceramides",
          instructions: "Apply generously, focus on dry areas",
          timing: "1 minute",
          benefits: "Overnight repair and hydration",
          optional: false
        }
      ]
    }
  };

  // For more-than-4-step, extend the 3-4-step routine
  if (complexity === 'more-than-4-step') {
    const extendedRoutine = JSON.parse(JSON.stringify(baseRoutines['3-4-step']));
    
    // Add toner after cleansing
    extendedRoutine.morning.splice(1, 0, {
      step: 2,
      product_type: "Hydrating Toner",
      product_name: "Alcohol-free toner with hyaluronic acid",
      instructions: "Apply with cotton pad or pat into skin with hands",
      timing: "30 seconds",
      benefits: "Balances pH and adds hydration layer",
      optional: true
    });

    extendedRoutine.evening.splice(2, 0, {
      step: 3,
      product_type: "Hydrating Toner",
      product_name: "Same as morning toner",
      instructions: "Apply after cleansing, before treatments",
      timing: "30 seconds",
      benefits: "Prepares skin for better product absorption",
      optional: true
    });

    // Add eye cream
    extendedRoutine.evening.push({
      step: 6,
      product_type: "Eye Cream",
      product_name: "Gentle eye cream with peptides or caffeine",
      instructions: "Gently pat around eye area with ring finger",
      timing: "30 seconds",
      benefits: "Addresses fine lines and dark circles",
      optional: true
    });

    // Renumber steps
    extendedRoutine.morning.forEach((step: any, index: number) => {
      step.step = index + 1;
    });
    extendedRoutine.evening.forEach((step: any, index: number) => {
      step.step = index + 1;
    });

    return {
      morning_routine: extendedRoutine.morning,
      evening_routine: extendedRoutine.evening,
      general_tips: `This comprehensive routine for ${skinType} skin addresses ${skinConcerns.join(', ')}. Start slowly and introduce one new product per week. Listen to your skin and adjust frequency as needed.`,
      frequency_notes: "Begin with every other day for active ingredients. Gradually increase to daily use as tolerated. Always patch test new products.",
      weekly_schedule: "Week 1: Basic routine only. Week 2: Add morning vitamin C. Week 3: Add evening treatment. Week 4+: Full routine with monitoring.",
      product_recommendations: "Focus on gentle, fragrance-free formulations. Look for clinically proven ingredients and avoid over-exfoliation."
    };
  }

  const selectedRoutine = baseRoutines[complexity] || baseRoutines['3-4-step'];

  return {
    morning_routine: selectedRoutine.morning,
    evening_routine: selectedRoutine.evening,
    general_tips: `This ${complexity} routine is designed for ${skinType} skin with concerns about ${skinConcerns.join(', ')}. Consistency is key - stick to the routine for at least 6-8 weeks to see results.`,
    frequency_notes: "Start with every other day for active ingredients like retinol or acids. Gradually increase frequency as your skin builds tolerance.",
    weekly_schedule: "Week 1-2: Establish basic routine. Week 3-4: Introduce active ingredients slowly. Week 5+: Full routine with regular assessment.",
    product_recommendations: "Choose products appropriate for your skin type. Look for non-comedogenic formulations and avoid harsh fragrances or alcohol."
  };
}