import { useEffect, useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import { TrendingUp, Camera, Search, Zap, ArrowRight, CheckCircle, AlertCircle, Sparkles, ClipboardList, Droplets, Sun, Shield, Heart, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { supabase } from "../../lib/supabase"
import { generateSkinInsights } from "../../utils/geminiApi"

interface SkinAssessment {
  skin_type: string;
  hydration_level: string;
  assessment_answers: {
    skin_answers: string[];
    lifestyle_answers: Record<string, string>;
  };
  created_at: string;
}

interface UserProfile {
  daily_water_intake: string;
  sun_exposure: string;
  current_skincare_steps: string;
  comfortable_routine_length: string;
  known_allergies: string;
  side_effects_ingredients: string;
  skin_type: string;
  hydration_level: string;
}

export default function DashboardHome() {
  const { user, hasCompletedAssessment } = useAuth();
  const [assessment, setAssessment] = useState<SkinAssessment | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [skinInsights, setSkinInsights] = useState<string>("");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    if (user && hasCompletedAssessment) {
      loadAssessmentData();
      loadUserProfile();
    }
  }, [user, hasCompletedAssessment]);

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
        generateInsights(data);
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('daily_water_intake, sun_exposure, current_skincare_steps, comfortable_routine_length, known_allergies, side_effects_ingredients, skin_type, hydration_level')
        .eq('user_id', user?.id)
        .single();

      if (data && !error) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const generateInsights = async (assessmentData: SkinAssessment) => {
    setIsLoadingInsights(true);
    try {
      const insights = await generateSkinInsights(assessmentData);
      setSkinInsights(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setSkinInsights("Based on your assessment, we've identified your skin type and can provide personalized recommendations. Explore the features to get detailed analysis and routines tailored for you.");
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // If assessment not completed, show assessment prompt
  if (!hasCompletedAssessment) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to CARE CANVAS!</h1>
            <p className="text-gray-600 mt-1">Let's start by understanding your skin better</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded inline-flex items-center">
              <ClipboardList className="w-3 h-3 mr-1" />
              Assessment Needed
            </span>
          </div>
        </div>

        {/* Assessment Prompt */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardList className="w-10 h-10 text-primary-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Complete Your Skin Assessment
              </h2>
              
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                To provide you with personalized skincare recommendations, we need to understand your skin type, 
                concerns, and lifestyle. This assessment takes just 5-10 minutes and will unlock all our features.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Skin Analysis</h3>
                  <p className="text-sm text-gray-600">Answer questions about your skin type and concerns</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Lifestyle Factors</h3>
                  <p className="text-sm text-gray-600">Tell us about your daily routine and habits</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Get Results</h3>
                  <p className="text-sm text-gray-600">Receive personalized recommendations and routines</p>
                </div>
              </div>

              <Link to="/dashboard/assessment">
                <Button size="lg" className="bg-gradient-to-r from-primary-600 to-secondary-500">
                  <ClipboardList className="w-5 h-5 mr-2" />
                  Start Skin Assessment
                </Button>
              </Link>

              <p className="text-sm text-gray-500 mt-4">
                ⏱️ Takes 5-10 minutes • 🔒 Your data is secure and private
              </p>
            </div>
          </Card>
        </div>

        {/* Feature Preview */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            What you'll unlock after assessment:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Camera, title: "Facial Analysis", desc: "AI-powered skin analysis" },
              { icon: Search, title: "Ingredient Checker", desc: "Verify product safety" },
              { icon: Sparkles, title: "Custom Routines", desc: "Personalized skincare plans" },
              { icon: TrendingUp, title: "Progress Tracking", desc: "Monitor improvements" }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm opacity-75">
                <div className="p-4 text-center">
                  <feature.icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-700 mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show full dashboard if assessment is completed
  const quickStats = [
    {
      title: "Skin Type",
      value: userProfile?.skin_type || assessment?.skin_type || "Unknown",
      change: "From assessment",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Hydration Level",
      value: userProfile?.hydration_level || assessment?.hydration_level || "Unknown",
      change: "Current status",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Daily Water Intake",
      value: userProfile?.daily_water_intake || "Not specified",
      change: "Lifestyle factor",
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Sun Exposure",
      value: userProfile?.sun_exposure || "Not specified",
      change: "Daily routine",
      icon: Sun,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Skincare Steps",
      value: userProfile?.current_skincare_steps || "Not specified",
      change: "Current routine",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Preferred Routine",
      value: userProfile?.comfortable_routine_length || "Not specified",
      change: "Comfort level",
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    // Only show allergies if they exist and are not empty
    ...(userProfile?.known_allergies && userProfile.known_allergies.trim() !== '' ? [{
      title: "Known Allergies",
      value: userProfile.known_allergies.length > 30 ? 
        userProfile.known_allergies.substring(0, 30) + "..." : 
        userProfile.known_allergies,
      change: "Safety info",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }] : [])
  ]

  const handleRetakeAssessment = () => {
    if (window.confirm("Are you sure you want to retake your skin assessment? This will update your current results.")) {
      window.location.href = "/dashboard/assessment";
    }
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-sm font-bold text-gray-900 mb-1 break-words">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color} ml-2 flex-shrink-0`}>
                  <stat.icon className="w-4 h-4" />
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
                    {skinInsights || "Based on your assessment, we've identified your skin type and can provide personalized recommendations. Explore the features to get detailed analysis and routines tailored for you."}
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
                  <span className="text-sm font-medium text-gray-900">{userProfile?.skin_type || assessment?.skin_type || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hydration:</span>
                  <span className="text-sm font-medium text-gray-900">{userProfile?.hydration_level || assessment?.hydration_level || 'Unknown'}</span>
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

          {/* Lifestyle Profile */}
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-xl font-semibold">Lifestyle Profile</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Droplets className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Daily Water Intake</p>
                    <p className="text-sm text-gray-600">{userProfile?.daily_water_intake || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Sun className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sun Exposure</p>
                    <p className="text-sm text-gray-600">{userProfile?.sun_exposure || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Current Skincare Steps</p>
                    <p className="text-sm text-gray-600">{userProfile?.current_skincare_steps || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Preferred Routine</p>
                    <p className="text-sm text-gray-600">{userProfile?.comfortable_routine_length || 'Not specified'}</p>
                  </div>
                </div>
                
                {userProfile?.known_allergies && userProfile.known_allergies.trim() !== '' && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Shield className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Known Allergies</p>
                      <p className="text-sm text-gray-600">{userProfile.known_allergies}</p>
                    </div>
                  </div>
                )}
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
                  {(userProfile?.skin_type || assessment?.skin_type) === 'Dry' && "Your dry skin needs extra hydration. Consider using a humidifier and drinking more water."}
                  {(userProfile?.skin_type || assessment?.skin_type) === 'Oily' && "For oily skin, use gentle cleansers and avoid over-washing which can increase oil production."}
                  {(userProfile?.skin_type || assessment?.skin_type) === 'Combination' && "Focus on different products for different areas - lighter on T-zone, richer on cheeks."}
                  {(userProfile?.skin_type || assessment?.skin_type)?.includes('Sensitive') && "Patch test new products and stick to fragrance-free, gentle formulations."}
                  {(userProfile?.skin_type || assessment?.skin_type) === 'Normal' && "Maintain your skin's balance with consistent, gentle care and sun protection."}
                  {!userProfile?.skin_type && !assessment?.skin_type && "Complete your skin assessment to get personalized tips and recommendations."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}