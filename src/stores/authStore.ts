import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Qualification options for dental professionals
export const QUALIFICATIONS = [
  { id: 'bds', label: 'BDS', full: 'Bachelor of Dental Surgery' },
  { id: 'mds_prostho', label: 'MDS (Prosthodontics)', full: 'Master of Dental Surgery - Prosthodontics' },
  { id: 'mds_ortho', label: 'MDS (Orthodontics)', full: 'Master of Dental Surgery - Orthodontics' },
  { id: 'mds_endo', label: 'MDS (Endodontics)', full: 'Master of Dental Surgery - Endodontics' },
  { id: 'mds_perio', label: 'MDS (Periodontics)', full: 'Master of Dental Surgery - Periodontics' },
  { id: 'mds_oral_surgery', label: 'MDS (Oral Surgery)', full: 'Master of Dental Surgery - Oral & Maxillofacial Surgery' },
  { id: 'mds_pedo', label: 'MDS (Pedodontics)', full: 'Master of Dental Surgery - Pedodontics' },
  { id: 'mds_public_health', label: 'MDS (Public Health)', full: 'Master of Dental Surgery - Public Health Dentistry' },
  { id: 'mds_oral_path', label: 'MDS (Oral Pathology)', full: 'Master of Dental Surgery - Oral Pathology' },
  { id: 'mds_oral_medicine', label: 'MDS (Oral Medicine)', full: 'Master of Dental Surgery - Oral Medicine & Radiology' },
  { id: 'other', label: 'Other', full: 'Other Qualification' },
] as const

// Specialization options
export const SPECIALIZATIONS = [
  { id: 'general', label: 'General Dentist' },
  { id: 'prosthodontist', label: 'Prosthodontist' },
  { id: 'orthodontist', label: 'Orthodontist' },
  { id: 'endodontist', label: 'Endodontist' },
  { id: 'periodontist', label: 'Periodontist' },
  { id: 'oral_surgeon', label: 'Oral Surgeon' },
  { id: 'pedodontist', label: 'Pediatric Dentist' },
  { id: 'implantologist', label: 'Implantologist' },
  { id: 'cosmetic', label: 'Cosmetic Dentist' },
] as const

// Indian states for address
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Puducherry', 'Chandigarh'
] as const

// State Dental Councils in India
export const DENTAL_COUNCILS = [
  { state: 'Andhra Pradesh', code: 'APSDC' },
  { state: 'Karnataka', code: 'KDC' },
  { state: 'Kerala', code: 'KSDC' },
  { state: 'Tamil Nadu', code: 'TNSDC' },
  { state: 'Maharashtra', code: 'MDC' },
  { state: 'Gujarat', code: 'GDC' },
  { state: 'Rajasthan', code: 'RSDC' },
  { state: 'Delhi', code: 'DDC' },
  { state: 'Uttar Pradesh', code: 'UPSDC' },
  { state: 'West Bengal', code: 'WBDC' },
  { state: 'Telangana', code: 'TSDC' },
  { state: 'Punjab', code: 'PSDC' },
  { state: 'Haryana', code: 'HSDC' },
  { state: 'Madhya Pradesh', code: 'MPSDC' },
  { state: 'Bihar', code: 'BSDC' },
  { state: 'Odisha', code: 'OSDC' },
  { state: 'Other', code: 'OTHER' },
] as const

export type Qualification = typeof QUALIFICATIONS[number]['id']
export type Specialization = typeof SPECIALIZATIONS[number]['id']

export interface DentistProfile {
  // Basic Info
  fullName: string
  phone: string
  email: string
  
  // Professional Info
  dentalCouncilState: string
  dentalCouncilNumber: string
  qualification: Qualification | null
  specialization: Specialization | null
  yearsOfExperience: number | null
  
  // Clinic Info
  clinicName: string
  clinicAddress: string
  clinicCity: string
  clinicState: string
  clinicPincode: string
  clinicPhone: string
  
  // Preferences
  gstNumber?: string
  preferredPaymentMethod?: string
}

interface AuthState {
  // Auth state
  isAuthenticated: boolean
  isOnboardingComplete: boolean
  onboardingStep: number
  
  // Profile data
  profile: DentistProfile
  
  // OTP state
  otpSent: boolean
  otpVerified: boolean
  
  // Actions
  setOnboardingStep: (step: number) => void
  nextOnboardingStep: () => void
  prevOnboardingStep: () => void
  
  updateProfile: (data: Partial<DentistProfile>) => void
  
  sendOTP: (phone: string) => Promise<boolean>
  verifyOTP: (otp: string) => Promise<boolean>
  
  completeOnboarding: () => void
  logout: () => void
  resetOnboarding: () => void
}

const initialProfile: DentistProfile = {
  fullName: '',
  phone: '',
  email: '',
  dentalCouncilState: '',
  dentalCouncilNumber: '',
  qualification: null,
  specialization: null,
  yearsOfExperience: null,
  clinicName: '',
  clinicAddress: '',
  clinicCity: '',
  clinicState: '',
  clinicPincode: '',
  clinicPhone: '',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isOnboardingComplete: false,
      onboardingStep: 1,
      profile: initialProfile,
      otpSent: false,
      otpVerified: false,
      
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      nextOnboardingStep: () => set((state) => ({ 
        onboardingStep: Math.min(state.onboardingStep + 1, 6) 
      })),
      
      prevOnboardingStep: () => set((state) => ({ 
        onboardingStep: Math.max(state.onboardingStep - 1, 1) 
      })),
      
      updateProfile: (data) => set((state) => ({
        profile: { ...state.profile, ...data }
      })),
      
      sendOTP: async (phone) => {
        // Simulate OTP sending
        await new Promise(resolve => setTimeout(resolve, 1000))
        set({ otpSent: true, profile: { ...get().profile, phone } })
        return true
      },
      
      verifyOTP: async (otp) => {
        // Simulate OTP verification (accept any 6-digit code for demo)
        await new Promise(resolve => setTimeout(resolve, 1500))
        if (otp.length === 6) {
          set({ otpVerified: true, isAuthenticated: true })
          return true
        }
        return false
      },
      
      completeOnboarding: () => set({ 
        isOnboardingComplete: true,
        onboardingStep: 6
      }),
      
      logout: () => set({
        isAuthenticated: false,
        isOnboardingComplete: false,
        onboardingStep: 1,
        profile: initialProfile,
        otpSent: false,
        otpVerified: false,
      }),
      
      resetOnboarding: () => set({
        isOnboardingComplete: false,
        onboardingStep: 1,
        otpSent: false,
        otpVerified: false,
      }),
    }),
    {
      name: 'dentconnect-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isOnboardingComplete: state.isOnboardingComplete,
        profile: state.profile,
        otpVerified: state.otpVerified,
      }),
    }
  )
)

// Helper to format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length <= 5) return cleaned
  if (cleaned.length <= 10) return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7, 12)}`
}

// Helper to validate dental council number format
export const validateDentalCouncilNumber = (number: string): boolean => {
  // Basic validation - alphanumeric, 5-15 characters
  return /^[A-Za-z0-9/-]{5,20}$/.test(number)
}

// Helper to validate pincode
export const validatePincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode)
}
