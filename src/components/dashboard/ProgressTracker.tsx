import { useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import { Upload, Camera, TrendingUp, Download, Share } from "lucide-react"

export default function ProgressTracker() {
  const [selectedComparison, setSelectedComparison] = useState("week")

  const progressData = [
    { date: "Week 1", acne: 85, hydration: 45, overall: 60 },
    { date: "Week 2", acne: 78, hydration: 52, overall: 65 },
    { date: "Week 3", acne: 70, hydration: 58, overall: 70 },
    { date: "Week 4", acne: 65, hydration: 65, overall: 75 },
    { date: "Week 5", acne: 58, hydration: 70, overall: 78 },
  ]

  const photoTimeline = [
    {
      date: "2024-01-01",
      week: "Week 1",
      image: "/placeholder.svg",
      issues: ["Moderate acne", "Dry patches", "Uneven tone"],
      score: 60,
    },
    {
      date: "2024-01-08",
      week: "Week 2",
      image: "/placeholder.svg",
      issues: ["Mild acne", "Dry patches", "Slight redness"],
      score: 65,
    },
    {
      date: "2024-01-15",
      week: "Week 3",
      image: "/placeholder.svg",
      issues: ["Mild acne", "Improved hydration", "Even tone"],
      score: 70,
    },
    {
      date: "2024-01-22",
      week: "Week 4",
      image: "/placeholder.svg",
      issues: ["Minor breakouts", "Good hydration", "Clear complexion"],
      score: 75,
    },
    {
      date: "2024-01-29",
      week: "Week 5",
      image: "/placeholder.svg",
      issues: ["Clear skin", "Excellent hydration", "Healthy glow"],
      score: 78,
    },
  ]

  const improvements = [
    {
      metric: "Acne Reduction",
      before: 85,
      current: 58,
      improvement: 32,
      color: "text-green-600",
    },
    {
      metric: "Hydration Level",
      before: 45,
      current: 70,
      improvement: 56,
      color: "text-blue-600",
    },
    {
      metric: "Skin Texture",
      before: 50,
      current: 75,
      improvement: 50,
      color: "text-purple-600",
    },
    {
      metric: "Overall Health",
      before: 60,
      current: 78,
      improvement: 30,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your skin improvement journey</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Progress
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-blue-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {improvements.map((item, index) => (
          <Card key={index} className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{item.metric}</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">+{item.improvement}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Before</span>
                  <span className="font-medium">{item.before}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-gray-400 rounded" style={{ width: `${item.before}%` }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current</span>
                  <span className={`font-medium ${item.color}`}>{item.current}%</span>
                </div>
                <div className="w-full h-2 bg-green-400 rounded">
                  <div className="h-2 bg-green-600 rounded" style={{ width: `${item.current}%` }}></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo Timeline */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Camera className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-lg font-semibold">Photo Timeline</span>
              </div>
              <div className="text-gray-600 mb-2">Visual progress over time</div>
              <div className="mb-4 flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${selectedComparison === "week" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => setSelectedComparison("week")}
                >
                  Weekly
                </button>
                <button
                  className={`px-3 py-1 rounded ${selectedComparison === "month" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => setSelectedComparison("month")}
                >
                  Monthly
                </button>
                <button
                  className={`px-3 py-1 rounded ${selectedComparison === "comparison" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => setSelectedComparison("comparison")}
                >
                  Compare
                </button>
              </div>
              {selectedComparison === "week" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photoTimeline.map((photo, index) => (
                    <div key={index} className="space-y-3">
                      <div className="relative">
                        <img
                          src={photo.image}
                          alt={`Progress ${photo.week}`}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <span className="absolute top-2 left-2 bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold">{photo.week}</span>
                        <span className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">{photo.score}%</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{photo.date}</p>
                        <div className="space-y-1">
                          {photo.issues.map((issue, issueIndex) => (
                            <p key={issueIndex} className="text-xs text-gray-600">
                              • {issue}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedComparison === "month" && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Monthly view coming soon...</p>
                </div>
              )}
              {selectedComparison === "comparison" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center space-y-3">
                    <h3 className="font-medium text-gray-900">Before (Week 1)</h3>
                    <img
                      src="/placeholder.svg"
                      alt="Before"
                      width={250}
                      height={250}
                      className="w-full h-64 object-cover rounded-lg border mx-auto"
                    />
                    <div className="space-y-1 text-left">
                      <p className="text-sm font-medium text-red-600">Issues Detected:</p>
                      <p className="text-xs text-gray-600">• Moderate acne breakouts</p>
                      <p className="text-xs text-gray-600">• Dry patches on cheeks</p>
                      <p className="text-xs text-gray-600">• Uneven skin tone</p>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="font-medium text-gray-900">Current (Week 5)</h3>
                    <img
                      src="/placeholder.svg"
                      alt="Current"
                      width={250}
                      height={250}
                      className="w-full h-64 object-cover rounded-lg border mx-auto"
                    />
                    <div className="space-y-1 text-left">
                      <p className="text-sm font-medium text-green-600">Improvements:</p>
                      <p className="text-xs text-gray-600">• Clear, healthy skin</p>
                      <p className="text-xs text-gray-600">• Excellent hydration</p>
                      <p className="text-xs text-gray-600">• Natural, healthy glow</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedComparison === "comparison" && (
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Amazing Progress!</h3>
                  <p className="text-sm text-green-700">
                    You've achieved a 30% overall improvement in just 5 weeks. Keep up the great work!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
        {/* Progress Chart & Stats */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-lg font-semibold">Progress Chart</span>
              </div>
              <div className="space-y-4">
                {progressData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{data.date}</span>
                      <span className="text-gray-600">{data.overall}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-blue-500 rounded" style={{ width: `${data.overall}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <span className="text-lg font-semibold">Upload New Photo</span>
              <p className="text-gray-600 mb-4">Track your progress with a new photo</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-900 mb-1">Take or upload a photo</p>
                <p className="text-xs text-gray-500">
                  For best results, use good lighting and face the camera directly
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>
          </Card>
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <span className="text-lg font-semibold">Next Milestone</span>
              <div className="space-y-3 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress to 80%</span>
                  <span className="font-medium">78/80%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-green-500 rounded" style={{ width: '97.5%' }}></div>
                </div>
                <p className="text-xs text-gray-500">You're almost there! Just 2% more to reach your next milestone.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
