import { useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import { Camera, Upload, Scan, AlertTriangle, CheckCircle, Info, Lightbulb, TrendingUp, Eye } from "lucide-react"

export default function FacialAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalysis, setHasAnalysis] = useState(true) // Set to true to show results

  const analysisResults = {
    overallScore: 78,
    issues: [
      {
        type: "Acne",
        severity: "Mild",
        confidence: 92,
        areas: ["Forehead", "Chin"],
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      {
        type: "Dryness",
        severity: "Moderate",
        confidence: 87,
        areas: ["Cheeks"],
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      {
        type: "Dark Spots",
        severity: "Mild",
        confidence: 78,
        areas: ["Left cheek"],
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
    ],
    improvements: [
      "Skin texture has improved significantly",
      "Reduced inflammation compared to last scan",
      "Better hydration levels detected",
    ],
    recommendations: [
      {
        title: "Gentle Exfoliation",
        description: "Use a mild exfoliant 2-3 times per week to improve texture",
        priority: "High",
      },
      {
        title: "Hydrating Serum",
        description: "Add a hyaluronic acid serum to combat dryness",
        priority: "Medium",
      },
      {
        title: "Spot Treatment",
        description: "Consider targeted treatment for dark spots",
        priority: "Low",
      },
    ],
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalysis(true)
    }, 3000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facial Analysis</h1>
          <p className="text-gray-600 mt-1">AI-powered skin condition analysis</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded inline-flex items-center">
            <Scan className="w-3 h-3 mr-1" />
            AI Analysis Ready
          </span>
        </div>
      </div>

      {!hasAnalysis ? (
        /* Upload Section */
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold mb-2">Upload Your Photo</h2>
              <p className="text-gray-600 mb-4">Take or upload a clear photo of your face for AI analysis</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Analysis</h3>
                <p className="text-gray-600 mb-6">
                  For best results, ensure good lighting and face the camera directly
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button className="bg-gradient-to-r from-teal-500 to-blue-600">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
                <Info className="h-4 w-4 inline mr-2" />
                <strong>Tips for best results:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Use natural lighting when possible</li>
                  <li>• Remove makeup for accurate analysis</li>
                  <li>• Face the camera directly</li>
                  <li>• Ensure your entire face is visible</li>
                </ul>
              </div>
              {isAnalyzing && (
                <div className="text-center space-y-4 mt-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="text-gray-600">Analyzing your skin... This may take a few moments.</p>
                </div>
              )}
              <Button
                onClick={handleAnalyze}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 mt-6"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Start Analysis"}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Overall Skin Health</h2>
                  <p className="text-gray-600">Based on AI analysis of your uploaded photo</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{analysisResults.overallScore}%</div>
                  <p className="text-sm text-gray-500">Health Score</p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded mt-4 mb-2">
                <div className="h-3 bg-green-500 rounded" style={{ width: `${analysisResults.overallScore}%` }}></div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analysis Image */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-lg font-semibold">Analyzed Image</span>
                  </div>
                  <img
                    src="/placeholder.svg"
                    alt="Analyzed face"
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <div className="text-center space-y-2 mt-4">
                    <p className="text-sm text-gray-600">Analysis completed</p>
                    <p className="text-xs text-gray-500">Scanned: {new Date().toLocaleDateString()}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Analyze New Photo
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Issues Detected */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                    <span className="text-lg font-semibold">Issues Detected</span>
                  </div>
                  <div className="text-gray-600 mb-2">Areas that need attention</div>
                  <div className="space-y-4">
                    {analysisResults.issues.map((issue, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${issue.bgColor} ${issue.borderColor}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-medium ${issue.color}`}>{issue.type}</h3>
                          <span className={`px-2 py-1 rounded border ${issue.color} border-current text-xs`}>{issue.severity}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Confidence</span>
                            <span className="font-medium">{issue.confidence}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-blue-400 rounded" style={{ width: `${issue.confidence}%` }}></div>
                          </div>
                          <p className="text-sm text-gray-600">
                            <strong>Affected areas:</strong> {issue.areas.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Improvements */}
              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-lg font-semibold">Improvements Detected</span>
                  </div>
                  <div className="text-gray-600 mb-2">Positive changes since your last analysis</div>
                  <div className="space-y-3">
                    {analysisResults.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Recommendations */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                <span className="text-lg font-semibold">Personalized Recommendations</span>
              </div>
              <div className="text-gray-600 mb-2">Suggested actions based on your analysis</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisResults.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${rec.priority === "High" ? "bg-red-100 text-red-800" : rec.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Analysis History */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                <span className="text-lg font-semibold">Analysis History</span>
              </div>
              <div className="text-gray-600 mb-2">Track your skin health over time</div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">5</p>
                    <p className="text-sm text-gray-600">Total Scans</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">+18%</p>
                    <p className="text-sm text-gray-600">Improvement</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">3</p>
                    <p className="text-sm text-gray-600">Issues Resolved</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline">View Full History</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
