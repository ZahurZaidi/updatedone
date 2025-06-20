import { useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import { Sparkles, Loader2, Sun, Moon, Clock, Info } from "lucide-react"

interface RoutineStep {
  step: number;
  product_type: string;
  product_name: string;
  instructions: string;
  timing: string;
  benefits: string;
}

interface RoutineResponse {
  morning_routine: RoutineStep[];
  evening_routine: RoutineStep[];
  general_tips: string;
  frequency_notes: string;
}

export default function RoutineGenerator() {
  const [skinType, setSkinType] = useState("")
  const [skinConcerns, setSkinConcerns] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [routine, setRoutine] = useState<RoutineResponse | null>(null)
  const [error, setError] = useState("")

  const skinTypes = ["Oily", "Dry", "Combination", "Normal", "Sensitive"]
  const concerns = [
    "Acne", "Aging", "Dark Spots", "Dryness", "Oiliness", 
    "Sensitivity", "Large Pores", "Dullness", "Uneven Texture"
  ]

  const toggleConcern = (concern: string) => {
    setSkinConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  const generateRoutine = async () => {
    if (!skinType || skinConcerns.length === 0) return;
    
    setIsGenerating(true);
    setError("");
    
    try {
      const prompt = `You are a skincare expert. Create a detailed morning and evening skincare routine for someone with ${skinType} skin and the following concerns: ${skinConcerns.join(', ')}.

Please provide a comprehensive routine with specific product types, application instructions, timing, and benefits. Format your response as a JSON object with this structure:

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

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyACCwyZ7BJgtRydtUCe9P-tXaWI6qLFpFQ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const responseText = data.candidates[0].content.parts[0].text;
        
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const routineData = JSON.parse(jsonMatch[0]);
          setRoutine(routineData);
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('Error generating routine:', err);
      setError('Failed to generate routine. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Routine Generator</h1>
          <p className="text-gray-600 mt-1">Get a personalized skincare routine based on your skin type and concerns</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded inline-flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Generated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Section */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Skin Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Skin Type
                  </label>
                  <select
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select your skin type</option>
                    {skinTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Skin Concerns (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {concerns.map(concern => (
                      <label key={concern} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={skinConcerns.includes(concern)}
                          onChange={() => toggleConcern(concern)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{concern}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateRoutine}
                  disabled={!skinType || skinConcerns.length === 0 || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Routine
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Routine Display */}
        <div className="lg:col-span-2">
          {routine ? (
            <div className="space-y-6">
              {/* Morning Routine */}
              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Sun className="w-5 h-5 mr-2 text-orange-500" />
                    <h2 className="text-xl font-semibold">Morning Routine</h2>
                  </div>
                  <div className="space-y-4">
                    {routine.morning_routine.map((step, index) => (
                      <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-orange-800">
                            Step {step.step}: {step.product_type}
                          </h3>
                          <div className="flex items-center text-xs text-orange-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.timing}
                          </div>
                        </div>
                        <p className="text-sm text-orange-700 mb-2">
                          <strong>Product:</strong> {step.product_name}
                        </p>
                        <p className="text-sm text-orange-700 mb-2">
                          <strong>Instructions:</strong> {step.instructions}
                        </p>
                        <p className="text-sm text-orange-600">
                          <strong>Benefits:</strong> {step.benefits}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Evening Routine */}
              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Moon className="w-5 h-5 mr-2 text-indigo-500" />
                    <h2 className="text-xl font-semibold">Evening Routine</h2>
                  </div>
                  <div className="space-y-4">
                    {routine.evening_routine.map((step, index) => (
                      <div key={index} className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-indigo-800">
                            Step {step.step}: {step.product_type}
                          </h3>
                          <div className="flex items-center text-xs text-indigo-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.timing}
                          </div>
                        </div>
                        <p className="text-sm text-indigo-700 mb-2">
                          <strong>Product:</strong> {step.product_name}
                        </p>
                        <p className="text-sm text-indigo-700 mb-2">
                          <strong>Instructions:</strong> {step.instructions}
                        </p>
                        <p className="text-sm text-indigo-600">
                          <strong>Benefits:</strong> {step.benefits}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Tips and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Info className="w-5 h-5 mr-2 text-blue-500" />
                      <h3 className="font-semibold text-blue-800">General Tips</h3>
                    </div>
                    <p className="text-sm text-blue-700">{routine.general_tips}</p>
                  </div>
                </Card>

                <Card className="border-0 shadow-md">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Clock className="w-5 h-5 mr-2 text-green-500" />
                      <h3 className="font-semibold text-green-800">Frequency Notes</h3>
                    </div>
                    <p className="text-sm text-green-700">{routine.frequency_notes}</p>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="border-0 shadow-md">
              <div className="p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Generate Your Routine
                </h3>
                <p className="text-gray-600">
                  Select your skin type and concerns to get a personalized skincare routine
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}