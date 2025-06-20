import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { skinAssessmentQuestions, lifestyleAssessmentQuestions, skinAssessmentData } from '../../data/skinAssessmentData';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const SkinAssessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSection, setCurrentSection] = useState<'skin' | 'lifestyle'>('skin');
  const [skinAnswers, setSkinAnswers] = useState<string[]>([]);
  const [lifestyleAnswers, setLifestyleAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, refreshAssessmentStatus } = useAuth();

  const currentQuestions = currentSection === 'skin' ? skinAssessmentQuestions : lifestyleAssessmentQuestions;
  const totalQuestions = currentQuestions.length;

  const handleAnswer = (answer: string) => {
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

  const getSkinProfile = (answers: string[]) => {
    for (const entry of skinAssessmentData) {
      if (JSON.stringify(entry.answers) === JSON.stringify(answers)) {
        return { skinType: entry.skin_type, hydration: entry.hydration };
      }
    }
    return { skinType: 'Unknown', hydration: 'Unknown' };
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { skinType, hydration } = getSkinProfile(skinAnswers);
      
      const assessmentData = {
        user_id: user.id,
        skin_type: skinType,
        hydration_level: hydration,
        assessment_answers: {
          skin_answers: skinAnswers,
          lifestyle_answers: lifestyleAnswers
        }
      };

      console.log('Submitting assessment data:', assessmentData);

      const { data, error } = await supabase
        .from('skin_assessments')
        .insert([assessmentData])
        .select()
        .single();

      if (error) {
        console.error('Error saving assessment:', error);
        throw error;
      }

      console.log('Assessment saved successfully:', data);

      // Refresh assessment status in context
      await refreshAssessmentStatus();

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving assessment:', error);
      // Show error to user but don't prevent navigation
      alert('There was an issue saving your assessment, but you can continue to the dashboard.');
      navigate('/dashboard', { replace: true });
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
                <textarea
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Please provide your answer..."
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  rows={4}
                />
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
            disabled={!canProceed}
            isLoading={isSubmitting}
            rightIcon={
              currentStep === totalQuestions - 1 && currentSection === 'lifestyle' ? 
                undefined : <ChevronRight className="w-4 h-4" />
            }
          >
            {currentStep === totalQuestions - 1 && currentSection === 'lifestyle' 
              ? 'Complete Assessment' 
              : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkinAssessment;