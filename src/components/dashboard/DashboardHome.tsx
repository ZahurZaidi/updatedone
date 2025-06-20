import { useEffect, useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import { TrendingUp, Camera, Search, Zap, ArrowRight, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { supabase } from "../../lib/supabase"

interface SkinAssessment {
  skin_type: string;
  hydration_level: string;
  assessment_answers: {
    skin_answers: string[];
    lifestyle_answers: Record<string, string>;
  };
  created_at: string;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<SkinAssessment | null>(null);
  const [skinInsights, setSkinInsights] = useState<string>("");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    if (user) {
      loadAssessmentData();
    }
  }, [user]);

  const loadAssessmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('skin_assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setAssessment(data);
        generateSkinInsights(data);
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
    }
  };

  const generateSkinInsights = async (assessmentData: SkinAssessment) => {
    setIsLoadingInsights(true);
    try {
      const GEMINI_API_KEY = 'AIzaSyACCwyZ7BJgtRydtUCe9P-tXaWI6qLFpFQ';
      
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
            maxOutputTokens: 512,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          setSkinInsights(data.candidates[0].content.parts[0].text);
        }
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      setSkinInsights("Based on your assessment, we've identified your skin type and can provide personalized recommendations. Explore the features to get detailed analysis and routines tailored for you.");
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const quickStats = [
    {
      title: "Skin Type",
      value: assessment?.skin_type || "Unknown",
      change: "From assessment",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      title: "Hydration Level",
      value: assessment?.hydration_level || "Unknown",
      change: "Current status",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Assessment Date",
      value: assessment ? new Date(assessment.created_at).toLocaleDateString() : "Not completed",
      change: "Last updated",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    {
      type: "assessment",
      title: "Skin assessment completed",
      description: `Identified as ${assessment?.skin_type || 'Unknown'} skin with ${assessment?.hydration_level || 'Unknown'} hydration`,
      time: assessment ? new Date(assessment.created_at).toLocaleDateString() : "Not completed",
      status: "completed",
    },
    {
      type: "routine",
      title: "Personalized routine available",
      description: "Custom morning and evening routines ready based on your assessment",
      time: "Ready now",
      status: "available",
    },
    {
      type: "ingredient",
      title: "Ingredient checker ready",
      description: "Analyze ingredients for compatibility with your skin type",
      time: "Available",
      status: "available",
    },
    {
      type: "analysis",
      title: "Facial analysis available",
      description: "Upload photos for AI-powered skin analysis",
      time: "Ready to use",
      status: "available",
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
      title: "Generate Routine",
      description: "Get a personalized skincare routine for your skin type",
      icon: Sparkles,
      href: "/dashboard/routine",
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Here's your personalized skincare overview</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 rounded inline-flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Assessment Complete
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {/* Skin Insights */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                <span className="text-xl font-semibold">Your Skin Insights</span>
              </div>
              <div className="text-gray-600 mb-4">Personalized analysis based on your assessment</div>
              
              {isLoadingInsights ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-gray-600">Generating insights...</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {skinInsights || "Complete your skin assessment to get personalized insights and recommendations."}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
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
          {/* Skin Profile Summary */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-xl font-semibold">Your Skin Profile</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Skin Type:</span>
                  <span className="text-sm font-medium text-gray-900">{assessment?.skin_type || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hydration:</span>
                  <span className="text-sm font-medium text-gray-900">{assessment?.hydration_level || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Assessment:</span>
                  <span className="text-sm font-medium text-green-600">Complete</span>
                </div>
              </div>
              
              <Link to="/dashboard/routine">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Personalized Routine
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-xl font-semibold">Available Features</span>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
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
              <div className="flex items-center mb-4">
                <span className="text-xl font-semibold">Today's Tip</span>
              </div>
              <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-2">💡 Personalized Care</h4>
                <p className="text-sm text-gray-600">
                  {assessment?.skin_type === 'Dry' && "Your dry skin needs extra hydration. Consider using a humidifier and drinking more water."}
                  {assessment?.skin_type === 'Oily' && "For oily skin, use gentle cleansers and avoid over-washing which can increase oil production."}
                  {assessment?.skin_type === 'Combination' && "Focus on different products for different areas - lighter on T-zone, richer on cheeks."}
                  {assessment?.skin_type === 'Sensitive' && "Patch test new products and stick to fragrance-free, gentle formulations."}
                  {assessment?.skin_type === 'Normal' && "Maintain your skin's balance with consistent, gentle care and sun protection."}
                  {!assessment && "Complete your skin assessment to get personalized tips and recommendations."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}