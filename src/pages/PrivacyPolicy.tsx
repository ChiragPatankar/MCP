import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600">Last updated: {lastUpdated}</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900">Your Privacy Matters</h3>
                  <p className="text-green-800 text-sm mt-1">
                    We are committed to protecting your personal information and being transparent about how we use it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="h-6 w-6 text-primary-500 mr-2" />
              1. Introduction
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Micro-Mentor Inc. ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy applies to all information collected through our Service and any related services, sales, marketing, or events.
              </p>
            </div>
          </section>

          {/* Section 2: Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="h-6 w-6 text-primary-500 mr-2" />
              2. Information We Collect
            </h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information you provide directly to us, such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Profile information (professional background, expertise, bio)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Session feedback and ratings</li>
                <li>Communications with us and other users</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Location information (general geographic location)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Session Data</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Session recordings (for paid subscribers only)</li>
                <li>Session metadata (duration, participants, timestamps)</li>
                <li>Call quality metrics</li>
              </ul>
            </div>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Provision</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Create and manage your account</li>
                    <li>Facilitate mentoring sessions</li>
                    <li>Process payments</li>
                    <li>Provide customer support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Improvement & Analytics</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Improve our AI matching algorithm</li>
                    <li>Analyze usage patterns</li>
                    <li>Develop new features</li>
                    <li>Ensure platform security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Send service notifications</li>
                    <li>Provide session reminders</li>
                    <li>Share platform updates</li>
                    <li>Respond to inquiries</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal & Safety</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Comply with legal obligations</li>
                    <li>Prevent fraud and abuse</li>
                    <li>Enforce our terms of service</li>
                    <li>Protect user safety</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 text-primary-500 mr-2" />
              4. How We Share Your Information
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">With Other Users</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Profile information visible to potential mentors/mentees</li>
                <li>Session feedback and ratings</li>
                <li>Professional background and expertise</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">With Service Providers</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Payment processing (Stripe)</li>
                <li>Payment processing (Razorpay). For details on how your payment information is handled, please review the <a href="https://merchant.razorpay.com/policy/QapbNR8UgJHzCW/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">Razorpay Privacy Policy</a>.</li>
                <li>Video calling infrastructure</li>
                <li>Email and notification services</li>
                <li>Analytics and monitoring tools</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>
            </div>
          </section>

          {/* Section 5: Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="h-6 w-6 text-primary-500 mr-2" />
              5. Data Security
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Measures</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>SSL/TLS encryption</li>
                    <li>Secure data centers</li>
                    <li>Regular security audits</li>
                    <li>Access controls and monitoring</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Organizational Measures</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Employee training</li>
                    <li>Data minimization practices</li>
                    <li>Incident response procedures</li>
                    <li>Regular policy reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Access & Portability</h4>
                  <p className="text-gray-700 text-sm">Request a copy of your personal data and receive it in a portable format.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Correction</h4>
                  <p className="text-gray-700 text-sm">Update or correct inaccurate personal information.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Deletion</h4>
                  <p className="text-gray-700 text-sm">Request deletion of your personal data (subject to legal requirements).</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Opt-out</h4>
                  <p className="text-gray-700 text-sm">Unsubscribe from marketing communications at any time.</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@micro-mentor.app. We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* Section 7: Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Essential Cookies</h4>
                    <p className="text-gray-700 text-sm">Required for basic site functionality and security.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Analytics Cookies</h4>
                    <p className="text-gray-700 text-sm">Help us understand how you use our service to improve it.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Preference Cookies</h4>
                    <p className="text-gray-700 text-sm">Remember your settings and preferences.</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookies through your browser settings, but disabling certain cookies may affect functionality.
              </p>
            </div>
          </section>

          {/* Section 8: International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="h-6 w-6 text-primary-500 mr-2" />
              8. International Data Transfers
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>Adequacy decisions for certain countries</li>
                <li>Certification schemes and codes of conduct</li>
                <li>Binding corporate rules for intra-group transfers</li>
              </ul>
            </div>
          </section>

          {/* Section 9: Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Account Information:</strong> Until you delete your account plus 30 days</li>
                <li><strong>Session Data:</strong> 2 years for analytics and improvement purposes</li>
                <li><strong>Payment Records:</strong> 7 years for tax and legal compliance</li>
                <li><strong>Support Communications:</strong> 3 years for quality assurance</li>
              </ul>
            </div>
          </section>

          {/* Section 10: Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <div className="prose prose-gray max-w-none">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-medium">
                  Our Service is not intended for children under 18 years of age.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </div>
          </section>

          {/* Section 11: Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Sending you an email notification</li>
                <li>Providing an in-app notification</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Changes become effective immediately upon posting unless otherwise specified.
              </p>
            </div>
          </section>

          {/* Section 12: Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">General Inquiries</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li><strong>Email:</strong> privacy@micro-mentor.app</li>
                      <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li><strong>Email:</strong> dpo@micro-mentor.app</li>
                      <li><strong>Address:</strong> 123 Innovation Drive<br />San Francisco, CA 94105</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            This Privacy Policy is effective as of {lastUpdated} and will remain in effect except with respect to any changes in its provisions in the future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;