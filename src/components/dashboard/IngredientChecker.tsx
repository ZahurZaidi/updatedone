import { useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import { Search, Loader2, Info, AlertTriangle, CheckCircle, Star } from "lucide-react"

interface IngredientAnalysis {
  benefits: string;
  safety_usage_limit: string;
  side_effects: string;
  suitable_skin_types: string;
  how_to_use: string;
  mechanism_of_action: string;
}

export default function IngredientChecker() {
  const [ingredient, setIngredient] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<IngredientAnalysis | null>(null)
  const [error, setError] = useState("")

  const popularIngredients = [
    "Hyaluronic Acid", "Niacinamide", "Retinol", "Vitamin C", "Salicylic Acid",
    "Glycolic Acid", "Ceramides", "Peptides", "Alpha Arbutin", "Azelaic Acid"
  ]

  const recentSearches = ["Hyaluronic Acid", "Niacinamide", "Retinol", "Vitamin C"]

  const analyzeIngredient = async () => {
    if (!ingredient.trim()) return;
    
    setIsAnalyzing(true);
    setError("");
    
    try {
      const GEMINI_API_KEY = 'AIzaSyACCwyZ7BJgtRydtUCe9P-tXaWI6qLFpFQ';
      
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

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response structure from API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('Raw API response:', responseText);
      
      // Try to extract JSON from the response
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const analysisData = JSON.parse(jsonMatch[0]);
          
          // Validate that all required fields are present
          const requiredFields = ['benefits', 'safety_usage_limit', 'side_effects', 'suitable_skin_types', 'how_to_use', 'mechanism_of_action'];
          const missingFields = requiredFields.filter(field => !analysisData[field]);
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }
          
          setAnalysis(analysisData);
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          throw new Error('Failed to parse API response as JSON');
        }
      } else {
        // Fallback: try to parse the text response manually
        console.log('No JSON found, attempting manual parsing...');
        
        const fallbackAnalysis: IngredientAnalysis = {
          benefits: extractSection(responseText, ['benefit', 'advantage', 'good']) || 'Benefits information not available in response',
          safety_usage_limit: extractSection(responseText, ['safety', 'limit', 'concentration', 'usage']) || 'Safety information not available in response',
          side_effects: extractSection(responseText, ['side effect', 'caution', 'warning', 'adverse']) || 'Side effects information not available in response',
          suitable_skin_types: extractSection(responseText, ['skin type', 'suitable', 'appropriate']) || 'Suitable for most skin types (verify with patch test)',
          how_to_use: extractSection(responseText, ['how to use', 'application', 'instruction', 'apply']) || 'Usage instructions not available in response',
          mechanism_of_action: extractSection(responseText, ['mechanism', 'how it works', 'action', 'function']) || 'Mechanism information not available in response'
        };
        
        setAnalysis(fallbackAnalysis);
      }
    } catch (err) {
      console.error('Error analyzing ingredient:', err);
      setError(`Failed to analyze ingredient: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractSection = (text: string, keywords: string[]): string => {
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
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ingredient Checker</h1>
          <p className="text-gray-600 mt-1">Analyze skincare ingredients for safety and effectiveness</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded inline-flex items-center">
            <Search className="w-3 h-3 mr-1" />
            AI-Powered Analysis
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Analyze Ingredient</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Ingredient Name
                  </label>
                  <div className="flex space-x-2">
                    <input
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Hyaluronic Acid, Niacinamide, Retinol..."
                      value={ingredient}
                      onChange={(e) => setIngredient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && analyzeIngredient()}
                    />
                    <Button
                      onClick={analyzeIngredient}
                      disabled={!ingredient.trim() || isAnalyzing}
                      className="bg-gradient-to-r from-teal-500 to-blue-600"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <Card className="border-0 shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Analysis Results for "{ingredient}"</h2>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <h3 className="font-medium text-green-800">Benefits</h3>
                      </div>
                      <p className="text-sm text-green-700">{analysis.benefits}</p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Info className="w-5 h-5 text-blue-500 mr-2" />
                        <h3 className="font-medium text-blue-800">How to Use</h3>
                      </div>
                      <p className="text-sm text-blue-700">{analysis.how_to_use}</p>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Info className="w-5 h-5 text-purple-500 mr-2" />
                        <h3 className="font-medium text-purple-800">Mechanism of Action</h3>
                      </div>
                      <p className="text-sm text-purple-700">{analysis.mechanism_of_action}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                        <h3 className="font-medium text-orange-800">Safety Usage Limit</h3>
                      </div>
                      <p className="text-sm text-orange-700">{analysis.safety_usage_limit}</p>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <h3 className="font-medium text-red-800">Side Effects</h3>
                      </div>
                      <p className="text-sm text-red-700">{analysis.side_effects}</p>
                    </div>

                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-teal-500 mr-2" />
                        <h3 className="font-medium text-teal-800">Suitable Skin Types</h3>
                      </div>
                      <p className="text-sm text-teal-700">{analysis.suitable_skin_types}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Ingredients */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Ingredients</h3>
              <div className="space-y-2">
                {popularIngredients.map((ing, index) => (
                  <button
                    key={index}
                    onClick={() => setIngredient(ing)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">{ing}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Searches */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setIngredient(search)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Safety Tips */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Safety Tips</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Always patch test new ingredients</p>
                <p>• Start with lower concentrations</p>
                <p>• Check for ingredient interactions</p>
                <p>• Consult a dermatologist for concerns</p>
                <p>• Read product labels carefully</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}