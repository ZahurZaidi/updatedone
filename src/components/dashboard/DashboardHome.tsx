import Card from "../common/Card"
import Button from "../common/Button"
import { TrendingUp, Camera, Search, Zap, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function DashboardHome() {
  const quickStats = [
    {
      title: "Photos Uploaded",
      value: "12",
      change: "+3 this week",
      icon: Camera,
      color: "text-blue-600",
    },
    {
      title: "Progress Score",
      value: "78%",
      change: "+12% improvement",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Issues Detected",
      value: "3",
      change: "-2 from last scan",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    {
      type: "analysis",
      title: "Facial analysis completed",
      description: "3 minor issues detected, 2 improvements noted",
      time: "2 hours ago",
      status: "completed",
    },
    {
      type: "routine",
      title: "Morning routine logged",
      description: "Cleanser, Vitamin C serum, Moisturizer, SPF",
      time: "8 hours ago",
      status: "completed",
    },
    {
      type: "ingredient",
      title: "Ingredient check performed",
      description: "New moisturizer ingredients analyzed - All safe",
      time: "1 day ago",
      status: "completed",
    },
    {
      type: "progress",
      title: "Progress photo uploaded",
      description: "Week 4 comparison shows visible improvements",
      time: "3 days ago",
      status: "completed",
    },
  ]

  const quickActions = [
    {
      title: "Take Progress Photo",
      description: "Upload a new photo to track your progress",
      icon: Camera,
      href: "/dashboard/progress",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Analyze Your Skin",
      description: "Get AI-powered analysis of your current skin condition",
      icon: Search,
      href: "/dashboard/analysis",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Check Ingredients",
      description: "Verify if your products are suitable for your skin",
      icon: Search,
      href: "/dashboard/ingredients",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Quick Fix Help",
      description: "Get instant solutions for sudden skin issues",
      icon: Zap,
      href: "/dashboard/quick-fix",
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Jane!</h1>
          <p className="text-gray-600 mt-1">Here's your skincare progress overview</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 rounded inline-flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            On Track
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-xl font-semibold">Progress Overview</span>
              </div>
              <div className="text-gray-600 mb-4">Your skin improvement journey</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">78%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-4">
                <div className="h-2 bg-green-500 rounded" style={{ width: '78%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-sm text-gray-600">Acne Improvement</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">72%</p>
                  <p className="text-sm text-gray-600">Hydration Level</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-2">
                  <img
                    src="/placeholder.svg"
                    alt="Before"
                    width={60}
                    height={60}
                    className="rounded-lg border"
                  />
                  <img
                    src="/placeholder.svg"
                    alt="Current"
                    width={60}
                    height={60}
                    className="rounded-lg border"
                  />
                </div>
                <Link to="/dashboard/progress">
                  <Button variant="outline" size="sm">
                    View Full Progress
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center">
                <span className="text-xl font-semibold">Quick Actions</span>
              </div>
              <div className="text-gray-600 mb-4">Common tasks to maintain your skincare routine</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <div className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform`}
                        >
                          <action.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">{action.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Routine */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center">
                <span className="text-xl font-semibold">Today's Routine</span>
              </div>
              <div className="text-gray-600 mb-4">Morning (Completed) and Evening (Pending)</div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">Morning (Completed)</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">Gentle Cleanser</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">Vitamin C Serum</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">Moisturizer</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">SPF 30</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">Evening (Pending)</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">Oil Cleanser</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">Gentle Cleanser</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">Retinol Serum</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">Night Moisturizer</span>
                  </div>
                </div>
              </div>

              <Link to="/dashboard/routine">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full Routine
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center">
                <span className="text-xl font-semibold">Recent Activity</span>
              </div>
              <div className="text-gray-600 mb-4">Recent activities and updates</div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Tips & Recommendations */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center">
                <span className="text-xl font-semibold">Today's Tip</span>
              </div>
              <div className="text-gray-600 mb-4">A helpful tip for your skincare routine</div>
              <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-2">💡 Hydration Boost</h4>
                <p className="text-sm text-gray-600">
                  Your skin analysis shows slight dehydration. Consider adding a hydrating toner to your routine and
                  drinking more water throughout the day.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
