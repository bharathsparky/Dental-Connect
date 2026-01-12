import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  ChevronRight, 
  ChevronLeft,
  Phone,
  Shield,
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  Users,
  Award,
  Stethoscope,
  MapPin,
  Mail,
  User,
  BadgeCheck,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  useAuthStore, 
  QUALIFICATIONS, 
  SPECIALIZATIONS, 
  INDIAN_STATES,
  DENTAL_COUNCILS,
  validatePincode,
  type Qualification,
  type Specialization
} from '@/stores/authStore'

// Welcome screen features
const FEATURES = [
  {
    icon: Clock,
    title: 'Quick Ordering',
    description: 'Place lab orders in under 2 minutes',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20'
  },
  {
    icon: Truck,
    title: 'Track Deliveries',
    description: 'Real-time updates on all your cases',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20'
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'UPI, cards, credit & monthly billing',
    color: 'text-violet-400',
    bg: 'bg-violet-500/20'
  },
  {
    icon: Users,
    title: 'Trusted Labs',
    description: 'Verified dental labs near you',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20'
  },
]

export function OnboardingScreen() {
  const { 
    onboardingStep,
    profile,
    otpSent,
    otpVerified,
    nextOnboardingStep,
    prevOnboardingStep,
    updateProfile,
    sendOTP,
    verifyOTP,
    completeOnboarding
  } = useAuthStore()

  const [phoneInput, setPhoneInput] = useState('')
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first OTP input when OTP is sent
  useEffect(() => {
    if (otpSent && !otpVerified) {
      otpRefs.current[0]?.focus()
    }
  }, [otpSent, otpVerified])

  // Handle phone submit
  const handlePhoneSubmit = async () => {
    if (phoneInput.length < 10) return
    setIsLoading(true)
    await sendOTP(phoneInput)
    setIsLoading(false)
  }

  // Handle OTP input
  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only digits
    
    const newOTP = [...otpInput]
    newOTP[index] = value.slice(-1) // Only last digit
    setOtpInput(newOTP)
    setOtpError('')
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
    
    // Auto-verify when all digits entered
    if (newOTP.every(d => d) && newOTP.join('').length === 6) {
      handleOTPVerify(newOTP.join(''))
    }
  }

  // Handle OTP backspace
  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Verify OTP
  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true)
    const success = await verifyOTP(otp)
    setIsLoading(false)
    if (success) {
      nextOnboardingStep()
    } else {
      setOtpError('Invalid OTP. Please try again.')
      setOtpInput(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    }
  }

  // Check if current step is valid to proceed
  const canProceed = (): boolean => {
    switch (onboardingStep) {
      case 1: return true // Welcome
      case 2: return otpVerified // Phone verified
      case 3: return profile.fullName.length >= 3 && profile.email.includes('@')
      case 4: return !!(profile.dentalCouncilNumber && profile.qualification && profile.specialization)
      case 5: return !!(profile.clinicName && profile.clinicCity && validatePincode(profile.clinicPincode))
      case 6: return true
      default: return false
    }
  }

  // Handle next step
  const handleNext = () => {
    if (onboardingStep === 6) {
      completeOnboarding()
    } else {
      nextOnboardingStep()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Progress indicator */}
        {onboardingStep > 1 && onboardingStep < 6 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/50">Step {onboardingStep - 1} of 4</span>
              <span className="text-sm text-primary">{Math.round(((onboardingStep - 1) / 4) * 100)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((onboardingStep - 1) / 4) * 100}%` }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {onboardingStep === 1 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* Logo & Title */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">DentConnect</h1>
                <p className="text-white/60">Your dental lab partner</p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                {FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card variant="gradient" className="h-full">
                      <CardContent className="p-4 pt-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", feature.bg)}>
                          <feature.icon className={cn("w-5 h-5", feature.color)} />
                        </div>
                        <h3 className="font-medium text-white text-sm mb-1">{feature.title}</h3>
                        <p className="text-xs text-white/50">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 text-white/40">
                <div className="flex items-center gap-1 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Award className="w-4 h-4" />
                  <span>Verified Labs</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <BadgeCheck className="w-4 h-4" />
                  <span>DCI Compliant</span>
                </div>
              </div>

              {/* CTA */}
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleNext}
              >
                Get Started
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>

              <p className="text-center text-xs text-white/30">
                By continuing, you agree to our Terms of Service & Privacy Policy
              </p>
            </motion.div>
          )}

          {/* Step 2: Phone Verification */}
          {onboardingStep === 2 && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {otpSent ? 'Enter OTP' : 'Enter Your Phone'}
                </h2>
                <p className="text-white/60 text-sm">
                  {otpSent 
                    ? `We sent a 6-digit code to +91 ${phoneInput}`
                    : 'We\'ll send you a verification code'
                  }
                </p>
              </div>

              {!otpSent ? (
                /* Phone Input */
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/50">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-sm font-medium">+91</span>
                      <div className="w-px h-5 bg-white/20" />
                    </div>
                    <Input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="pl-24 h-14 text-lg tracking-wide"
                      autoFocus
                    />
                  </div>
                  
                  <Button 
                    className="w-full h-12"
                    disabled={phoneInput.length < 10 || isLoading}
                    onClick={handlePhoneSubmit}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Send OTP</>
                    )}
                  </Button>
                </div>
              ) : (
                /* OTP Input */
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {otpInput.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el }}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        className={cn(
                          "w-12 h-14 text-center text-xl font-semibold rounded-xl",
                          "bg-white/5 border border-white/10 text-white",
                          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                          "transition-all duration-200",
                          otpError && "border-red-500/50"
                        )}
                        maxLength={1}
                      />
                    ))}
                  </div>
                  
                  {otpError && (
                    <p className="text-center text-sm text-red-400">{otpError}</p>
                  )}

                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Verifying...</span>
                    </div>
                  )}

                  <div className="text-center">
                    <button 
                      className="text-sm text-white/50 hover:text-white transition-colors"
                      onClick={() => {
                        setOtpInput(['', '', '', '', '', ''])
                        sendOTP(phoneInput)
                      }}
                    >
                      Didn't receive? <span className="text-primary">Resend OTP</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Demo hint */}
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <p className="text-xs text-amber-400 text-center">
                  Demo: Enter any 6 digits to verify
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Basic Details */}
          {onboardingStep === 3 && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Details</h2>
                <p className="text-white/60 text-sm">Let's get to know you</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Full Name *</label>
                  <Input
                    value={profile.fullName}
                    onChange={(e) => updateProfile({ fullName: e.target.value })}
                    placeholder="Dr. John Doe"
                    className="h-12"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile({ email: e.target.value })}
                      placeholder="doctor@clinic.com"
                      className="h-12 pl-11"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="secondary" 
                  onClick={prevOnboardingStep}
                  className="w-12 h-12 p-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  className="flex-1 h-12"
                  disabled={!canProceed()}
                  onClick={handleNext}
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Professional Info */}
          {onboardingStep === 4 && (
            <motion.div
              key="professional"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col max-h-[75vh]"
            >
              <div className="text-center mb-4 flex-shrink-0">
                <div className="w-14 h-14 mx-auto mb-3 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Professional Info</h2>
                <p className="text-white/60 text-sm">Your credentials & expertise</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-1">
                {/* Dental Council */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">State Dental Council *</label>
                  <select
                    value={profile.dentalCouncilState}
                    onChange={(e) => updateProfile({ dentalCouncilState: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="" className="bg-[#1c1c1e]">Select State Council</option>
                    {DENTAL_COUNCILS.map(council => (
                      <option key={council.code} value={council.code} className="bg-[#1c1c1e]">
                        {council.state} ({council.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Registration Number *</label>
                  <Input
                    value={profile.dentalCouncilNumber}
                    onChange={(e) => updateProfile({ dentalCouncilNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g., A-12345"
                    className="h-12 font-mono"
                  />
                  <p className="text-xs text-white/40 mt-1">Your State Dental Council registration number</p>
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Qualification *</label>
                  <select
                    value={profile.qualification || ''}
                    onChange={(e) => updateProfile({ qualification: e.target.value as Qualification })}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="" className="bg-[#1c1c1e]">Select Qualification</option>
                    {QUALIFICATIONS.map(qual => (
                      <option key={qual.id} value={qual.id} className="bg-[#1c1c1e]">
                        {qual.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialization */}
                <div className="pb-2">
                  <label className="block text-sm text-white/60 mb-2">Specialization *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SPECIALIZATIONS.map(spec => (
                      <button
                        key={spec.id}
                        onClick={() => updateProfile({ specialization: spec.id as Specialization })}
                        className={cn(
                          "py-3 px-2 rounded-xl text-center transition-all",
                          profile.specialization === spec.id
                            ? "bg-primary/20 border-2 border-primary"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        <span className="text-xs text-white/80 leading-tight block">{spec.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 flex-shrink-0">
                <Button 
                  variant="secondary" 
                  onClick={prevOnboardingStep}
                  className="w-12 h-12 p-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  className="flex-1 h-12"
                  disabled={!canProceed()}
                  onClick={handleNext}
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Clinic Details */}
          {onboardingStep === 5 && (
            <motion.div
              key="clinic"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Clinic Setup</h2>
                <p className="text-white/60 text-sm">Where should labs deliver?</p>
              </div>

              <div className="space-y-4">
                {/* Clinic Name */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Clinic Name *</label>
                  <Input
                    value={profile.clinicName}
                    onChange={(e) => updateProfile({ clinicName: e.target.value })}
                    placeholder="Smile Dental Clinic"
                    className="h-12"
                    autoFocus
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Address</label>
                  <Input
                    value={profile.clinicAddress}
                    onChange={(e) => updateProfile({ clinicAddress: e.target.value })}
                    placeholder="123, Main Street, Near Market"
                    className="h-12"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">City *</label>
                    <Input
                      value={profile.clinicCity}
                      onChange={(e) => updateProfile({ clinicCity: e.target.value })}
                      placeholder="Chennai"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">State</label>
                    <select
                      value={profile.clinicState}
                      onChange={(e) => updateProfile({ clinicState: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    >
                      <option value="" className="bg-[#1c1c1e]">Select</option>
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state} className="bg-[#1c1c1e]">
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">PIN Code *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      value={profile.clinicPincode}
                      onChange={(e) => updateProfile({ clinicPincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      placeholder="600001"
                      className="h-12 pl-11 font-mono"
                    />
                  </div>
                  {profile.clinicPincode && !validatePincode(profile.clinicPincode) && (
                    <p className="text-xs text-red-400 mt-1">Please enter a valid 6-digit PIN code</p>
                  )}
                </div>

                {/* Clinic Phone */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Clinic Phone (Optional)</label>
                  <Input
                    value={profile.clinicPhone}
                    onChange={(e) => updateProfile({ clinicPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="Landline or alternate number"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="secondary" 
                  onClick={prevOnboardingStep}
                  className="w-12 h-12 p-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  className="flex-1 h-12"
                  disabled={!canProceed()}
                  onClick={handleNext}
                >
                  Complete Setup
                  <CheckCircle2 className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Complete */}
          {onboardingStep === 6 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 text-center"
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  You're All Set!
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60"
                >
                  Welcome aboard, Dr. {profile.fullName.split(' ')[0]}!
                </motion.p>
              </div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card variant="gradient">
                  <CardContent className="p-4 pt-4 text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{profile.clinicName}</p>
                        <p className="text-xs text-white/50">{profile.clinicCity}, {profile.clinicState}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Registration</span>
                        <span className="text-white font-mono">{profile.dentalCouncilNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Specialization</span>
                        <span className="text-white">
                          {SPECIALIZATIONS.find(s => s.id === profile.specialization)?.label}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What's next */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <p className="text-sm text-white/50">What you can do now:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Browse Labs', 'Place Orders', 'Track Deliveries'].map((item) => (
                    <span 
                      key={item}
                      className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-white/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={handleNext}
                >
                  Start Exploring
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
