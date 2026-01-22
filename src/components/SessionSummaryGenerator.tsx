import React, { useState, useEffect } from 'react';
import { Brain, FileText, CheckCircle, Clock, Target, MessageSquare, Download, Share2 } from 'lucide-react';

interface SessionData {
  id: string;
  duration: number;
  participants: {
    mentor: { name: string; title: string };
    mentee: { name: string; title: string };
  };
  topic: string;
  transcript?: string[];
  keyMoments?: Array<{
    timestamp: number;
    type: 'insight' | 'action' | 'question';
    content: string;
  }>;
}

interface GeneratedSummary {
  overview: string;
  keyTopics: string[];
  insights: string[];
  actionItems: string[];
  nextSteps: string[];
  resources: string[];
}

interface SessionSummaryGeneratorProps {
  sessionData: SessionData;
  onSummaryGenerated: (summary: GeneratedSummary) => void;
}

const SessionSummaryGenerator: React.FC<SessionSummaryGeneratorProps> = ({
  sessionData,
  onSummaryGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<GeneratedSummary | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    generateSummary();
  }, [sessionData]);

  const generateSummary = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate AI processing steps
      const steps = [
        { name: 'Analyzing transcript...', duration: 1000 },
        { name: 'Identifying key topics...', duration: 800 },
        { name: 'Extracting insights...', duration: 1200 },
        { name: 'Generating action items...', duration: 900 },
        { name: 'Finalizing summary...', duration: 600 }
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        setGenerationProgress(((i + 1) / steps.length) * 100);
      }

      // Generate mock summary based on session data
      const generatedSummary: GeneratedSummary = {
        overview: `This ${Math.floor(sessionData.duration / 60)}-minute session between ${sessionData.participants.mentor.name} and ${sessionData.participants.mentee.name} focused on ${sessionData.topic.toLowerCase()}. The conversation covered strategic approaches, practical implementation steps, and specific challenges faced in the current role.`,
        
        keyTopics: [
          sessionData.topic,
          'Strategic Planning',
          'Implementation Tactics',
          'Performance Metrics',
          'Team Dynamics'
        ],
        
        insights: [
          'Focus on user research before making product decisions to ensure market fit',
          'Implement weekly 1:1s with team members to improve communication and alignment',
          'Use OKRs (Objectives and Key Results) for better goal setting and tracking',
          'Consider A/B testing for feature validation before full rollout',
          'Establish clear success metrics for each initiative'
        ],
        
        actionItems: [
          'Schedule user interviews with 5-10 customers by next Friday',
          'Set up weekly 1:1 calendar invites with all direct reports',
          'Draft Q2 OKRs and share with team for feedback by end of week',
          'Research A/B testing tools and create implementation plan',
          'Define success metrics for current project and establish tracking dashboard'
        ],
        
        nextSteps: [
          'Follow up with mentor in 2 weeks to review progress on action items',
          'Book another session to discuss OKR implementation results',
          'Share user research findings with the team',
          'Schedule team meeting to align on new processes'
        ],
        
        resources: [
          'Book: "Inspired" by Marty Cagan for product management best practices',
          'Article: "The Ultimate Guide to OKRs" by First Round Review',
          'Tool: Mixpanel or Amplitude for product analytics',
          'Template: 1:1 meeting agenda template',
          'Course: "User Research Methods" on Coursera'
        ]
      };

      setSummary(generatedSummary);
      onSummaryGenerated(generatedSummary);
      setIsGenerating(false);

    } catch (error) {
      console.error('Error generating summary:', error);
      setIsGenerating(false);
    }
  };

  const downloadSummary = () => {
    if (!summary) return;

    const summaryText = `
SESSION SUMMARY
===============

Session Details:
- Duration: ${Math.floor(sessionData.duration / 60)} minutes
- Mentor: ${sessionData.participants.mentor.name} (${sessionData.participants.mentor.title})
- Mentee: ${sessionData.participants.mentee.name} (${sessionData.participants.mentee.title})
- Topic: ${sessionData.topic}
- Date: ${new Date().toLocaleDateString()}

OVERVIEW
--------
${summary.overview}

KEY TOPICS DISCUSSED
-------------------
${summary.keyTopics.map(topic => `• ${topic}`).join('\n')}

KEY INSIGHTS
------------
${summary.insights.map(insight => `• ${insight}`).join('\n')}

ACTION ITEMS
------------
${summary.actionItems.map(item => `• ${item}`).join('\n')}

NEXT STEPS
----------
${summary.nextSteps.map(step => `• ${step}`).join('\n')}

RECOMMENDED RESOURCES
--------------------
${summary.resources.map(resource => `• ${resource}`).join('\n')}

Generated by Micro-Mentor AI Summary System
    `.trim();

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-summary-${sessionData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareSummary = async () => {
    if (!summary) return;

    const shareText = `Just completed a great mentoring session on ${sessionData.topic}! Key takeaways: ${summary.insights.slice(0, 2).join(', ')}. #mentoring #growth`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Session Summary',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Summary copied to clipboard!');
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="bg-primary-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-primary-500 animate-pulse" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Generating AI Summary
          </h3>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing your session to create a comprehensive summary
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500">
            {generationProgress.toFixed(0)}% complete
          </p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Unable to generate summary</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI-Generated Summary</h3>
              <p className="text-gray-600">Comprehensive analysis of your session</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={downloadSummary}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Download Summary"
            >
              <Download className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={shareSummary}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Share Summary"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Overview */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary-500" />
            Session Overview
          </h4>
          <p className="text-gray-700 leading-relaxed">{summary.overview}</p>
        </div>

        {/* Key Topics */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
            Key Topics Discussed
          </h4>
          <div className="flex flex-wrap gap-2">
            {summary.keyTopics.map((topic, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Key Insights
          </h4>
          <ul className="space-y-3">
            {summary.insights.map((insight, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2 text-orange-500" />
            Action Items
          </h4>
          <ul className="space-y-3">
            {summary.actionItems.map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-4 h-4 border-2 border-orange-500 rounded mt-1 flex-shrink-0"></div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-500" />
            Next Steps
          </h4>
          <ul className="space-y-2">
            {summary.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Resources */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-500" />
            Recommended Resources
          </h4>
          <ul className="space-y-2">
            {summary.resources.map((resource, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Generated by Micro-Mentor AI</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SessionSummaryGenerator;