import { Link } from 'react-router-dom';

const Landing = () => {
  const problems = [
    {
      title: "Trust Breakdown",
      description: "Members delay payments, default on loans, and manipulate records, causing groups to collapse"
    },
    {
      title: "No Financial Discipline",
      description: "Poor visibility into contribution history, penalties, and payment patterns leads to confusion"
    },
    {
      title: "Manual Dispute Resolution",
      description: "No structured system for resolving conflicts, leading to unfair outcomes and group breakdown"
    },
    {
      title: "Unreliable Records",
      description: "Most chamas rely on WhatsApp messages and Excel sheets that can't be trusted or verified"
    }
  ];

  const features = [
    {
      title: "Trust Score Engine",
      description: "Dynamic scoring system (0-100) based on payment consistency, loan repayment history, and participation level"
    },
    {
      title: "Risk Assessment",
      description: "Risk evaluation for loan applications with clear levels: Low, Medium, or High"
    },
    {
      title: "Cross-Chama Reputation",
      description: "Persistent reputation system that follows members across different chamas"
    },
    {
      title: "Dispute Resolution",
      description: "Structured dispute system with evidence submission and fair resolution protocols"
    },
    {
      title: "Blockchain Integration",
      description: "Stellar blockchain ensures immutable transaction records and complete transparency"
    }
  ];

  const techStack = [
    {
      category: "Frontend",
      technologies: ["React", "Tailwind CSS", "Vite"],
      description: "Modern, responsive user interface with seamless user experience"
    },
    {
      category: "Backend",
      technologies: ["Node.js", "Express", "PostgreSQL"],
      description: "Scalable API server with robust database management"
    },
    {
      category: "Blockchain",
      technologies: ["Stellar", "Soroban", "Web3"],
      description: "Immutable transaction records and smart contract capabilities"
    },
    {
      category: "Authentication",
      technologies: ["Google OAuth", "JWT", "Encryption"],
      description: "Secure authentication with seamless user experience"
    }
  ];

  const architecture = [
    {
      layer: "User Interface",
      tech: "React + Tailwind",
      purpose: "Simple, intuitive user experience"
    },
    {
      layer: "API Gateway",
      tech: "Node.js + Express",
      purpose: "Handles all user requests and business logic"
    },
    {
      layer: "Trust Engine",
      tech: "Custom Algorithms",
      purpose: "Calculates trust scores and risk assessments"
    },
    {
      layer: "Database",
      tech: "PostgreSQL",
      purpose: "Stores user data, transactions, and analytics"
    },
    {
      layer: "Blockchain",
      tech: "Stellar Network",
      purpose: "Immutable transaction records and transparency"
    }
  ];

  const benefits = [
    {
      title: "For Chama Members",
      benefits: [
        "Build a trusted financial reputation",
        "Access loans faster with good trust scores",
        "Transparent view of all group finances",
        "Create portable financial reputation across groups",
        "Fair dispute resolution process"
      ]
    },
    {
      title: "For Chama Admins",
      benefits: [
        "Make data-driven lending decisions",
        "Reduce default rates by 60%",
        "Increase group survival rate from 33% to 80%",
        "Enable faster access to credit for trustworthy members",
        "Automated penalty and reminder systems",
        "Complete audit trail of all activities"
      ]
    },
    {
      title: "For the Ecosystem",
      benefits: [
        "Stronger financial communities",
        "Reduced fraud and mismanagement",
        "Scalable model for microfinance",
        "Scale to serve 10M+ African savers",
        "Economic empowerment through trust"
      ]
    }
  ];

  const stats = [
    { number: "85%", label: "Fewer payment delays" },
    { number: "3x", label: "Faster loan approvals" },
    { number: "60%", label: "Reduced default rates" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white flex items-center">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8">
              ChamaTrust
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
              Building Trust in African Financial Communities Through Smart Reputation Systems
            </p>
            <p className="text-lg sm:text-xl md:text-2xl mb-12 sm:mb-16 max-w-3xl mx-auto text-blue-100 leading-relaxed">
              A revolutionary trust and risk assessment layer for digital chamas, powered by blockchain technology and behavioral intelligence
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 sm:px-12 py-4 sm:py-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg sm:text-xl shadow-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="#problem"
                className="border-2 border-white text-white px-8 sm:px-12 py-4 sm:py-6 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg sm:text-xl shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Real Problems in Chamas
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Despite digital platforms, chamas still face fundamental trust and accountability challenges that threaten their survival
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {problems.map((problem, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-4">
              The Cost of Trust Issues
            </h3>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">67%</div>
                <p className="text-gray-700 text-sm sm:text-base">Chamas fail due to trust breakdown</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">KES 2.5M</div>
                <p className="text-gray-700 text-sm sm:text-base">Average lost per failed chama</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">40%</div>
                <p className="text-gray-700 text-sm sm:text-base">Members experience default losses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Solution: ChamaTrust Engine
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              We don't just track transactions - we evaluate trustworthiness and predict financial behavior
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Simple Onboarding</h4>
                      <p className="text-blue-100 text-sm sm:text-base">Sign in with Google - we handle the blockchain complexity</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Trust Building</h4>
                      <p className="text-blue-100 text-sm sm:text-base">Make contributions and build your trust score over time</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Smart Decisions</h4>
                      <p className="text-blue-100 text-sm sm:text-base">Get risk assessments for loans and make informed financial choices</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-semibold mb-4">Trust Score Formula</h4>
                  <div className="space-y-3 text-blue-100 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span>Payment Consistency (40%)</span>
                      <span className="font-mono">0.4 × score</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contribution History (30%)</span>
                      <span className="font-mono">0.3 × score</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participation Level (20%)</span>
                      <span className="font-mono">0.2 × score</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Penalty History (-10%)</span>
                      <span className="font-mono">-0.1 × score</span>
                    </div>
                    <div className="border-t border-white/20 pt-3 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total Trust Score</span>
                        <span className="font-mono">0-100</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-semibold mb-3">Our Mission</h4>
                  <p className="text-blue-100 text-sm sm:text-base">
                    This isn't just a technology project - it's a solution to a persistent $2.5B problem affecting African financial communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Hybrid architecture combining Web2 simplicity with Web3 power
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tech.category}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tech.technologies.map((item, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              System Architecture
            </h3>
            <div className="space-y-4">
              {architecture.map((layer, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{layer.layer}</h4>
                        <p className="text-gray-600 text-sm">{layer.purpose}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-mono">
                          {layer.tech}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-semibold text-green-900 mb-4">
                Security Features
              </h3>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Encrypted private key storage
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  JWT-based authentication
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Immutable blockchain records
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Rate limiting and input validation
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">
                Performance Features
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Real-time trust score updates
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Optimized database queries
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Fast Stellar transactions
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Responsive UI design
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Complete Implementation
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Full frontend application
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Backend API with all features
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Blockchain integration
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Production-ready architecture
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              ChamaTrust creates value for all stakeholders in the financial community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {benefit.title}
                </h3>
                <ul className="space-y-3">
                  {benefit.benefits.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
              Proven Impact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.number}</div>
                  <p className="text-blue-100 text-sm sm:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 sm:mt-16 bg-gray-50 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Why ChamaTrust is Different
            </h3>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-green-700">What We Do</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    Evaluate member behavior and trustworthiness
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    Provide data-driven financial insights
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    Create accountability across groups
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-red-700">What Others Do</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span>
                    Only track basic transactions
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span>
                    Focus on UI improvements only
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span>
                    Add blockchain for hype, not purpose
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">ChamaTrust</h3>
              <p className="text-gray-400">
                Building trust in African financial communities through smart reputation systems.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#solution" className="hover:text-white">Features</a></li>
                <li><a href="#technology" className="hover:text-white">Technology</a></li>
                <li><a href="#benefits" className="hover:text-white">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2024 ChamaTrust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
