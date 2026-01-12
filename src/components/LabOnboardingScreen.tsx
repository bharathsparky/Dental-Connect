import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  ChevronRight, 
  ChevronLeft,
  Phone,
  Building2,
  CheckCircle2,
  Clock,
  Truck,
  User,
  MapPin,
  Mail,
  Loader2,
  Wrench,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  useAuthStore, 
  LAB_SERVICES,
  LAB_MATERIALS,
  LAB_EQUIPMENT,
  LAB_CERTIFICATIONS,
  INDIAN_STATES,
  validatePincode,
  type LabService,
  type LabMaterial,
  type LabEquipment,
  type LabCertification
} from '@/stores/authStore'

const WORKING_DAYS = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' },
]

export function LabOnboardingScreen() {
  const { 
    onboardingStep,
    labProfile,
    otpSent,
    otpVerified,
    nextOnboardingStep,
    prevOnboardingStep,
    updateLabProfile,
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
    if (!/^\d*$/.test(value)) return
    
    const newOTP = [...otpInput]
    newOTP[index] = value.slice(-1)
    setOtpInput(newOTP)
    setOtpError('')
    
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
    
    if (newOTP.every(d => d) && newOTP.join('').length === 6) {
      handleOTPVerify(newOTP.join(''))
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

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

  // Toggle service selection
  const toggleService = (serviceId: LabService) => {
    const current = labProfile.services
    const updated = current.includes(serviceId)
      ? current.filter(s => s !== serviceId)
      : [...current, serviceId]
    updateLabProfile({ services: updated })
  }

  // Toggle material selection
  const toggleMaterial = (materialId: LabMaterial) => {
    const current = labProfile.materials
    const updated = current.includes(materialId)
      ? current.filter(m => m !== materialId)
      : [...current, materialId]
    updateLabProfile({ materials: updated })
  }

  // Toggle equipment selection
  const toggleEquipment = (equipmentId: LabEquipment) => {
    const current = labProfile.equipment
    const updated = current.includes(equipmentId)
      ? current.filter(e => e !== equipmentId)
      : [...current, equipmentId]
    updateLabProfile({ equipment: updated })
  }

  // Toggle certification selection
  const toggleCertification = (certId: LabCertification) => {
    const current = labProfile.certifications
    const updated = current.includes(certId)
      ? current.filter(c => c !== certId)
      : [...current, certId]
    updateLabProfile({ certifications: updated })
  }

  // Toggle working day
  const toggleWorkingDay = (day: string) => {
    const current = labProfile.workingDays
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day]
    updateLabProfile({ workingDays: updated })
  }

  // Check if current step is valid to proceed
  const canProceed = (): boolean => {
    switch (onboardingStep) {
      case 2: return otpVerified // Phone verified
      case 3: return labProfile.ownerName.length >= 3 && labProfile.email.includes('@')
      case 4: return !!(labProfile.labName && labProfile.labCity && validatePincode(labProfile.labPincode))
      case 5: return labProfile.services.length >= 1 && labProfile.materials.length >= 1
      case 6: return labProfile.standardTurnaround > 0 && labProfile.workingDays.length >= 1
      case 7: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (onboardingStep === 7) {
      completeOnboarding()
    } else {
      nextOnboardingStep()
    }
  }

  // Calculate progress (steps 2-7 for lab, step 1 is role selection)
  const progress = Math.max(0, ((onboardingStep - 2) / 5) * 100)

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Progress indicator */}
        {onboardingStep >= 2 && onboardingStep < 7 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/50">Step {onboardingStep - 1} of 5</span>
              <span className="text-sm text-violet-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-violet-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
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
                <div className="w-16 h-16 mx-auto mb-4 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                  <Phone className="w-8 h-8 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {otpSent ? 'Enter OTP' : 'Verify Your Phone'}
                </h2>
                <p className="text-white/60 text-sm">
                  {otpSent 
                    ? `We sent a 6-digit code to +91 ${phoneInput}`
                    : 'We\'ll send you a verification code'
                  }
                </p>
              </div>

              {!otpSent ? (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/50">
                      <span className="text-lg">+91</span>
                      <div className="w-px h-5 bg-white/20" />
                    </div>
                    <Input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="pl-20 h-14 text-lg tracking-wide"
                      autoFocus
                    />
                  </div>
                  
                  <Button 
                    className="w-full h-12 bg-violet-600 hover:bg-violet-700"
                    disabled={phoneInput.length < 10 || isLoading}
                    onClick={handlePhoneSubmit}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                  </Button>
                </div>
              ) : (
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
                          "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500",
                          "transition-all duration-200",
                          otpError && "border-red-500/50"
                        )}
                        maxLength={1}
                      />
                    ))}
                  </div>
                  
                  {otpError && <p className="text-center text-sm text-red-400">{otpError}</p>}
                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 text-violet-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Verifying...</span>
                    </div>
                  )}

                  <div className="text-center">
                    <button 
                      className="text-sm text-white/50 hover:text-white transition-colors"
                      onClick={() => { setOtpInput(['', '', '', '', '', '']); sendOTP(phoneInput) }}
                    >
                      Didn't receive? <span className="text-violet-400">Resend OTP</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <p className="text-xs text-amber-400 text-center">Demo: Enter any 6 digits to verify</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Owner Details */}
          {onboardingStep === 3 && (
            <motion.div
              key="owner"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Owner Details</h2>
                <p className="text-white/60 text-sm">Tell us about yourself</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Full Name *</label>
                  <Input
                    value={labProfile.ownerName}
                    onChange={(e) => updateLabProfile({ ownerName: e.target.value })}
                    placeholder="John Doe"
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
                      value={labProfile.email}
                      onChange={(e) => updateLabProfile({ email: e.target.value })}
                      placeholder="lab@example.com"
                      className="h-12 pl-11"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={prevOnboardingStep} className="w-12 h-12 p-0">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  className="flex-1 h-12 bg-violet-600 hover:bg-violet-700"
                  disabled={!canProceed()}
                  onClick={handleNext}
                >
                  Continue <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Lab Details */}
          {onboardingStep === 4 && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col max-h-[75vh]"
            >
              <div className="text-center mb-4 flex-shrink-0">
                <div className="w-14 h-14 mx-auto mb-3 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Lab Details</h2>
                <p className="text-white/60 text-sm">Where is your lab located?</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-1">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Lab Name *</label>
                  <Input
                    value={labProfile.labName}
                    onChange={(e) => updateLabProfile({ labName: e.target.value })}
                    placeholder="Precision Dental Lab"
                    className="h-12"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Address</label>
                  <Input
                    value={labProfile.labAddress}
                    onChange={(e) => updateLabProfile({ labAddress: e.target.value })}
                    placeholder="123, Industrial Area"
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">City *</label>
                    <Input
                      value={labProfile.labCity}
                      onChange={(e) => updateLabProfile({ labCity: e.target.value })}
                      placeholder="Chennai"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">State</label>
                    <select
                      value={labProfile.labState}
                      onChange={(e) => updateLabProfile({ labState: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm"
                    >
                      <option value="" className="bg-[#1c1c1e]">Select</option>
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state} className="bg-[#1c1c1e]">{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">PIN Code *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      value={labProfile.labPincode}
                      onChange={(e) => updateLabProfile({ labPincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      placeholder="600001"
                      className="h-12 pl-11 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Lab Phone</label>
                  <Input
                    value={labProfile.labPhone}
                    onChange={(e) => updateLabProfile({ labPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="Landline or mobile"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Years in Business</label>
                  <Input
                    type="number"
                    value={labProfile.yearsInBusiness || ''}
                    onChange={(e) => updateLabProfile({ yearsInBusiness: parseInt(e.target.value) || null })}
                    placeholder="e.g., 5"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 flex-shrink-0">
                <Button variant="secondary" onClick={prevOnboardingStep} className="w-12 h-12 p-0">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  className="flex-1 h-12 bg-violet-600 hover:bg-violet-700"
                  disabled={!canProceed()}
                  onClick={handleNext}
                >
                  Continue <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Services & Materials */}
          {onboardingStep === 5 && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col max-h-[75vh]"
            >
              <div className="text-center mb-4 flex-shrink-0">
                <div className="w-14 h-14 mx-auto mb-3 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Services & Materials</h2>
                <p className="text-white/60 text-sm">What do you offer?</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-5 pr-1 -mr-1">
                {/* Services */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Services Offered * <span className="text-white/40">({labProfile.services.length} selected)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAB_SERVICES.map(service => (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-left transition-all text-sm",
                          labProfile.services.includes(service.id)
                            ? "bg-violet-500/20 border-2 border-violet-500"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        <span className="text-white/80">{service.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Materials Available * <span className="text-white/40">({labProfile.materials.length} selected)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAB_MATERIALS.map(material => (
                      <button
                        key={material.id}
                        onClick={() => toggleMaterial(material.id)}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-left transition-all text-sm",
                          labProfile.materials.includes(material.id)
                            ? "bg-violet-500/20 border-2 border-violet-500"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        <span className="text-white/80">{material.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equipment (Optional) */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Equipment & Technology <span className="text-white/40">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAB_EQUIPMENT.map(equip => (
                      <button
                        key={equip.id}
                        onClick={() => toggleEquipment(equip.id)}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-left transition-all text-sm",
                          labProfile.equipment.includes(equip.id)
                            ? "bg-violet-500/20 border-2 border-violet-500"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        <span className="text-white/80">{equip.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Certifications (Optional) */}
                <div className="pb-2">
                  <label className="block text-sm text-white/60 mb-2">
                    Certifications <span className="text-white/40">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAB_CERTIFICATIONS.map(cert => (
                      <button
                        key={cert.id}
                        onClick={() => toggleCertification(cert.id)}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-left transition-all text-sm",
                          labProfile.certifications.includes(cert.id)
                            ? "bg-violet-500/20 border-2 border-violet-500"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        <span className="text-white/80">{cert.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 flex-shrink-0">
                <Button variant="secondary" onClick={prevOnboardingStep} className="w-12 h-12 p-0">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  className="flex-1 h-12 bg-violet-600 hover:bg-violet-700"
                  disabled={!canProceed()}
                  onClick={handleNext}
                >
                  Continue <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Turnaround & Availability */}
          {onboardingStep === 6 && (
            <motion.div
              key="turnaround"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col max-h-[75vh]"
            >
              <div className="text-center mb-4 flex-shrink-0">
                <div className="w-14 h-14 mx-auto mb-3 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Turnaround & Hours</h2>
                <p className="text-white/60 text-sm">Set your availability</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-5 pr-1 -mr-1">
                {/* Standard Turnaround */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Standard Turnaround (days) *</label>
                  <Input
                    type="number"
                    value={labProfile.standardTurnaround}
                    onChange={(e) => updateLabProfile({ standardTurnaround: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 7"
                    className="h-12"
                  />
                </div>

                {/* Rush Service */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm text-white/60">Rush Service Available</label>
                    <button
                      onClick={() => updateLabProfile({ rushAvailable: !labProfile.rushAvailable })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all",
                        labProfile.rushAvailable ? "bg-violet-500" : "bg-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full bg-white transition-all",
                        labProfile.rushAvailable ? "translate-x-6" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>
                  {labProfile.rushAvailable && (
                    <Input
                      type="number"
                      value={labProfile.rushTurnaround}
                      onChange={(e) => updateLabProfile({ rushTurnaround: parseInt(e.target.value) || 0 })}
                      placeholder="Rush turnaround (days)"
                      className="h-12"
                    />
                  )}
                </div>

                {/* Working Days */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Working Days *</label>
                  <div className="flex gap-2">
                    {WORKING_DAYS.map(day => (
                      <button
                        key={day.id}
                        onClick={() => toggleWorkingDay(day.id)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                          labProfile.workingDays.includes(day.id)
                            ? "bg-violet-500/20 border-2 border-violet-500 text-violet-400"
                            : "bg-white/5 border border-white/10 text-white/50"
                        )}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Open Time</label>
                    <Input
                      type="time"
                      value={labProfile.openTime}
                      onChange={(e) => updateLabProfile({ openTime: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Close Time</label>
                    <Input
                      type="time"
                      value={labProfile.closeTime}
                      onChange={(e) => updateLabProfile({ closeTime: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="space-y-3">
                  <label className="block text-sm text-white/60">Delivery Options</label>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-white/50" />
                      <span className="text-sm text-white">Pickup from Lab</span>
                    </div>
                    <button
                      onClick={() => updateLabProfile({ pickupAvailable: !labProfile.pickupAvailable })}
                      className={cn(
                        "w-10 h-5 rounded-full transition-all",
                        labProfile.pickupAvailable ? "bg-violet-500" : "bg-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-all",
                        labProfile.pickupAvailable ? "translate-x-5" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-white/50" />
                      <span className="text-sm text-white">Delivery Available</span>
                    </div>
                    <button
                      onClick={() => updateLabProfile({ deliveryAvailable: !labProfile.deliveryAvailable })}
                      className={cn(
                        "w-10 h-5 rounded-full transition-all",
                        labProfile.deliveryAvailable ? "bg-violet-500" : "bg-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-all",
                        labProfile.deliveryAvailable ? "translate-x-5" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 flex-shrink-0">
                <Button variant="secondary" onClick={prevOnboardingStep} className="w-12 h-12 p-0">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  className="flex-1 h-12 bg-violet-600 hover:bg-violet-700"
                  disabled={!canProceed()}
                  onClick={handleNext}
                >
                  Complete Setup <CheckCircle2 className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 7: Success */}
          {onboardingStep === 7 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30"
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
                  Lab Profile Created!
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60"
                >
                  Welcome, {labProfile.labName}!
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card variant="gradient">
                  <CardContent className="p-4 pt-4 text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{labProfile.labName}</p>
                        <p className="text-xs text-white/50">{labProfile.labCity}, {labProfile.labState}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Services</span>
                        <span className="text-white">{labProfile.services.length} types</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Turnaround</span>
                        <span className="text-white">{labProfile.standardTurnaround} days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <p className="text-sm text-white/50">What's next:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Set Pricing', 'Add Photos', 'Start Receiving Orders'].map((item) => (
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
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  onClick={handleNext}
                >
                  Go to Dashboard
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
