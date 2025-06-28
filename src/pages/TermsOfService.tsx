import React from 'react';
import { ArrowLeft, FileText, Shield, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  const lastUpdated = 'December 15, 2024';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-600">Last updated: {lastUpdated}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Important Notice</h3>
                  <p className="text-blue-800 text-sm mt-1">
                    By using Micro-Mentor, you agree to these terms. Please read them carefully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Section 1: Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 text-primary-500 mr-2" />
              1. Acceptance of Terms
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Micro-Mentor ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website, mobile application, and services (collectively, the "Service") operated by Micro-Mentor Inc.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </div>
          </section>

          {/* Section 2: Description of Service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 text-primary-500 mr-2" />
              2. Description of Service
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Micro-Mentor is a platform that connects individuals seeking professional advice ("Mentees") with industry experts ("Mentors") for short, focused mentoring sessions.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Service includes:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>AI-powered matching between Mentees and Mentors</li>
                <li>Video calling functionality for mentoring sessions</li>
                <li>Payment processing for session fees</li>
                <li>Session scheduling and management tools</li>
                <li>Profile creation and management</li>
                <li>Rating and review systems</li>
              </ul>
            </div>
          </section>

          {/* Section 3: User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use certain features of our Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Security</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Termination</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </div>
          </section>

          {/* Section 4: User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Transmit any harmful, threatening, abusive, or defamatory content</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Use the Service for any commercial purpose without our consent</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share inappropriate or offensive content during sessions</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Mentoring Sessions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Mentoring Sessions</h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Guidelines</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Sessions are limited to 5 minutes in duration</li>
                <li>All sessions must be conducted professionally and respectfully</li>
                <li>Recording of sessions is only available to paid subscribers</li>
                <li>Cancellations must be made at least 1 hour before the scheduled time</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mentor Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Provide accurate information about expertise and experience</li>
                <li>Maintain professionalism during all interactions</li>
                <li>Be punctual for scheduled sessions</li>
                <li>Provide helpful and constructive advice</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mentee Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Come prepared with specific questions or topics</li>
                <li>Be respectful of the mentor's time and expertise</li>
                <li>Pay session fees promptly</li>
                <li>Provide honest feedback and ratings</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Fees</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Mentors set their own rates for sessions, typically ranging from $2-5 per 5-minute session. All fees are clearly displayed before booking.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Plans</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer various subscription plans that provide credits for sessions and additional features. Subscription fees are billed monthly or annually as selected.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Refunds</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Refunds may be provided at our discretion for technical issues or mentor no-shows. Subscription refunds are prorated for unused time.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Processing</h3>
              <p className="text-gray-700 leading-relaxed">
                All payments are processed securely through Stripe. We do not store your payment information on our servers.
              </p>
            </div>
          </section>

          {/* Section 7: Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Micro-Mentor Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You retain ownership of any content you submit to the Service, but you grant us a license to use, modify, and display such content in connection with the Service.
              </p>
            </div>
          </section>

          {/* Section 8: Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
              <Link 
                to="/privacy" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Read our Privacy Policy →
              </Link>
            </div>
          </section>

          {/* Section 9: Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers</h2>
            <div className="prose prose-gray max-w-none">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium">
                  The information provided through our Service is for general informational purposes only and should not be considered as professional advice for specific situations.
                </p>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We do not guarantee the accuracy or completeness of advice provided by mentors</li>
                <li>Mentors are independent contractors, not employees of Micro-Mentor</li>
                <li>We are not responsible for the quality or outcomes of mentoring sessions</li>
                <li>The Service is provided "as is" without warranties of any kind</li>
              </ul>
            </div>
          </section>

          {/* Section 10: Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                In no event shall Micro-Mentor Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability to you for all claims arising from or relating to the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
              </p>
            </div>
          </section>

          {/* Section 11: Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700 leading-relaxed">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>
          </section>

          {/* Section 12: Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="text-gray-700 space-y-2">
                  <li><strong>Email:</strong> legal@micro-mentor.app</li>
                  <li><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            These terms are effective as of {lastUpdated} and will remain in effect except with respect to any changes in their provisions in the future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;