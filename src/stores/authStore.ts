import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// User role types
export type UserRole = 'doctor' | 'lab' | null

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

// Lab services offered
export const LAB_SERVICES = [
  { id: 'crowns', label: 'Crowns', category: 'fixed' },
  { id: 'bridges', label: 'Bridges', category: 'fixed' },
  { id: 'veneers', label: 'Veneers', category: 'fixed' },
  { id: 'inlays_onlays', label: 'Inlays & Onlays', category: 'fixed' },
  { id: 'full_dentures', label: 'Full Dentures', category: 'removable' },
  { id: 'partial_dentures', label: 'Partial Dentures', category: 'removable' },
  { id: 'immediate_dentures', label: 'Immediate Dentures', category: 'removable' },
  { id: 'implant_crowns', label: 'Implant Crowns', category: 'implant' },
  { id: 'implant_bridges', label: 'Implant Bridges', category: 'implant' },
  { id: 'all_on_x', label: 'All-on-X', category: 'implant' },
  { id: 'surgical_guides', label: 'Surgical Guides', category: 'digital' },
  { id: 'night_guards', label: 'Night Guards', category: 'appliance' },
  { id: 'retainers', label: 'Retainers', category: 'appliance' },
  { id: 'clear_aligners', label: 'Clear Aligners', category: 'ortho' },
  { id: 'orthodontic_appliances', label: 'Orthodontic Appliances', category: 'ortho' },
  { id: 'waxups', label: 'Diagnostic Wax-ups', category: 'diagnostic' },
  { id: 'models', label: 'Study Models', category: 'diagnostic' },
] as const

// Lab materials
export const LAB_MATERIALS = [
  { id: 'pfm', label: 'PFM (Porcelain Fused to Metal)', category: 'metal_ceramic' },
  { id: 'zirconia', label: 'Zirconia', category: 'ceramic' },
  { id: 'emax', label: 'E.max (Lithium Disilicate)', category: 'ceramic' },
  { id: 'full_metal', label: 'Full Metal', category: 'metal' },
  { id: 'gold', label: 'Gold', category: 'metal' },
  { id: 'acrylic', label: 'Acrylic', category: 'resin' },
  { id: 'flexible', label: 'Flexible Denture Material', category: 'resin' },
  { id: 'peek', label: 'PEEK', category: 'advanced' },
  { id: 'titanium', label: 'Titanium', category: 'implant' },
  { id: 'composite', label: 'Composite', category: 'resin' },
] as const

// Lab equipment/technology
export const LAB_EQUIPMENT = [
  { id: 'cad_cam', label: 'CAD/CAM System' },
  { id: '3d_printer', label: '3D Printer' },
  { id: 'intraoral_scanner', label: 'Intraoral Scanner Compatible' },
  { id: 'milling_machine', label: 'Milling Machine' },
  { id: 'sintering_furnace', label: 'Sintering Furnace' },
  { id: 'pressing_furnace', label: 'Pressing Furnace' },
  { id: 'articulator', label: 'Semi/Fully Adjustable Articulator' },
  { id: 'digital_shade', label: 'Digital Shade Matching' },
] as const

