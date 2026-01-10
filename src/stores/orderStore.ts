import { create } from 'zustand'

export type CaseType = 'crown' | 'bridge' | 'denture' | 'implant' | null
export type Priority = 'normal' | 'urgent' | 'rush'

export interface OrderFormState {
  step: number
  labId: string | null
  caseType: CaseType
  selectedTeeth: string[]
  material: string | null
  shade: string | null
  photos: string[]
  instructions: string
  priority: Priority
  deliveryDate: Date | null
  patientName: string
  patientAge: string
  patientGender: 'male' | 'female' | 'other' | null
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setLabId: (labId: string) => void
  setCaseType: (caseType: CaseType) => void
  setSelectedTeeth: (teeth: string[]) => void
  toggleTooth: (tooth: string) => void
  setMaterial: (material: string) => void
  setShade: (shade: string) => void
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  setInstructions: (instructions: string) => void
  setPriority: (priority: Priority) => void
  setDeliveryDate: (date: Date) => void
  setPatientInfo: (name: string, age: string, gender: 'male' | 'female' | 'other') => void
  reset: () => void
}

const initialState = {
  step: 1,
  labId: null,
  caseType: null as CaseType,
  selectedTeeth: [] as string[],
  material: null,
  shade: null,
  photos: [] as string[],
  instructions: '',
  priority: 'normal' as Priority,
  deliveryDate: null,
  patientName: '',
  patientAge: '',
  patientGender: null as 'male' | 'female' | 'other' | null,
}

export const useOrderStore = create<OrderFormState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 7) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setLabId: (labId) => set({ labId }),
  setCaseType: (caseType) => set({ caseType }),
  setSelectedTeeth: (selectedTeeth) => set({ selectedTeeth }),
  toggleTooth: (tooth) => set((state) => ({
    selectedTeeth: state.selectedTeeth.includes(tooth)
      ? state.selectedTeeth.filter(t => t !== tooth)
      : [...state.selectedTeeth, tooth]
  })),
  setMaterial: (material) => set({ material }),
  setShade: (shade) => set({ shade }),
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  removePhoto: (index) => set((state) => ({ 
    photos: state.photos.filter((_, i) => i !== index) 
  })),
  setInstructions: (instructions) => set({ instructions }),
  setPriority: (priority) => set({ priority }),
  setDeliveryDate: (deliveryDate) => set({ deliveryDate }),
  setPatientInfo: (patientName, patientAge, patientGender) => set({ 
    patientName, 
    patientAge, 
    patientGender 
  }),
  reset: () => set(initialState),
}))

// Mock orders for demonstration
export interface Order {
  id: string
  labName: string
  labImage: string
  caseType: string
  teeth: string[]
  material: string
  shade: string
  status: string
  createdAt: Date
  estimatedDelivery: Date
  priority: Priority
  totalAmount: number
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    labName: 'Precision Dental Lab',
    labImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&h=100&fit=crop',
    caseType: 'Crown',
    teeth: ['21', '22'],
    material: 'Zirconia Layered',
    shade: 'A2',
    status: 'processing',
    createdAt: new Date('2024-01-08'),
    estimatedDelivery: new Date('2024-01-15'),
    priority: 'normal',
    totalAmount: 18000,
  },
  {
    id: 'ORD-2024-002',
    labName: 'Elite Prosthodontics',
    labImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop',
    caseType: 'Bridge',
    teeth: ['35', '36', '37'],
    material: 'Zirconia Bridge',
    shade: 'A3',
    status: 'quality',
    createdAt: new Date('2024-01-06'),
    estimatedDelivery: new Date('2024-01-12'),
    priority: 'urgent',
    totalAmount: 25000,
  },
  {
    id: 'ORD-2024-003',
    labName: 'Smile Crafters Lab',
    labImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=100&h=100&fit=crop',
    caseType: 'Denture',
    teeth: ['Upper Arch'],
    material: 'Flexible Denture',
    shade: 'B2',
    status: 'received',
    createdAt: new Date('2024-01-09'),
    estimatedDelivery: new Date('2024-01-18'),
    priority: 'normal',
    totalAmount: 10000,
  },
]
