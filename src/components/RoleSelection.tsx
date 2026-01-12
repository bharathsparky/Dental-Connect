import { motion } from 'motion/react'
import { 
  Stethoscope, 
  Building2, 
  ChevronRight,
  Shield,
  Award,
  BadgeCheck
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore, type UserRole } from '@/stores/authStore'
// import { cn } from '@/lib/utils'

export function RoleSelection() {
  const { setUserRole, nextOnboardingStep } = useAuthStore()

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role)
    nextOnboardingStep()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <span className="text-2xl font-bold text-white">DC</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to DentConnect</h1>
            <p className="text-white/60">How would you like to use the app?</p>
          </div>

          {/* Role Options */}
          <div className="space-y-4">
            {/* Doctor Option */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card 
                variant="gradient"
                className="cursor-pointer hover:border-primary/50 transition-all group"
                onClick={() => handleRoleSelect('doctor')}
              >
                <CardContent className="p-5 pt-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                      <Stethoscope className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-1">I'm a Dentist</h3>
                      <p className="text-sm text-white/50">
                        Order from dental labs, track cases, manage payments
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                    {['Place Orders', 'Track Cases', 'Multiple Labs', 'Easy Payments'].map((feature) => (
                      <span 
                        key={feature}
                        className="px-2 py-1 rounded-md bg-white/5 text-xs text-white/60"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lab Option */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card 
                variant="gradient"
                className="cursor-pointer hover:border-violet-500/50 transition-all group"
                onClick={() => handleRoleSelect('lab')}
              >
                <CardContent className="p-5 pt-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                      <Building2 className="w-7 h-7 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-1">I'm a Dental Lab</h3>
                      <p className="text-sm text-white/50">
                        Receive orders, manage production, grow your business
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                    {['Get Orders', 'Manage Cases', 'Set Pricing', 'Build Reputation'].map((feature) => (
                      <span 
                        key={feature}
                        className="px-2 py-1 rounded-md bg-white/5 text-xs text-white/60"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trust badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 text-white/40"
          >
            <div className="flex items-center gap-1 text-xs">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Award className="w-4 h-4" />
              <span>Trusted</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <BadgeCheck className="w-4 h-4" />
              <span>Verified</span>
            </div>
          </motion.div>

          <p className="text-center text-xs text-white/30">
            By continuing, you agree to our Terms of Service & Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  )
}