// Lab certifications
export const LAB_CERTIFICATIONS = [
  { id: 'iso_9001', label: 'ISO 9001:2015' },
  { id: 'iso_13485', label: 'ISO 13485 (Medical Devices)' },
  { id: 'fda_registered', label: 'FDA Registered' },
  { id: 'ce_marked', label: 'CE Marked' },
  { id: 'nadl', label: 'NADL Certified' },
  { id: 'cdt', label: 'CDT Certified Technicians' },
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
export type LabService = typeof LAB_SERVICES[number]['id']
export type LabMaterial = typeof LAB_MATERIALS[number]['id']
export type LabEquipment = typeof LAB_EQUIPMENT[number]['id']
export type LabCertification = typeof LAB_CERTIFICATIONS[number]['id']

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

export interface LabProfile {
  // Basic Info
  ownerName: string
  phone: string
  email: string
  
  // Lab Info
  labName: string
  labAddress: string
  labCity: string
  labState: string
  labPincode: string
  labPhone: string
  yearsInBusiness: number | null
  
  // Services & Capabilities
  services: LabService[]
  materials: LabMaterial[]
  equipment: LabEquipment[]
  certifications: LabCertification[]
  
  // Turnaround & Delivery
  standardTurnaround: number // days
  rushAvailable: boolean
  rushTurnaround: number // days
  pickupAvailable: boolean
  deliveryAvailable: boolean
  deliveryRadius: number // km
  
  // Business Info
  gstNumber: string
  panNumber: string
  bankAccountNumber: string
  bankIfscCode: string
  bankName: string
  
  // Working Hours
  workingDays: string[] // ['monday', 'tuesday', ...]
  openTime: string // '09:00'
  closeTime: string // '18:00'
  
  // Profile
  description: string
  profileImage: string
  galleryImages: string[]
}

interface AuthState {
  // Auth state
  isAuthenticated: boolean
  isOnboardingComplete: boolean
  onboardingStep: number
  userRole: UserRole
  
  // Profile data
  profile: DentistProfile
  labProfile: LabProfile
  
  // OTP state
  otpSent: boolean
  otpVerified: boolean
  
  // Actions
  setUserRole: (role: UserRole) => void
  setOnboardingStep: (step: number) => void
  nextOnboardingStep: () => void
  prevOnboardingStep: () => void
  
  updateProfile: (data: Partial<DentistProfile>) => void
  updateLabProfile: (data: Partial<LabProfile>) => void
  
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

const initialLabProfile: LabProfile = {
  ownerName: '',
  phone: '',
  email: '',
  labName: '',
  labAddress: '',
  labCity: '',
  labState: '',
  labPincode: '',
  labPhone: '',
  yearsInBusiness: null,
  services: [],
  materials: [],
  equipment: [],
  certifications: [],
  standardTurnaround: 7,
  rushAvailable: false,
  rushTurnaround: 3,
  pickupAvailable: true,
  deliveryAvailable: false,
  deliveryRadius: 10,
  gstNumber: '',
  panNumber: '',
  bankAccountNumber: '',
  bankIfscCode: '',
  bankName: '',
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  openTime: '09:00',
  closeTime: '18:00',
  description: '',
  profileImage: '',
  galleryImages: [],
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isOnboardingComplete: false,
      onboardingStep: 1,
      userRole: null,
      profile: initialProfile,
      labProfile: initialLabProfile,
      otpSent: false,
      otpVerified: false,
      
      setUserRole: (role) => set({ userRole: role }),
      
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      nextOnboardingStep: () => set((state) => ({ 
        onboardingStep: Math.min(state.onboardingStep + 1, 7) 
      })),
      
      prevOnboardingStep: () => set((state) => ({ 
        onboardingStep: Math.max(state.onboardingStep - 1, 1) 
      })),
      
      updateProfile: (data) => set((state) => ({
        profile: { ...state.profile, ...data }
      })),
      
      updateLabProfile: (data) => set((state) => ({
        labProfile: { ...state.labProfile, ...data }
      })),
      
      sendOTP: async (phone) => {
        // Simulate OTP sending
        await new Promise(resolve => setTimeout(resolve, 1000))
        const role = get().userRole
        if (role === 'doctor') {
          set({ otpSent: true, profile: { ...get().profile, phone } })
        } else {
          set({ otpSent: true, labProfile: { ...get().labProfile, phone } })
        }
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
        onboardingStep: 7
      }),
      
      logout: () => set({
        isAuthenticated: false,
        isOnboardingComplete: false,
        onboardingStep: 1,
        userRole: null,
        profile: initialProfile,
        labProfile: initialLabProfile,
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
        userRole: state.userRole,
        profile: state.profile,
        labProfile: state.labProfile,
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
