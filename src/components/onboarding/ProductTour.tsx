import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Sparkles,
  Bot,
  Upload,
  Users,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // CSS selector to highlight
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    path?: string;
  };
}

interface ProductTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ClientSphere! 🎉',
    description: 'Your AI-powered customer support platform is ready. Let me show you around and help you get started in just a few steps.',
    icon: <Sparkles className="w-8 h-8" />,
    position: 'center'
  },
  {
    id: 'knowledge-base',
    title: 'Build Your Knowledge Base',
    description: 'Upload documents, PDFs, or add website URLs. Your AI chatbot will learn from this content to provide accurate answers to your customers.',
    icon: <FileText className="w-8 h-8" />,
    action: {
      label: 'Go to Knowledge Base',
      path: '/knowledge-base'
    }
  },
  {
    id: 'chatbot',
    title: 'Test Your AI Chatbot',
    description: 'Once you\'ve added content, test your chatbot in the Live Chat section. See how it responds to questions based on your knowledge base.',
    icon: <Bot className="w-8 h-8" />,
    action: {
      label: 'Try Live Chat',
      path: '/live-chat'
    }
  },
  {
    id: 'widget',
    title: 'Customize Your Widget',
    description: 'Personalize the chat widget\'s appearance to match your brand. Choose colors, set welcome messages, and configure behavior.',
    icon: <Settings className="w-8 h-8" />,
    action: {
      label: 'Customize Widget',
      path: '/widget'
    }
  },
  {
    id: 'analytics',
    title: 'Track Performance',
    description: 'Monitor conversations, customer satisfaction, and chatbot performance. Use insights to improve your support quality.',
    icon: <BarChart3 className="w-8 h-8" />,
    action: {
      label: 'View Analytics',
      path: '/analytics'
    }
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'Start by uploading your first document to the Knowledge Base. Your AI chatbot will be ready to help your customers in minutes!',
    icon: <CheckCircle className="w-8 h-8" />,
    action: {
      label: 'Start Building',
      path: '/knowledge-base'
    }
  }
];

const ProductTour: React.FC<ProductTourProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const step = tourSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    if (step.action?.path) {
      navigate(step.action.path);
    }
  };

  const handleActionClick = () => {
    if (step.action?.path) {
      onComplete();
      navigate(step.action.path);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === 'Escape') {
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const getGradient = (index: number) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-amber-500',
      'from-indigo-500 to-purple-500',
      'from-rose-500 to-pink-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onSkip}
      />

      {/* Tour card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress indicator */}
        <div className="absolute top-4 left-4 flex gap-1.5 z-20">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-6 bg-purple-500' 
                  : index < currentStep 
                    ? 'w-1.5 bg-purple-300' 
                    : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Icon section */}
        <div className={`bg-gradient-to-br ${getGradient(currentStep)} p-8 pt-12`}>
          <motion.div
            key={currentStep}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white mx-auto"
          >
            {step.icon}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex items-center justify-between">
          <div>
            {currentStep > 0 ? (
              <Button
                variant="ghost"
                onClick={prevStep}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Skip tour
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {step.action && currentStep < tourSteps.length - 1 && (
              <Button
                variant="outline"
                onClick={handleActionClick}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                {step.action.label}
              </Button>
            )}
            
            <Button
              onClick={nextStep}
              className={`bg-gradient-to-r ${getGradient(currentStep)} text-white px-5 hover:opacity-90`}
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <Zap className="w-4 h-4 mr-1" />
                  {step.action?.label || 'Get Started'}
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-gray-400">
            Use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">←</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">→</kbd> to navigate • <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">Esc</kbd> to skip
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductTour;



