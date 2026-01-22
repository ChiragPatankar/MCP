import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Phone, Globe, Briefcase, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingData {
  fullName: string;
  companyName: string;
  phone: string;
  website: string;
  industry: string;
  teamSize: string;
  useCase: string;
}

interface OnboardingFormProps {
  initialName?: string;
  initialEmail?: string;
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
}

const industries = [
  'Technology',
  'E-commerce',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Marketing',
  'Consulting',
  'Manufacturing',
  'Other'
];

const teamSizes = [
  'Just me',
  '2-10',
  '11-50',
  '51-200',
  '201-500',
  '500+'
];

const useCases = [
  'Customer Support',
  'Sales Assistance',
  'Lead Generation',
  'FAQ Automation',
  'Internal Help Desk',
  'Product Recommendations',
  'Other'
];

const OnboardingForm: React.FC<OnboardingFormProps> = ({ 
  initialName = '', 
  initialEmail = '',
  onComplete,
  onSkip 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: initialName,
    companyName: '',
    phone: '',
    website: '',
    industry: '',
    teamSize: '',
    useCase: ''
  });

  const totalSteps = 3;

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim().length > 0;
      case 2:
        return formData.companyName.trim().length > 0 && formData.industry.length > 0;
      case 3:
        return formData.teamSize.length > 0 && formData.useCase.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to ClientSphere!</h2>
          </div>
          <p className="text-white/80 text-sm">Let's personalize your experience</p>
          
          {/* Progress bar */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-white/60 text-xs mt-2">Step {step} of {totalSteps}</p>
        </div>

        {/* Form content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Tell us about yourself</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-semibold text-white mb-4">About your company</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      <Building2 className="w-4 h-4 inline mr-2" />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Acme Inc."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Website (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Industry *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {industries.map((industry) => (
                        <button
                          key={industry}
                          type="button"
                          onClick={() => handleInputChange('industry', industry)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.industry === industry
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-semibold text-white mb-4">How will you use ClientSphere?</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Team Size *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {teamSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleInputChange('teamSize', size)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.teamSize === size
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Primary Use Case *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {useCases.map((useCase) => (
                        <button
                          key={useCase}
                          type="button"
                          onClick={() => handleInputChange('useCase', useCase)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.useCase === useCase
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {useCase}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={prevStep}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Back
              </Button>
            ) : onSkip ? (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-white/50 hover:text-white/70 hover:bg-white/10 text-sm"
              >
                Skip for now
              </Button>
            ) : null}
          </div>
          
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {step === totalSteps ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Setup
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingForm;



