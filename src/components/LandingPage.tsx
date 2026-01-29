import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  BarChart3,
  Users,
  Heart,
  TrendingUp,
  MessageSquare,
  Shield,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Target,
  Zap,
  PieChart
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-slate-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              1-800-REBALANCE
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <Mail className="w-4 h-4" />
              hello@rebalance.io
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-amber-400">Support</a>
            <a href="#" className="hover:text-amber-400">Contact</a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b-4 border-amber-500 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800">Rebalance</span>
                <p className="text-xs text-slate-500 -mt-1">Workforce Wellbeing Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-medium text-slate-700 hover:text-amber-600">Features</a>
              <a href="#how-it-works" className="font-medium text-slate-700 hover:text-amber-600">How It Works</a>
              <a href="#testimonials" className="font-medium text-slate-700 hover:text-amber-600">Testimonials</a>
              <a href="#pricing" className="font-medium text-slate-700 hover:text-amber-600">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="hidden sm:inline-flex border-2 border-slate-300 font-semibold">
                Sign In
              </Button>
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg px-6"
              >
                Free Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-amber-500 text-white px-4 py-2 rounded font-semibold text-sm mb-6 shadow-lg">
                TRUSTED BY 500+ COMPANIES WORLDWIDE
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Empower Your Workforce.
                <span className="text-amber-400 block mt-2">Prevent Burnout.</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Rebalance is the comprehensive employee wellbeing platform that helps HR leaders
                and managers monitor team health, identify stress patterns, and create a
                thriving workplace culture.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-6 font-bold shadow-xl"
                >
                  Request Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-slate-800 text-lg px-8 py-6 font-semibold"
                >
                  Watch Video Tour
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700">
                <div>
                  <p className="text-3xl font-bold text-amber-400">98%</p>
                  <p className="text-slate-400 text-sm">Customer Satisfaction</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">50K+</p>
                  <p className="text-slate-400 text-sm">Employees Supported</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">40%</p>
                  <p className="text-slate-400 text-sm">Reduced Turnover</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-amber-500">
                <img
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=700&h=500&fit=crop"
                  alt="Diverse team of professionals in a meeting"
                  className="w-full"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-5 border-l-4 border-green-500">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">94%</p>
                    <p className="text-sm text-slate-600">Wellness Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 bg-slate-100 border-y-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 font-medium mb-8">TRUSTED BY LEADING ORGANIZATIONS</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            <span className="text-2xl font-bold text-slate-500">Deloitte</span>
            <span className="text-2xl font-bold text-slate-500">Accenture</span>
            <span className="text-2xl font-bold text-slate-500">KPMG</span>
            <span className="text-2xl font-bold text-slate-500">Salesforce</span>
            <span className="text-2xl font-bold text-slate-500">Adobe</span>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=600&h=450&fit=crop"
                alt="Professional woman reviewing reports"
                className="rounded-lg shadow-xl border-4 border-slate-100"
              />
            </div>
            <div>
              <p className="text-amber-600 font-bold text-sm tracking-wider mb-4">THE CHALLENGE</p>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Employee Burnout Costs US Businesses $300 Billion Annually
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Studies show that 76% of employees experience burnout at some point. Yet most
                organizations lack the tools to identify warning signs before it's too late.
              </p>
              <ul className="space-y-4">
                {[
                  'High turnover and recruitment costs',
                  'Decreased productivity and engagement',
                  'Increased absenteeism and health claims',
                  'Damaged team morale and culture'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 font-bold text-sm">!</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 border-y-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-600 font-bold text-sm tracking-wider mb-4">THE SOLUTION</p>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Proactive Wellbeing Management for Modern Organizations
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Rebalance provides weekly pulse surveys that take just 2 minutes to complete.
                Our platform aggregates responses into actionable insights, helping managers
                support their teams before small issues become big problems.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Early warning system for burnout risk',
                  'Anonymous feedback channels',
                  'Real-time dashboards and reporting',
                  'Actionable recommendations'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                onClick={onGetStarted}
                className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-8 py-3"
              >
                See How It Works
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=450&fit=crop"
                alt="Business man and woman collaborating"
                className="rounded-lg shadow-xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-bold text-sm tracking-wider mb-4">PLATFORM FEATURES</p>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Everything You Need to Support Employee Wellbeing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A comprehensive suite of tools designed for HR professionals, team leaders,
              and executives who care about their people.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <PieChart className="w-8 h-8" />,
                title: 'Advanced Analytics',
                description: 'Comprehensive dashboards with trend analysis, heat maps, and predictive insights.',
                color: 'bg-blue-500'
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: 'Anonymous Feedback',
                description: 'Secure channels for employees to share concerns without fear of identification.',
                color: 'bg-green-500'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: '2-Minute Surveys',
                description: 'Quick weekly check-ins that respect employee time while gathering meaningful data.',
                color: 'bg-purple-500'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Trend Monitoring',
                description: 'Track team wellness over time and identify patterns before they become problems.',
                color: 'bg-amber-500'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Enterprise Security',
                description: 'SOC 2 compliant with end-to-end encryption and strict data privacy controls.',
                color: 'bg-red-500'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Smart Alerts',
                description: 'Automated notifications when team metrics indicate potential concerns.',
                color: 'bg-teal-500'
              }
            ].map((feature, index) => (
              <Card key={index} className="border-2 border-slate-200 hover:border-amber-400 transition-colors hover:shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-bold text-sm tracking-wider mb-4">HOW IT WORKS</p>
            <h2 className="text-4xl font-bold mb-4">
              Get Started in Three Simple Steps
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Implementation is quick and easy. Most teams are up and running within a day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Set Up Your Team',
                description: 'Import your employee roster via CSV or integrate with your existing HR system. Customize survey questions to match your organization.',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop'
              },
              {
                step: '02',
                title: 'Collect Insights',
                description: 'Employees receive weekly check-ins via email or Slack. Our intelligent surveys adapt based on previous responses.',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop'
              },
              {
                step: '03',
                title: 'Take Action',
                description: 'Review team dashboards, identify concerns early, and access recommended interventions. Track improvement over time.',
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-lg shadow-xl w-full h-56 object-cover border-4 border-amber-500"
                  />
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-bold text-sm tracking-wider mb-4">TESTIMONIALS</p>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join hundreds of organizations that have transformed their workplace culture with Rebalance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Rebalance helped us reduce turnover by 35% in the first year. The early warning system caught issues we would have missed completely. It's been transformative for our organization.",
                author: "Margaret Chen",
                role: "Chief Human Resources Officer",
                company: "National Healthcare Group",
                image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&h=150&fit=crop&crop=face"
              },
              {
                quote: "As a plant manager, I never had visibility into how my team was really doing. Now I can address problems proactively instead of waiting for someone to quit.",
                author: "Robert Williams",
                role: "Regional Plant Manager",
                company: "Midwest Manufacturing Co.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              },
              {
                quote: "The anonymous feedback feature gave our employees a voice they never had before. The insights have shaped our entire wellness program strategy.",
                author: "Patricia Rodriguez",
                role: "VP of People Operations",
                company: "Financial Services Inc.",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 border-slate-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{testimonial.author}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                      <p className="text-sm text-amber-600 font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Organizations' },
              { value: '50,000+', label: 'Employees Supported' },
              { value: '98%', label: 'Customer Retention' },
              { value: '2 Min', label: 'Average Survey Time' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">{stat.value}</p>
                <p className="text-slate-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join the growing number of organizations using Rebalance to build healthier,
            more engaged, and more productive teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-slate-800 hover:bg-slate-900 text-white text-lg px-10 py-6 font-bold shadow-xl"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-amber-600 text-lg px-10 py-6 font-semibold"
            >
              Schedule a Demo
            </Button>
          </div>
          <p className="text-amber-100 mt-6">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">Rebalance</span>
                  <p className="text-xs text-slate-400">Workforce Wellbeing Platform</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-sm">
                Empowering organizations to build healthier, happier, and more productive workplaces through data-driven insights.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.374-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-amber-400">Features</a></li>
                <li><a href="#" className="hover:text-amber-400">Pricing</a></li>
                <li><a href="#" className="hover:text-amber-400">Integrations</a></li>
                <li><a href="#" className="hover:text-amber-400">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-amber-400">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400">Careers</a></li>
                <li><a href="#" className="hover:text-amber-400">Blog</a></li>
                <li><a href="#" className="hover:text-amber-400">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-amber-400">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-amber-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 Rebalance Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                SOC 2 Certified
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
