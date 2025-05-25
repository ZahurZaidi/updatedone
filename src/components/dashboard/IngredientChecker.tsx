"use client"

import { useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import { Search, Scan, CheckCircle, AlertTriangle, XCircle, Info, Camera, Upload, Star, ThumbsUp, ThumbsDown } from "lucide-react"

export default function IngredientChecker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ingredientsList, setIngredientsList] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResults, setHasResults] = useState(false)

  const analysisResults = {
    overall: "Good",
    safeCount: 8,
    cautionCount: 2,
    harmfulCount: 1,
    ingredients: [
      {
        name: "Hyaluronic Acid",
        status: "safe",
        function: "Hydrating agent",
        rating: 5,
        description: "Excellent for all skin types, provides deep hydration",
        suitability: "Perfect for your dry skin type",
      },
      {
        name: "Niacinamide",
        status: "safe",
        function: "Vitamin B3, anti-inflammatory",
        rating: 5,
        description: "Reduces redness and controls oil production",
        suitability: "Great for acne-prone areas",
      },
      {
        name: "Retinol",
        status: "caution",
        function: "Anti-aging, cell turnover",
        rating: 4,
        description: "Powerful anti-aging ingredient, start slowly",
        suitability: "Use with caution, may cause irritation initially",
      },
      {
        name: "Glycolic Acid",
        status: "caution",
        function: "Chemical exfoliant",
        rating: 3,
        description: "Strong exfoliant, can cause sensitivity",
        suitability: "Not recommended for sensitive skin",
      },
      {
        name: "Fragrance",
        status: "harmful",
        function: "Scent enhancer",
        rating: 1,
        description: "Can cause allergic reactions and irritation",
        suitability: "Avoid - you have sensitive skin",
      },
    ],
  }

  const popularIngredients = [
    { name: "Vitamin C", searches: 1250, trend: "up" },
    { name: "Salicylic Acid", searches: 980, trend: "up" },
    { name: "Ceramides", searches: 750, trend: "stable" },
    { name: "Peptides", searches: 620, trend: "up" },
    { name: "Alpha Arbutin", searches: 450, trend: "up" },
  ]

  const recentSearches = ["Hyaluronic Acid", "Niacinamide", "Retinol", "Vitamin C Serum", "Salicylic Acid"]

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setHasResults(true)
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "caution":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "harmful":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-50 border-green-200 text-green-800"
      case "caution":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "harmful":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

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
            Database Updated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Analyze Ingredients</h2>
              <p className="text-gray-600 mb-4">Enter ingredients manually, scan a product, or upload an image</p>
              {/* Manual Entry */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Product Name (Optional)</label>
                  <input className="w-full border rounded px-3 py-2" placeholder="e.g., CeraVe Hydrating Cleanser" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Ingredients List</label>
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter ingredients separated by commas (e.g., Water, Glycerin, Hyaluronic Acid, Niacinamide...)"
                    value={ingredientsList}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIngredientsList(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600"
                  disabled={isAnalyzing || !ingredientsList.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Ingredients"}
                </Button>
              </div>
              {/* Scan Product */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-6">
                <Scan className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Scan Product Barcode</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use your camera to scan the product barcode for instant analysis
                </p>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </Button>
              </div>
              {/* Upload Ingredient List */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-6">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Upload Ingredient List</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a photo of the ingredient list for automatic text recognition
                </p>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          </Card>

          {/* Analysis Results */}
          {hasResults && (
            <Card className="border-0 shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Analysis Results</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(analysisResults.overall.toLowerCase())}`}>
                    {analysisResults.overall} Match
                  </span>
                </div>
                <div className="text-gray-600 mb-2">Based on your skin type: Combination, Sensitive</div>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{analysisResults.safeCount}</p>
                    <p className="text-sm text-gray-600">Safe</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{analysisResults.cautionCount}</p>
                    <p className="text-sm text-gray-600">Caution</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{analysisResults.harmfulCount}</p>
                    <p className="text-sm text-gray-600">Avoid</p>
                  </div>
                </div>
                {/* Detailed Results */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Ingredient Analysis</h3>
                  {analysisResults.ingredients.map((ingredient, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getStatusColor(ingredient.status)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(ingredient.status)}
                          <h4 className="font-medium">{ingredient.name}</h4>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < ingredient.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ingredient.function}</p>
                      <p className="text-sm mb-2">{ingredient.description}</p>
                      <p className="text-sm font-medium">{ingredient.suitability}</p>
                    </div>
                  ))}
                </div>
                {/* Recommendations */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
                  <Info className="h-4 w-4 inline mr-2" />
                  <strong>Recommendation:</strong> This product is generally suitable for your skin type, but be
                  cautious with retinol and glycolic acid. Consider patch testing before full use.
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Search */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Quick Search</h3>
              <p className="text-gray-600 mb-4">Search for specific ingredients</p>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  className="w-full border rounded px-3 py-2 pl-10"
                  placeholder="Search ingredients..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded border border-teal-200 bg-teal-50 text-teal-700 cursor-pointer hover:bg-teal-100"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Popular Ingredients */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Trending Ingredients</h3>
              <p className="text-gray-600 mb-4">Most searched ingredients this week</p>
              <div className="space-y-3">
                {popularIngredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ingredient.name}</p>
                      <p className="text-xs text-gray-500">{ingredient.searches} searches</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {ingredient.trend === "up" ? (
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ThumbsDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Safety Tips */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Safety Tips</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Always patch test new products</p>
                <p>• Introduce actives gradually</p>
                <p>• Check for allergens in your profile</p>
                <p>• Consult a dermatologist for concerns</p>
                <p>• Read full ingredient lists carefully</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
