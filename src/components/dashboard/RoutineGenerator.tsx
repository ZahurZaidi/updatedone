"use client"

import { useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Sun,
  Moon,
  Droplets,
  Shield,
  Sparkles,
  Timer,
  RotateCcw,
} from "lucide-react"

export default function RoutineGenerator() {
  const [activeTab, setActiveTab] = useState("current")
  const [isEditing, setIsEditing] = useState(false)
  const [routineEnabled, setRoutineEnabled] = useState(true)

  const currentRoutine = {
    morning: [
      {
        id: 1,
        name: "Gentle Cleanser",
        brand: "CeraVe",
        type: "cleanser",
        duration: "1-2 minutes",
        instructions: "Massage gently with lukewarm water",
        completed: true,
      },
      {
        id: 2,
        name: "Vitamin C Serum",
        brand: "The Ordinary",
        type: "serum",
        duration: "Wait 10 minutes",
        instructions: "Apply 2-3 drops, avoid eye area",
        completed: true,
      },
      {
        id: 3,
        name: "Hyaluronic Acid",
        brand: "The Inkey List",
        type: "serum",
        duration: "Wait 5 minutes",
        instructions: "Apply to damp skin for better absorption",
        completed: true,
      },
      {
        id: 4,
        name: "Daily Moisturizer",
        brand: "Neutrogena",
        type: "moisturizer",
        duration: "1 minute",
        instructions: "Apply evenly to face and neck",
        completed: true,
      },
      {
        id: 5,
        name: "SPF 30 Sunscreen",
        brand: "EltaMD",
        type: "sunscreen",
        duration: "1 minute",
        instructions: "Apply generously, reapply every 2 hours",
        completed: true,
      },
    ],
    evening: [
      {
        id: 6,
        name: "Oil Cleanser",
        brand: "DHC",
        type: "cleanser",
        duration: "1-2 minutes",
        instructions: "Massage to remove makeup and sunscreen",
        completed: false,
      },
      {
        id: 7,
        name: "Gentle Cleanser",
        brand: "CeraVe",
        type: "cleanser",
        duration: "1-2 minutes",
        instructions: "Second cleanse for deep cleaning",
        completed: false,
      },
      {
        id: 8,
        name: "Retinol Serum",
        brand: "Paula's Choice",
        type: "treatment",
        duration: "Wait 20 minutes",
        instructions: "Start 2x/week, gradually increase",
        completed: false,
      },
      {
        id: 9,
        name: "Night Moisturizer",
        brand: "Olay",
        type: "moisturizer",
        duration: "1 minute",
        instructions: "Apply generously for overnight repair",
        completed: false,
      },
    ],
  }

  const routineStats = {
    streak: 15,
    completionRate: 87,
    totalProducts: 9,
    avgTime: 12,
  }

  const getProductIcon = (type: string) => {
    switch (type) {
      case "cleanser":
        return <Droplets className="w-4 h-4" />
      case "serum":
        return <Sparkles className="w-4 h-4" />
      case "moisturizer":
        return <Shield className="w-4 h-4" />
      case "sunscreen":
        return <Sun className="w-4 h-4" />
      case "treatment":
        return <Timer className="w-4 h-4" />
      default:
        return <Droplets className="w-4 h-4" />
    }
  }

  const getProductColor = (type: string) => {
    switch (type) {
      case "cleanser":
        return "text-blue-600 bg-blue-50"
      case "serum":
        return "text-purple-600 bg-purple-50"
      case "moisturizer":
        return "text-green-600 bg-green-50"
      case "sunscreen":
        return "text-orange-600 bg-orange-50"
      case "treatment":
        return "text-teal-600 bg-teal-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skincare Routine</h1>
          <p className="text-gray-600 mt-1">Your personalized daily skincare schedule</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="routine-enabled" className="text-sm font-medium text-gray-700">Routine Active</label>
            <input
              id="routine-enabled"
              type="checkbox"
              checked={routineEnabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoutineEnabled(e.target.checked)}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="border-teal-200 text-teal-700 hover:bg-teal-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Done Editing" : "Edit Routine"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-teal-600">{routineStats.streak} days</p>
              </div>
              <Calendar className="w-8 h-8 text-teal-500" />
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{routineStats.completionRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-purple-600">{routineStats.totalProducts}</p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-green-600">{routineStats.avgTime} min</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "current" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("current")}
          >
            Current Routine
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "generator" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("generator")}
          >
            Generate New
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "history" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === "current" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Morning Routine */}
            <Card className="border-0 shadow-md">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Sun className="w-5 h-5 mr-2 text-orange-500" />
                  <span className="text-lg font-semibold">Morning Routine</span>
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Completed</span>
                </div>
                <div className="text-gray-600 mb-2">Start your day with healthy skin</div>
                {currentRoutine.morning.map((product, index) => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg border transition-all ${
                      product.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
                          <div className={`p-2 rounded-lg ${getProductColor(product.type)}`}>{getProductIcon(product.type)}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                          <p className="text-xs text-gray-500 mt-1">{product.instructions}</p>
                          <p className="text-xs text-teal-600 mt-1">{product.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {product.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {isEditing && (
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <Button variant="outline" className="w-full border-dashed">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
            </Card>

            {/* Evening Routine */}
            <Card className="border-0 shadow-md">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Moon className="w-5 h-5 mr-2 text-indigo-500" />
                  <span className="text-lg font-semibold">Evening Routine</span>
                  <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">Pending</span>
                </div>
                <div className="text-gray-600 mb-2">End your day with restorative care</div>
                {currentRoutine.evening.map((product, index) => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg border transition-all ${
                      product.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
                          <div className={`p-2 rounded-lg ${getProductColor(product.type)}`}>{getProductIcon(product.type)}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                          <p className="text-xs text-gray-500 mt-1">{product.instructions}</p>
                          <p className="text-xs text-teal-600 mt-1">{product.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {product.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {isEditing && (
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <Button variant="outline" className="w-full border-dashed">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
        {activeTab === "generator" && (
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <span className="text-lg font-semibold">Generate Personalized Routine</span>
              <p className="text-gray-600 mb-4">Create a custom routine based on your skin type and goals</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="skin-type" className="text-sm font-medium text-gray-700">Skin Type</label>
                    <select id="skin-type" className="w-full border rounded px-3 py-2">
                      <option value="">Select your skin type</option>
                      <option value="oily">Oily</option>
                      <option value="dry">Dry</option>
                      <option value="combination">Combination</option>
                      <option value="sensitive">Sensitive</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="skin-concerns" className="text-sm font-medium text-gray-700">Primary Concerns</label>
                    <select id="skin-concerns" className="w-full border rounded px-3 py-2">
                      <option value="">Select main concern</option>
                      <option value="acne">Acne</option>
                      <option value="aging">Anti-aging</option>
                      <option value="hyperpigmentation">Dark spots</option>
                      <option value="dryness">Dryness</option>
                      <option value="sensitivity">Sensitivity</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="routine-complexity" className="text-sm font-medium text-gray-700">Routine Complexity</label>
                    <select id="routine-complexity" className="w-full border rounded px-3 py-2">
                      <option value="">Choose complexity</option>
                      <option value="minimal">Minimal (3-4 steps)</option>
                      <option value="moderate">Moderate (5-7 steps)</option>
                      <option value="comprehensive">Comprehensive (8+ steps)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget Range</label>
                    <select id="budget" className="w-full border rounded px-3 py-2">
                      <option value="">Select budget</option>
                      <option value="budget">Budget ($0-50)</option>
                      <option value="mid">Mid-range ($50-150)</option>
                      <option value="luxury">Luxury ($150+)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="time-available" className="text-sm font-medium text-gray-700">Time Available</label>
                    <select id="time-available" className="w-full border rounded px-3 py-2">
                      <option value="">How much time?</option>
                      <option value="quick">Quick (5-10 min)</option>
                      <option value="moderate">Moderate (10-20 min)</option>
                      <option value="thorough">Thorough (20+ min)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="allergies" className="text-sm font-medium text-gray-700">Known Allergies</label>
                    <textarea
                      id="allergies"
                      className="w-full border rounded px-3 py-2"
                      placeholder="List any known allergies or ingredients to avoid..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Routine
                </Button>
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
              </div>
            </div>
          </Card>
        )}
        {activeTab === "history" && (
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <span className="text-lg font-semibold">Routine History</span>
              <p className="text-gray-600 mb-4">Track your routine consistency over time</p>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                  <div>Sun</div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }, (_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg border-2 ${
                        Math.random() > 0.3
                          ? "bg-teal-100 border-teal-300"
                          : Math.random() > 0.5
                            ? "bg-orange-100 border-orange-300"
                            : "bg-gray-100 border-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-teal-100 border-2 border-teal-300 rounded"></div>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
                    <span>Partial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                    <span>Missed</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
