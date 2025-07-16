import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { skinAssessmentQuestions, lifestyleAssessmentQuestions } from '../../data/skinAssessmentData';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { analyzeSkinTypeFromAssessment } from '../../utils/geminiApi';

const SkinAssessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSection, setCurrentSection] = useState<'skin' | 'lifestyle'>('skin');
  const [skinAnswers, setSkinAnswers] = useState<string[]>([]);
  const [lifestyleAnswers, setLifestyleAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { user, refreshAssessmentStatus } = useAuth();

  const currentQuestions = currentSection === 'skin' ? skinAssessmentQuestions : lifestyleAssessmentQuestions;
  const totalQuestions = currentQuestions.length;

  const handleAnswer = (answer: string) => {
    setError(''); // Clear any previous errors
    
    if (currentSection === 'skin') {
      const newAnswers = [...skinAnswers];
      newAnswers[currentStep] = answer;
      setSkinAnswers(newAnswers);
    } else {
      const currentQuestion = currentQuestions[currentStep];
      setLifestyleAnswers(prev => ({
        ...prev,
        [currentQuestion.key]: answer
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentSection === 'skin') {
      setCurrentSection('lifestyle');
      setCurrentStep(0);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentSection === 'lifestyle') {
      setCurrentSection('skin');
      setCurrentStep(skinAssessmentQuestions.length - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Please log in to save your assessment');
      return;
    }

    // Validate that we have all required answers
    if (skinAnswers.length !== skinAssessmentQuestions.length) {
      setError('Please complete all skin assessment questions');
      return;
    }

    const requiredLifestyleKeys = lifestyleAssessmentQuestions.map(q => q.key);
    const answeredLifestyleKeys = Object.keys(lifestyleAnswers);
    const missingLifestyleAnswers = requiredLifestyleKeys.filter(key => !answeredLifestyleKeys.includes(key));
    
    if (missingLifestyleAnswers.length > 0) {
      setError('Please complete all lifestyle assessment questions');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Starting assessment submission...');
      console.log('Skin answers:', skinAnswers);
      console.log('Lifestyle answers:', lifestyleAnswers);
      
      // Use Gemini API to analyze skin type instead of hardcoded logic
      const { skinType, hydrationLevel } = await analyzeSkinTypeFromAssessment(skinAnswers, lifestyleAnswers);
      console.log('Gemini API determined skin profile:', { skinType, hydrationLevel });
      
      const assessmentData = {
        user_id: user.id,
        skin_type: skinType,
        hydration_level: hydrationLevel,
        assessment_answers: {
          skin_answers: skinAnswers,
          lifestyle_answers: lifestyleAnswers
        }
      };

      console.log('Submitting assessment data:', assessmentData);

      // First, check if user already has an assessment
      const { data: existingAssessment, error: checkError } = await supabase
        .from('skin_assessments')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing assessment:', checkError);
        throw new Error('Failed to check existing assessment');
      }

      let result;
      if (existingAssessment) {
        // Update existing assessment
        console.log('Updating existing assessment...');
        result = await supabase
          .from('skin_assessments')
          .update({
            skin_type: skinType,
            hydration_level: hydrationLevel,
            assessment_answers: assessmentData.assessment_answers,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Insert new assessment
        console.log('Creating new assessment...');
        result = await supabase
          .from('skin_assessments')
          .insert([assessmentData])
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Assessment saved successfully:', data);

      // Also update user profile with lifestyle data
      const profileData = {
        user_id: user.id,
        skin_type: skinType,
        hydration_level: hydrationLevel,
        daily_water_intake: lifestyleAnswers.daily_water_intake,
        sun_exposure: lifestyleAnswers.sun_exposure,
        current_skincare_steps: lifestyleAnswers.current_skincare_steps,
        comfortable_routine_length: lifestyleAnswers.comfortable_routine_length,
        known_allergies: lifestyleAnswers.known_allergies,
        side_effects_ingredients: lifestyleAnswers.side_effects_ingredients,
        updated_at: new Date().toISOString()
      };

      console.log('Updating user profile with lifestyle data:', profileData);

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        // Don't throw error here, as the assessment was saved successfully
      }

      // Refresh assessment status in context
      await refreshAssessmentStatus();
      
      // Show success message
      const successMessage = `Assessment completed successfully!\n\nYour Results:\n• Skin Type: ${skinType}\n• Hydration Level: ${hydrationLevel}\n\nYou can now access all features of the app!`;
      alert(successMessage);
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (error: any) {
      console.error('Error saving assessment:', error);
      setError(error.message || 'Failed to save assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = currentQuestions[currentStep];
  const currentAnswer = currentSection === 'skin' 
    ? skinAnswers[currentStep] 
    : lifestyleAnswers[currentQuestion.key];

  const canProceed = currentAnswer !== undefined && currentAnswer !== '';
  const progress = currentSection === 'skin' 
    ? (currentStep + 1) / skinAssessmentQuestions.length * 50
    : 50 + (currentStep + 1) / lifestyleAssessmentQuestions.length * 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Skin Assessment
          </h1>
          <p className="text-gray-600">
            Help us understand your skin better to provide personalized recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Skin Assessment</span>
            <span>Lifestyle Assessment</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Question Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {currentSection === 'skin' ? 'Skin Assessment' : 'Lifestyle Assessment'}
                </span>
                <span className="text-sm text-gray-500">
                  Question {currentStep + 1} of {totalQuestions}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.q}
              </h2>
              {currentQuestion.note && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 whitespace-pre-line">
                    {currentQuestion.note}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {currentQuestion.opts ? (
                currentQuestion.opts.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      currentAnswer === option
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {currentAnswer === option && (
                        <CheckCircle className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div>
                  <textarea
                    value={currentAnswer || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentQuestion.key === 'known_allergies' ? 
                      "Please list any known allergies or ingredients that cause reactions...\n\nExample: fragrance, parabens, retinoids" : 
                      "Please provide your answer..."
                    }
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 && currentSection === 'skin'}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= currentStep ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            isLoading={isSubmitting}
            rightIcon={
              currentStep === totalQuestions - 1 && currentSection === 'lifestyle' ? 
                undefined : <ChevronRight className="w-4 h-4" />
            }
          >
            {currentStep === totalQuestions - 1 && currentSection === 'lifestyle' 
              ? (isSubmitting ? 'Completing Assessment...' : 'Complete Assessment')
              : 'Next'}
          </Button>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Current Section: {currentSection}</p>
            <p>Current Step: {currentStep + 1}/{totalQuestions}</p>
            <p>Skin Answers: {skinAnswers.length}/{skinAssessmentQuestions.length}</p>
            <p>Lifestyle Answers: {Object.keys(lifestyleAnswers).length}/{lifestyleAssessmentQuestions.length}</p>
            <p>Can Proceed: {canProceed ? 'Yes' : 'No'}</p>
            <p>User ID: {user?.id || 'Not logged in'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinAssessment;