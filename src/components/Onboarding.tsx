import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Users, Calendar, Shield, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  currentUser: any;
}

export function Onboarding({ onComplete, currentUser }: OnboardingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          {/* Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                {/* Geometric background elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/20 rounded-2xl rotate-12"></div>
                
                {/* R letter */}
                <div className="relative z-10">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8H26C30.4183 8 34 11.5817 34 16C34 19.3137 32.0804 22.1643 29.2361 23.4472L35 40H28L22.8 24H18V40H12V8ZM18 19H26C27.6569 19 29 17.6569 29 16C29 14.3431 27.6569 13 26 13H18V19Z" fill="white"/>
                  </svg>
                </div>
                
                {/* Accent dot */}
                <div className="absolute bottom-3 right-3 w-2 h-2 bg-cyan-400 rounded-full shadow-lg"></div>
              </div>
            </div>
            <h1 className="text-gray-900 mb-3">Welcome to Team Check-In! 👋</h1>
            <p className="text-gray-600 text-lg">A confidential check in to share how you're doing</p>
          </motion.div>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 mb-10"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Not for performance reviews</h3>
                  <p className="text-gray-700">
                    This isn't about evaluating you. There are no wrong answers—just honest ones.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Better project planning</h3>
                  <p className="text-gray-700">
                    Your insights help us allocate work fairly and set realistic timelines. 
                    Some weeks you may work at or slightly above capacity, but the goal is that 
                    most weeks leave you with additional capacity to respond to immediate matters 
                    and work on long-term projects.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Supporting you & the team</h3>
                  <p className="text-gray-700">
                    We want to catch burnout early and make sure everyone has what they need to thrive.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-5 mb-6">
              <p className="text-center text-gray-700">
                <span className="text-xl mr-2">✨</span>
                Takes less than 2 minutes · Just 4-5 quick questions
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onComplete}
                size="lg"
                className="w-full h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              >
                <span className="text-lg">Let's get started</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
