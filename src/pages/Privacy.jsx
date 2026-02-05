// src/pages/Privacy.jsx
// EXPAT VILLAGE - Privacy Policy (GDPR Compliant)

import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

function Privacy() {
  const lastUpdated = 'January 30, 2026'

  return (
    <div className="min-h-screen">
      <section className="py-12 text-center">
        <span className="inline-block glass-chip rounded-full px-5 py-2 text-sm font-semibold text-slate-200 mb-4">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400">Last updated: {lastUpdated}</p>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <div className="glass-panel rounded-2xl p-6 mb-10">
              <h2 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                <Icon name="info" size={16} className="text-slate-200" /> The Short Version
              </h2>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <Icon name="success" size={14} className="text-emerald-200 mt-0.5" />
                  <span>We only collect what we need to make the app work</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="success" size={14} className="text-emerald-200 mt-0.5" />
                  <span>We never sell your personal data to anyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="success" size={14} className="text-emerald-200 mt-0.5" />
                  <span>You can delete your account and data anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="success" size={14} className="text-emerald-200 mt-0.5" />
                  <span>We comply with GDPR and EU data protection laws</span>
                </li>
              </ul>
            </div>

            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">1</span>
                  Introduction
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>
                    Expat Village ("we", "our", or "us") is committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your
                    information when you use our website and services.
                  </p>
                  <p>
                    We are based in Warsaw, Poland and operate under the European Union's General
                    Data Protection Regulation (GDPR). By using our Service, you agree to the
                    collection and use of information in accordance with this policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">2</span>
                  Data We Collect
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                  <p className="font-medium text-white">Personal Data You Provide:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Email address (when you create an account)</li>
                    <li>Display name (optional, chosen by you)</li>
                    <li>Profile information (tribe/interests, if you complete onboarding)</li>
                    <li>Content you create (reviews, comments, checklist progress)</li>
                  </ul>

                  <p className="font-medium text-white mt-4">Data Collected Automatically:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Device information (browser type, operating system)</li>
                    <li>Usage data (pages visited, features used)</li>
                    <li>IP address (for security and analytics)</li>
                    <li>Cookies and similar technologies</li>
                  </ul>

                  <p className="font-medium text-white mt-4">Data We Do NOT Collect:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Payment information (handled securely by Stripe)</li>
                    <li>Government ID numbers</li>
                    <li>Precise geolocation without your consent</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">3</span>
                  How We Use Your Data
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>We use your personal data to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide and maintain our Service</li>
                    <li>Create and manage your account</li>
                    <li>Save your preferences and progress</li>
                    <li>Display your reviews and contributions to the community</li>
                    <li>Send important updates about the Service</li>
                    <li>Respond to your requests and support inquiries</li>
                    <li>Improve our Service based on usage patterns</li>
                    <li>Prevent fraud and ensure security</li>
                  </ul>
                  <p className="text-slate-200 font-medium mt-4">
                    We never sell your personal data to third parties.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">4</span>
                  Legal Basis for Processing (GDPR)
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>Under GDPR, we process your data based on:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><span className="text-white">Contract:</span> Processing necessary to provide our Service</li>
                    <li><span className="text-white">Consent:</span> Where you have given explicit permission</li>
                    <li><span className="text-white">Legitimate Interest:</span> For improving our Service</li>
                    <li><span className="text-white">Legal Obligation:</span> When required by law</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">5</span>
                  Data Sharing
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>We may share your data with:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><span className="text-white">Service Providers:</span> Companies that help us run our Service (hosting, analytics)</li>
                    <li><span className="text-white">Payment Processors:</span> Stripe for handling payments</li>
                    <li><span className="text-white">Legal Requirements:</span> If required by law</li>
                  </ul>
                  <p className="mt-4">Our key service providers:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Supabase (database and authentication) - EU servers</li>
                    <li>Vercel (hosting) - GDPR compliant</li>
                    <li>Groq (AI features) - Data processed per request, not stored</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">6</span>
                  Data Retention
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>We retain your data for as long as:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Your account is active</li>
                    <li>Needed to provide our Service</li>
                    <li>Required by law</li>
                  </ul>
                  <p className="mt-3">
                    When you delete your account, we remove your personal data within 30 days,
                    except where legally required to retain it.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">7</span>
                  Your Rights (GDPR)
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>Under GDPR, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><span className="text-white">Access:</span> Request a copy of your personal data</li>
                    <li><span className="text-white">Rectification:</span> Correct inaccurate data</li>
                    <li><span className="text-white">Erasure:</span> Request deletion ("right to be forgotten")</li>
                    <li><span className="text-white">Portability:</span> Receive your data in a portable format</li>
                    <li><span className="text-white">Restrict Processing:</span> Limit how we use your data</li>
                    <li><span className="text-white">Object:</span> Object to certain processing activities</li>
                    <li><span className="text-white">Withdraw Consent:</span> Revoke consent at any time</li>
                  </ul>
                  <p className="mt-3">
                    To exercise these rights, email us at{' '}
                    <a href="mailto:privacy@expatvillage.com" className="text-slate-200 hover:text-white">
                      privacy@expatvillage.com
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">8</span>
                  Cookies
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>We use cookies for:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><span className="text-white">Essential:</span> Required for the Service to function</li>
                    <li><span className="text-white">Analytics:</span> Understanding how users interact with our Service</li>
                  </ul>
                  <p className="mt-3">
                    You can control cookies through your browser settings.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">9</span>
                  Data Security
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>We protect your data with:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Encryption in transit (HTTPS/TLS)</li>
                    <li>Encryption at rest for sensitive data</li>
                    <li>Regular security audits</li>
                    <li>Access controls and authentication</li>
                    <li>Secure hosting with reputable providers</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">10</span>
                  Children's Privacy
                </h2>
                <div className="text-slate-400 leading-relaxed">
                  <p>
                    Our Service is not intended for children under 16. We do not knowingly
                    collect personal data from children under 16. If you believe we have
                    collected data from a child, please contact us immediately.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">11</span>
                  Changes to This Policy
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you by:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Posting the new policy on this page</li>
                    <li>Updating the "Last updated" date</li>
                    <li>Sending an email for material changes</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 glass-panel rounded-lg flex items-center justify-center text-sm">12</span>
                  Contact Us
                </h2>
                <div className="text-slate-400 space-y-3 leading-relaxed">
                  <p>For privacy-related questions or to exercise your rights:</p>
                  <div className="glass-panel rounded-xl p-6 mt-4">
                    <p className="text-white font-bold mb-2">Expat Village</p>
                    <p>Email: <a href="mailto:privacy@expatvillage.com" className="text-slate-200 hover:text-white">privacy@expatvillage.com</a></p>
                    <p>Location: Warsaw, Poland</p>
                  </div>
                  <p className="text-sm mt-4">
                    If you are not satisfied with our response, you have the right to lodge a
                    complaint with your local Data Protection Authority. In Poland, this is
                    the President of the Personal Data Protection Office (UODO).
                  </p>
                </div>
              </section>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/"
              className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <Icon name="arrowLeft" size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Privacy
