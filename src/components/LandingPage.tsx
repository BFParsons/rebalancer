import { useState } from 'react';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Heart,
  Layout,
  Menu,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  X,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Send,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyles =
    'px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-teal-800 text-white hover:bg-teal-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-teal-900 border border-teal-200 hover:border-teal-400 hover:bg-teal-50',
    outline: 'border-2 border-white text-white hover:bg-white/10',
    ghost: 'text-slate-600 hover:text-teal-800 hover:bg-slate-100/50',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SectionHeading = ({
  title,
  subtitle,
  centered = true,
}: {
  title: string;
  subtitle: string;
  centered?: boolean;
}) => (
  <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h2>
    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
  </div>
);

const MockDashboardCard = () => (
  <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-sm mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500">
    <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
      <span className="font-semibold text-slate-700">Team Capacity</span>
      <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center gap-1">
        <AlertTriangle size={12} /> High Risk
      </span>
    </div>
    <div className="p-5 space-y-4">
      {[
        { name: 'Sarah J.', load: 92, color: 'bg-red-500' },
        { name: 'Marcus T.', load: 85, color: 'bg-amber-500' },
        { name: 'Elena R.', load: 45, color: 'bg-teal-500' },
      ].map((person, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-700 font-medium">{person.name}</span>
            <span className="text-slate-500">{person.load}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${person.color} rounded-full`}
              style={{ width: `${person.load}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-teal-50 p-3 text-center border-t border-teal-100">
      <p className="text-xs text-teal-800 font-medium">
        Recommendation: Shift 2 tasks from Sarah to Elena
      </p>
    </div>
  </div>
);

const MockSurveyCard = () => (
  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-xs mx-auto transform -rotate-2 hover:rotate-0 transition-transform duration-500 relative z-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1573496359-0933d276c273?auto=format&fit=crop&q=80&w=100&h=100"
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <div className="text-xs text-slate-500">Weekly Check-in</div>
        <div className="text-sm font-semibold text-slate-900">How is your workload?</div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-600 transition-colors">
        Manageable
      </div>
      <div className="p-3 border border-teal-500 bg-teal-50 rounded-lg cursor-pointer text-sm text-teal-900 font-medium shadow-sm">
        I'm feeling overwhelmed
      </div>
      <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-600 transition-colors">
        I need more work
      </div>
    </div>
  </div>
);

interface DemoResult {
  riskLevel: string;
  riskColor: string;
  sentiment: string;
  draftResponse: string;
  actionItem: string;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [demoInput, setDemoInput] = useState(
    "I'm trying to keep up, but the Q3 deadline is really tight. I skipped lunch twice this week to make progress."
  );
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAnalyze = async () => {
    if (!demoInput.trim()) return;
    setIsAnalyzing(true);
    setDemoError(null);
    setDemoResult(null);

    // Simulate AI analysis for demo purposes
    setTimeout(() => {
      setDemoResult({
        riskLevel: 'High',
        riskColor: 'red',
        sentiment: 'Anxious but Committed',
        draftResponse:
          "I appreciate you sharing this with me. Let's find time this week to discuss how we can better support you with the Q3 deadline.",
        actionItem: 'Schedule a 1:1 meeting within 24 hours',
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const resetDemo = () => {
    setDemoResult(null);
    setDemoInput(
      "I'm trying to keep up, but the Q3 deadline is really tight. I skipped lunch twice this week to make progress."
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-teal-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-teal-800 p-1.5 rounded-lg">
                <Activity className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-teal-900 tracking-tight">Rebalance</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-slate-600 hover:text-teal-800 font-medium text-sm">
                How it Works
              </a>
              <a href="#features" className="text-slate-600 hover:text-teal-800 font-medium text-sm">
                Features
              </a>
              <a href="#ai-demo" className="text-teal-700 font-medium text-sm flex items-center gap-1">
                <Sparkles size={14} /> AI Copilot
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-teal-800 font-medium text-sm">
                Testimonials
              </a>
              <Button variant="ghost" onClick={onGetStarted}>
                Log In
              </Button>
              <Button onClick={onGetStarted}>Try Demo</Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-slate-600 hover:text-teal-900 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a
                href="#how-it-works"
                className="block px-3 py-2 text-slate-600 font-medium"
                onClick={toggleMenu}
              >
                How it Works
              </a>
              <a href="#features" className="block px-3 py-2 text-slate-600 font-medium" onClick={toggleMenu}>
                Features
              </a>
              <a
                href="#ai-demo"
                className="block px-3 py-2 text-teal-700 font-medium flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Sparkles size={16} /> AI Copilot
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-slate-600 font-medium"
                onClick={toggleMenu}
              >
                Testimonials
              </a>
              <div className="pt-4 flex flex-col gap-3">
                <Button variant="secondary" className="w-full justify-center" onClick={onGetStarted}>
                  Log In
                </Button>
                <Button className="w-full justify-center" onClick={onGetStarted}>
                  Try Demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-gradient-to-br from-teal-50/50 via-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-teal-100/50 border border-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
                Now available for enterprise teams
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
                Your Team's Wellbeing,{' '}
                <span className="text-teal-800">Measured and Managed.</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-lg">
                Prevent burnout before it happens. Rebalance gives managers real-time visibility into
                workload capacity so you can support your people and deliver on time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="h-14 px-8 text-lg shadow-teal-900/10" onClick={onGetStarted}>
                  Start Your Free Trial
                </Button>
                <Button variant="secondary" className="h-14 px-8 text-lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  See How It Works
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                    >
                      <img src={`https://randomuser.me/api/portraits/thumb/men/${i + 20}.jpg`} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Trusted by 500+ forward-thinking companies</p>
              </div>
            </div>

            {/* Hero Visuals */}
            <div className="relative hidden lg:block h-[500px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-100/30 rounded-full blur-3xl -z-10"></div>
              <div className="absolute top-10 right-10 z-20 transition-all duration-700 hover:scale-105">
                <MockDashboardCard />
              </div>
              <div className="absolute bottom-20 left-10 z-30 transition-all duration-700 hover:scale-105">
                <MockSurveyCard />
              </div>
              <div className="absolute top-0 right-0 p-4 bg-white rounded-2xl shadow-lg animate-bounce">
                <Heart className="text-rose-500 fill-rose-500" size={24} />
              </div>
              <div className="absolute bottom-40 right-20 bg-white/80 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-100 max-w-[200px]">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Retention Rate
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-slate-900">96%</span>
                  <span className="text-sm font-medium text-emerald-600 mb-1 flex items-center">
                    <TrendingUp size={14} className="mr-0.5" /> +12%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Empowering teams across industries
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 grayscale opacity-60">
            {['Acme Healthcare', 'Summit Logistics', 'Apex Finance', 'Global Retail', 'North Mfg'].map(
              (company) => (
                <span key={company} className="text-xl font-bold text-slate-800 font-serif italic">
                  {company}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="The Hidden Cost of Overwork"
            subtitle="Good managers want to help, but they often lack the visibility to act before it's too late. The result is costly for everyone."
          />
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-600 group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Silent Burnout</h3>
              <p className="text-slate-600">
                High performers often suffer in silence until they suddenly quit. You lose your best talent
                without warning.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600 group-hover:scale-110 transition-transform">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Capacity Blindspots</h3>
              <p className="text-slate-600">
                Without data, work distribution is a guessing game. Some drown in work while others have
                bandwidth.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-600 group-hover:scale-110 transition-transform">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Honesty Gap</h3>
              <p className="text-slate-600">
                Employees fear speaking up about stress in face-to-face meetings. Critical issues go
                unreported.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000"
                alt="Manager reviewing dashboard"
                className="rounded-2xl shadow-2xl z-10 relative"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg z-20 max-w-xs hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Workload Rebalanced</p>
                    <p className="text-sm text-slate-500">Team health score up 15%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">See the signal, not the noise.</h2>
              <p className="text-lg text-slate-600 mb-8">
                Rebalance replaces gut feelings with data. We aggregate simple weekly check-ins into a
                powerful dashboard that highlights who needs help and who can step up.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <Clock className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">2-Minute Weekly Pulse</h4>
                    <p className="text-slate-600">
                      Surveys so simple your team will actually complete them. No login required.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <ShieldCheck className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Psychological Safety First</h4>
                    <p className="text-slate-600">
                      Anonymous feedback channels allow employees to voice concerns without fear.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <Layout className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Actionable Resource Planning</h4>
                    <p className="text-slate-600">
                      Identify bottlenecks instantly and redistribute tasks to keep the team moving
                      sustainably.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <button onClick={onGetStarted} className="text-teal-800 font-bold flex items-center hover:underline">
                  Explore all features <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section id="ai-demo" className="py-24 bg-gradient-to-b from-white to-teal-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wide">
              <Sparkles size={12} /> AI-Powered Insights
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Experience the AI Manager Copilot
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't just collect feedback—understand it. See how Rebalance AI instantly analyzes check-ins
              to spot burnout risks and suggest actions.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs font-mono text-slate-400">rebalance_ai_preview</div>
            </div>

            <div className="p-6 md:p-8 grid gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Employee Check-in Feedback
                </label>
                <div className="relative">
                  <textarea
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-none text-slate-600 bg-slate-50"
                    placeholder="Paste a sample check-in here..."
                  />
                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={() =>
                        setDemoInput(
                          "I'm trying to keep up, but the Q3 deadline is really tight. I skipped lunch twice this week to make progress."
                        )
                      }
                      className="text-xs text-teal-600 hover:underline"
                    >
                      Use Sample
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !demoInput}
                    className={`w-full md:w-auto ${isAnalyzing ? 'opacity-80 cursor-wait' : ''}`}
                  >
                    {isAnalyzing ? (
                      <>
                        Processing
                        <RefreshCw className="animate-spin ml-2" size={18} />
                      </>
                    ) : (
                      <>Analyze Check-in</>
                    )}
                  </Button>
                </div>
              </div>

              {demoError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">{demoError}</div>
              )}

              {demoResult && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-t border-slate-100 pt-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                      AI Analysis Result
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="text-xs text-slate-500 mb-1">Detected Risk Level</div>
                          <div
                            className={`text-xl font-bold flex items-center gap-2 ${
                              demoResult.riskColor === 'red'
                                ? 'text-red-600'
                                : demoResult.riskColor === 'amber'
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {demoResult.riskLevel} Risk
                            <AlertTriangle
                              size={20}
                              className={
                                demoResult.riskColor === 'red' || demoResult.riskColor === 'amber'
                                  ? 'block'
                                  : 'hidden'
                              }
                            />
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="text-xs text-slate-500 mb-1">Sentiment</div>
                          <div className="text-lg font-semibold text-slate-800">{demoResult.sentiment}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                          <div className="text-xs text-indigo-500 mb-1">Recommended Action</div>
                          <div className="text-sm font-medium text-indigo-900">{demoResult.actionItem}</div>
                        </div>
                      </div>
                      <div className="bg-teal-50 rounded-xl p-5 border border-teal-100 relative">
                        <div className="absolute top-4 right-4 text-teal-200">
                          <MessageSquare size={40} />
                        </div>
                        <div className="text-xs font-bold text-teal-800 uppercase mb-2">
                          Drafted Manager Response
                        </div>
                        <p className="text-teal-900 text-sm leading-relaxed italic">
                          "{demoResult.draftResponse}"
                        </p>
                        <div className="mt-4 pt-4 border-t border-teal-100 flex gap-2">
                          <button className="text-xs bg-white py-1.5 px-3 rounded-md border border-teal-200 text-teal-700 font-medium shadow-sm hover:bg-teal-50">
                            Copy to Clipboard
                          </button>
                          <button className="text-xs bg-teal-700 py-1.5 px-3 rounded-md text-white font-medium shadow-sm hover:bg-teal-800 flex items-center gap-1">
                            Send <Send size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={resetDemo}
                      className="text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto"
                    >
                      <RefreshCw size={12} /> Reset Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-teal-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">A simple rhythm for sustainable work</h2>
            <p className="text-teal-100 max-w-2xl mx-auto">
              No complex integrations. No steep learning curves. Just insight.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Check In',
                desc: 'Team receives a link via email or Slack. They answer 3 simple questions about load and stress.',
              },
              {
                step: '02',
                title: 'Analyze',
                desc: 'Rebalance aggregates data into a heat map, highlighting burnout risks and available capacity.',
              },
              {
                step: '03',
                title: 'Discuss',
                desc: 'Managers use the data to guide 1:1s, focusing on support rather than just status updates.',
              },
              {
                step: '04',
                title: 'Adjust',
                desc: 'Work is redistributed based on reality. The team stays healthy and projects stay on track.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-teal-800/50 mb-4 font-mono">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-teal-100/80 leading-relaxed">{item.desc}</p>
                {i !== 3 && (
                  <div className="hidden md:block absolute top-12 right-0 w-full h-[2px] bg-gradient-to-r from-teal-700 to-transparent transform translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Leaders love Rebalance"
            subtitle="Join hundreds of managers who put their people first."
          />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>&#9733;</span>
                ))}
              </div>
              <p className="text-slate-700 text-lg italic mb-6">
                "We operate a high-pressure manufacturing floor. Before Rebalance, I only knew someone was
                struggling when they handed in their notice. Now, we catch issues weeks in advance. It's
                changed our culture."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100"
                  alt="David Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">David Chen</div>
                  <div className="text-sm text-slate-500">VP of Operations, North Mfg</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>&#9733;</span>
                ))}
              </div>
              <p className="text-slate-700 text-lg italic mb-6">
                "Most HR tools feel like surveillance. Rebalance feels like support. My team actually
                appreciates the check-ins because they see us taking action on their feedback instantly."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1573497019-9e6a575a8316?auto=format&fit=crop&q=80&w=100&h=100"
                  alt="Maria Rodriguez"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">Maria Rodriguez</div>
                  <div className="text-sm text-slate-500">Director of People, Apex Finance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal-800 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-teal-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Build a healthier, higher-performing team today.
              </h2>
              <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
                Stop guessing about capacity. Start making data-driven decisions that protect your people
                and your projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-amber-500 text-teal-900 hover:bg-amber-400 border-none"
                  onClick={onGetStarted}
                >
                  Get Started for Free
                </Button>
                <Button variant="outline" onClick={onGetStarted}>
                  Try the Demo
                </Button>
              </div>
              <p className="mt-6 text-sm text-teal-300">14-day free trial. No credit card required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-teal-800 p-1.5 rounded-lg">
                  <Activity className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold text-teal-900">Rebalance</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Helping teams find their equilibrium through better data and human-centric management.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#features" className="hover:text-teal-800">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Burnout Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Capacity Planning Template
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Customer Stories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-teal-800">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Legal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-800">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Rebalance, Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-teal-800">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-teal-800">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
