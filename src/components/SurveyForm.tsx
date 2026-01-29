import { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playStepComplete, playSurveyComplete, playSelect } from '../utils/sounds';
import { Avatar } from './Avatar';

interface SurveyFormProps {
  onSubmit: (data: any) => void;
  currentUser: {
    name: string;
    avatar: string;
    avatarType?: 'initials' | 'animal' | 'custom';
    avatarAnimal?: string;
    avatarImageUrl?: string;
    weeklyHours?: number;
  };
}

export function SurveyForm({ onSubmit, currentUser }: SurveyFormProps) {
  const [step, setStep] = useState(0);
  const [capacity, setCapacity] = useState([75]);
  const [stressLevel, setStressLevel] = useState([5]);
  const [anticipatedWorkload, setAnticipatedWorkload] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [highWorkloadReason, setHighWorkloadReason] = useState<string | null>(null);
  const [highWorkloadOther, setHighWorkloadOther] = useState('');
  const [stressReduction, setStressReduction] = useState('');

  // Dynamically calculate total steps based on capacity and stress
  const showHighWorkloadQuestion = capacity[0] > 100;
  const showStressReductionQuestion = stressLevel[0] > 6;
  
  let totalSteps = 4; // Base: capacity, stress, workload, comments
  if (showHighWorkloadQuestion) totalSteps++;
  if (showStressReductionQuestion) totalSteps++;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      playStepComplete();
      setDirection(1);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const data: any = {
      capacity: capacity[0],
      stressLevel: stressLevel[0],
      anticipatedWorkload,
      comments
    };
    
    // Include high workload data if applicable
    if (showHighWorkloadQuestion) {
      data.highWorkloadReason = highWorkloadReason;
      if (highWorkloadReason === 'other') {
        data.highWorkloadOther = highWorkloadOther;
      }
    }
    
    // Include stress reduction data if applicable
    if (showStressReductionQuestion) {
      data.stressReduction = stressReduction;
    }
    
    onSubmit(data);
    playSurveyComplete();
    setSubmitted(true);
  };

  const canProceed = () => {
    // Step 1 is high workload question (only shown if capacity > 100)
    if (step === 1 && showHighWorkloadQuestion) {
      if (!highWorkloadReason) return false;
      if (highWorkloadReason === 'other' && !highWorkloadOther.trim()) return false;
    }
    
    // Calculate step indices dynamically
    let stressStep = showHighWorkloadQuestion ? 2 : 1;
    let stressReductionStep = stressStep + 1;
    let workloadStep = stressStep + (showStressReductionQuestion ? 1 : 0) + 1;
    
    // Anticipated workload question
    if (step === workloadStep && !anticipatedWorkload) return false;
    return true;
  };

  const getCapacityColor = (value: number) => {
    if (value >= 80) return 'text-emerald-500';
    if (value >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getCapacityBg = (value: number) => {
    if (value >= 80) return 'from-emerald-400 to-teal-500';
    if (value >= 50) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-pink-500';
  };

  const getStressColor = (value: number) => {
    if (value <= 3) return 'text-emerald-500';
    if (value <= 6) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getStressBg = (value: number) => {
    if (value <= 3) return 'from-emerald-400 to-teal-500';
    if (value <= 6) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-pink-500';
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9
    })
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981'][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    y: [0, -100]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.05,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-emerald-600 mb-4">You're all set! 🎉</h2>
              <p className="text-gray-600 mb-2">Thanks for taking a moment to check in.</p>
              <p className="text-sm text-gray-500">Your insights help us build a better team.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex justify-center mb-4">
            <Avatar
              type={currentUser.avatarType}
              initials={currentUser.avatar}
              animal={currentUser.avatarAnimal}
              imageUrl={currentUser.avatarImageUrl}
              size="xl"
            />
          </div>
          <h2 className="text-gray-900 mb-2">Hey {currentUser.name.split(' ')[0]}! 👋</h2>
          <p className="text-gray-600">Quick weekly check-in</p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[...Array(totalSteps)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step 
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' 
                  : i < step 
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-gray-300'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>

        {/* Questions */}
        <div className="mb-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10"
            >
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-4">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-gray-900 mb-3">How's your capacity this week?</h3>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-4">
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        Some weeks you'll have more or less capacity to be productive. 
                        Consider your energy, deadlines, and any personal matters happening right now. 
                        Be honest!
                      </p>
                      {currentUser.weeklyHours && (
                        <p className="text-xs text-purple-700 bg-purple-100 rounded-lg px-3 py-1.5 inline-block">
                          📊 Your typical week: {currentUser.weeklyHours} hours = 100% capacity
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <motion.div 
                      className="text-center py-6"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`text-7xl sm:text-8xl mb-3 bg-gradient-to-br ${getCapacityBg(capacity[0])} bg-clip-text text-transparent`}>
                        {capacity[0]}%
                      </div>
                      {capacity[0] > 100 && (
                        <motion.p 
                          className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 inline-block"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          ⚠️ Over {currentUser.weeklyHours || 40} hrs/week
                        </motion.p>
                      )}
                    </motion.div>
                    
                    <div className="px-2">
                      <Slider
                        value={capacity}
                        onValueChange={setCapacity}
                        max={150}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="relative w-full text-xs sm:text-sm text-gray-500 px-2">
                      <div className="absolute left-0 max-w-[30%]">Not enough to do</div>
                      <div className="absolute left-[57%] -translate-x-1/2 whitespace-nowrap">Just right ✨</div>
                      <div className="absolute right-0">Over capacity</div>
                    </div>
                    <div className="h-8"></div>
                  </div>
                </div>
              )}

              {step === 1 && showHighWorkloadQuestion && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-block p-3 bg-rose-100 rounded-2xl mb-4">
                      <span className="text-2xl">🤔</span>
                    </div>
                    <h3 className="text-gray-900 mb-3">Why are you over capacity this week?</h3>
                    <p className="text-gray-600">Help us understand what's going on</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { value: 'project_deadline', label: 'Nearing deadline', emoji: '⏰', gradient: 'from-orange-400 to-red-500' },
                      { value: 'understaffed', label: 'Too much work allocated to me', emoji: '📚', gradient: 'from-purple-400 to-pink-500' },
                      { value: 'unplanned_work', label: 'Unplanned work came up', emoji: '🔥', gradient: 'from-blue-400 to-indigo-500' },
                      { value: 'meetings', label: 'Too many meetings', emoji: '👥', gradient: 'from-teal-400 to-emerald-500' },
                      { value: 'dependencies', label: 'Blocked by dependencies', emoji: '🔗', gradient: 'from-gray-400 to-slate-500' },
                      { value: 'other', label: 'Other', emoji: '💭', gradient: 'from-amber-400 to-yellow-500' }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => {
                          playSelect();
                          setHighWorkloadReason(option.value);
                        }}
                        className={`w-full p-5 sm:p-6 rounded-2xl border-3 text-left transition-all ${
                          highWorkloadReason === option.value 
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-2xl shadow-md`}>
                            {option.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-900">{option.label}</div>
                          </div>
                          {highWorkloadReason === option.value && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle2 className="w-7 h-7 text-purple-500" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  {highWorkloadReason === 'other' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Textarea
                        placeholder="Tell us what's going on..."
                        value={highWorkloadOther}
                        onChange={(e) => setHighWorkloadOther(e.target.value)}
                        rows={3}
                        className="resize-none text-base border-2 focus:border-purple-400 rounded-2xl p-4"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {step === (showHighWorkloadQuestion ? 2 : 1) && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-block p-3 bg-amber-100 rounded-2xl mb-4">
                      <span className="text-2xl">🧘</span>
                    </div>
                    <h3 className="text-gray-900 mb-3">What's your stress level?</h3>
                    <p className="text-gray-600">No judgment—just honesty helps us support you better</p>
                  </div>
                  
                  <div className="space-y-6">
                    <motion.div 
                      className="text-center py-6"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`text-7xl sm:text-8xl mb-2 bg-gradient-to-br ${getStressBg(stressLevel[0])} bg-clip-text text-transparent`}>
                        {stressLevel[0]}
                      </div>
                      <p className="text-gray-400">out of 10</p>
                    </motion.div>
                    
                    <div className="px-2">
                      <Slider
                        value={stressLevel}
                        onValueChange={setStressLevel}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500 px-2">
                      <span>😌 Chill</span>
                      <span>😐 Medium</span>
                      <span>😰 High</span>
                    </div>
                  </div>
                </div>
              )}

              {step === (showHighWorkloadQuestion ? 3 : 2) && showStressReductionQuestion && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-block p-3 bg-teal-100 rounded-2xl mb-4">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="text-gray-900 mb-3">Is there anything the team could do to reduce your stress?</h3>
                    <p className="text-gray-600">We're here to support you</p>
                  </div>
                  
                  <Textarea
                    placeholder="E.g., 'Help with project X' or 'Need clearer priorities' or 'Just need time to focus'..."
                    value={stressReduction}
                    onChange={(e) => setStressReduction(e.target.value)}
                    rows={6}
                    className="resize-none text-base border-2 focus:border-purple-400 rounded-2xl p-4"
                  />
                </div>
              )}

              {step === (showHighWorkloadQuestion ? (showStressReductionQuestion ? 4 : 3) : (showStressReductionQuestion ? 3 : 2)) && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
                      <span className="text-2xl">📅</span>
                    </div>
                    <h3 className="text-gray-900 mb-3">Next week looking like...</h3>
                    <p className="text-gray-600">Help us plan ahead</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { value: 'low', label: 'Light week', description: 'Lighter than usual', emoji: '🌤️', gradient: 'from-emerald-400 to-teal-500' },
                      { value: 'medium', label: 'Normal week', description: 'Business as usual', emoji: '☀️', gradient: 'from-blue-400 to-indigo-500' },
                      { value: 'high', label: 'Busy week', description: 'Heavier than usual', emoji: '🔥', gradient: 'from-orange-400 to-red-500' }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => {
                          playSelect();
                          setAnticipatedWorkload(option.value);
                        }}
                        className={`w-full p-5 sm:p-6 rounded-2xl border-3 text-left transition-all ${
                          anticipatedWorkload === option.value 
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-2xl shadow-md`}>
                            {option.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-900 mb-1">{option.label}</div>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                          {anticipatedWorkload === option.value && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle2 className="w-7 h-7 text-purple-500" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {step === (showHighWorkloadQuestion ? (showStressReductionQuestion ? 5 : 4) : (showStressReductionQuestion ? 4 : 3)) && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-block p-3 bg-pink-100 rounded-2xl mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-gray-900 mb-3">Anything on your mind?</h3>
                    <p className="text-gray-600">Wins, concerns, blockers—or just say hi! (Optional)</p>
                  </div>
                  
                  <Textarea
                    placeholder="E.g., 'Big deadline Friday' or 'Crushed that project!' or 'Need help with X'..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={6}
                    className="resize-none text-base border-2 focus:border-purple-400 rounded-2xl p-4"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-3">
          {step < totalSteps - 1 ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                size="lg"
                className="w-full h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">Next</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
              >
                <span className="text-lg">Submit</span>
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>

        {step > 0 && (
          <motion.button
            onClick={handleBack}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ← Back
          </motion.button>
        )}
      </div>
    </div>
  );
}