import { create } from 'zustand'

export type CaseType = 'crown' | 'bridge' | 'denture' | 'implant' | null
export type Priority = 'normal' | 'urgent' | 'rush'
export type ImpressionMaterial = 'alginate' | 'pvs' | 'polyether' | 'digital_scan' | null
export type DentureType = 'full' | 'partial' | null
export type DentureArch = 'upper' | 'lower' | 'both' | null
export type BridgeType = 'conventional' | 'cantilever' | 'maryland' | null

// Bridge-specific data
export interface BridgeData {
  bridgeType: BridgeType
  startTooth: string | null
  endTooth: string | null
  abutments: string[]  // Teeth that are present (will get crowns)
  pontics: string[]    // Positions that are missing (will be replaced)
  units: number
}

// Denture-specific data
export interface DentureData {
  dentureType: DentureType
  arch: DentureArch
  missingTeeth: string[]  // For partial dentures
}

// Implant-specific data
export interface ImplantData {
  positions: string[]
  implantSystem: string | null
  abutmentType: string | null
}

export interface OrderFormState {
  step: number
  labId: string | null
  caseType: CaseType
  
  // Crown: individual teeth selection
  selectedTeeth: string[]
  
  // Bridge-specific
  bridgeData: BridgeData
  
  // Denture-specific
  dentureData: DentureData
  
  // Implant-specific
  implantData: ImplantData
  
  hasImpression: boolean
  impressionMaterial: ImpressionMaterial
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
  
  // Crown actions
  setSelectedTeeth: (teeth: string[]) => void
  toggleTooth: (tooth: string) => void
  
  // Bridge actions
  setBridgeData: (data: Partial<BridgeData>) => void
  setBridgeRange: (start: string, end: string) => void
  toggleAbutment: (tooth: string) => void
  
  // Denture actions
  setDentureData: (data: Partial<DentureData>) => void
  
  // Implant actions
  setImplantData: (data: Partial<ImplantData>) => void
  toggleImplantPosition: (position: string) => void
  
  setHasImpression: (hasImpression: boolean) => void
  setImpressionMaterial: (material: ImpressionMaterial) => void
  setMaterial: (material: string) => void
  setShade: (shade: string) => void
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  setInstructions: (instructions: string) => void
  setPriority: (priority: Priority) => void
  setDeliveryDate: (date: Date) => void
  setPatientInfo: (name: string, age: string, gender: 'male' | 'female' | 'other') => void
  reset: () => void
  
  // Helper to get display summary of teeth selection
  getTeethSummary: () => string
}

const initialBridgeData: BridgeData = {
  bridgeType: 'conventional',
  startTooth: null,
  endTooth: null,
  abutments: [],
  pontics: [],
  units: 0,
}

const initialDentureData: DentureData = {
  dentureType: null,
  arch: null,
  missingTeeth: [],
}

const initialImplantData: ImplantData = {
  positions: [],
  implantSystem: null,
  abutmentType: null,
}

const initialState = {
  step: 1,
  labId: null,
  caseType: null as CaseType,
  selectedTeeth: [] as string[],
  bridgeData: { ...initialBridgeData },
  dentureData: { ...initialDentureData },
  implantData: { ...initialImplantData },
  hasImpression: false,
  impressionMaterial: null as ImpressionMaterial,
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

// Helper to get all teeth in a range (FDI notation)
function getTeethInRange(start: string, end: string): string[] {
  const startNum = parseInt(start)
  const endNum = parseInt(end)
  
  // Determine quadrant
  const startQuadrant = Math.floor(startNum / 10)
  const endQuadrant = Math.floor(endNum / 10)
  
  if (startQuadrant !== endQuadrant) {
    // Cross-quadrant not supported for bridge
    return []
  }
  
  const teeth: string[] = []
  const startTooth = startNum % 10
  const endTooth = endNum % 10
  
  const minTooth = Math.min(startTooth, endTooth)
  const maxTooth = Math.max(startTooth, endTooth)
  
  for (let i = minTooth; i <= maxTooth; i++) {
    teeth.push(`${startQuadrant}${i}`)
  }
  
  return teeth
}

export const useOrderStore = create<OrderFormState>((set, get) => ({
  ...initialState,
  
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 8) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setLabId: (labId) => set({ labId }),
  setCaseType: (caseType) => set({ 
    caseType,
    // Reset case-specific data when changing type
    selectedTeeth: [],
    bridgeData: { ...initialBridgeData },
    dentureData: { ...initialDentureData },
    implantData: { ...initialImplantData },
  }),
  
  // Crown actions
  setSelectedTeeth: (selectedTeeth) => set({ selectedTeeth }),
  toggleTooth: (tooth) => set((state) => ({
    selectedTeeth: state.selectedTeeth.includes(tooth)
      ? state.selectedTeeth.filter(t => t !== tooth)
      : [...state.selectedTeeth, tooth]
  })),
  
  // Bridge actions
  setBridgeData: (data) => set((state) => ({
    bridgeData: { ...state.bridgeData, ...data }
  })),
  setBridgeRange: (start, end) => {
    const teethInRange = getTeethInRange(start, end)
    set((state) => ({
      bridgeData: {
        ...state.bridgeData,
        startTooth: start,
        endTooth: end,
        units: teethInRange.length,
        // Default: first and last are abutments, middle are pontics
        abutments: teethInRange.length >= 2 
          ? [teethInRange[0], teethInRange[teethInRange.length - 1]]
          : teethInRange,
        pontics: teethInRange.length > 2 
          ? teethInRange.slice(1, -1)
          : [],
      }
    }))
  },
  toggleAbutment: (tooth) => set((state) => {
    const { abutments, pontics } = state.bridgeData
    if (abutments.includes(tooth)) {
      // Move from abutment to pontic
      return {
        bridgeData: {
          ...state.bridgeData,
          abutments: abutments.filter(t => t !== tooth),
          pontics: [...pontics, tooth].sort(),
        }
      }
    } else if (pontics.includes(tooth)) {
      // Move from pontic to abutment
      return {
        bridgeData: {
          ...state.bridgeData,
          pontics: pontics.filter(t => t !== tooth),
          abutments: [...abutments, tooth].sort(),
        }
      }
    }
    return state
  }),
  
  // Denture actions
  setDentureData: (data) => set((state) => ({
    dentureData: { ...state.dentureData, ...data }
  })),
  
  // Implant actions
  setImplantData: (data) => set((state) => ({
    implantData: { ...state.implantData, ...data }
  })),
  toggleImplantPosition: (position) => set((state) => ({
    implantData: {
      ...state.implantData,
      positions: state.implantData.positions.includes(position)
        ? state.implantData.positions.filter(p => p !== position)
        : [...state.implantData.positions, position]
    }
  })),
  
  setHasImpression: (hasImpression) => set({ hasImpression }),
  setImpressionMaterial: (impressionMaterial) => set({ impressionMaterial }),
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
  reset: () => set({
    ...initialState,
    bridgeData: { ...initialBridgeData },
    dentureData: { ...initialDentureData },
    implantData: { ...initialImplantData },
  }),
  
  // Helper to get display summary
  getTeethSummary: () => {
    const state = get()
    switch (state.caseType) {
      case 'crown':
        return state.selectedTeeth.length > 0 
          ? state.selectedTeeth.sort().join(', ')
          : 'No teeth selected'
      case 'bridge':
        if (state.bridgeData.startTooth && state.bridgeData.endTooth) {
          return `${state.bridgeData.units}-unit bridge (${state.bridgeData.startTooth}-${state.bridgeData.endTooth})`
        }
        return 'No range selected'
      case 'denture':
        if (state.dentureData.dentureType === 'full') {
          return `Full ${state.dentureData.arch || ''} denture`
        } else if (state.dentureData.dentureType === 'partial') {
          return `Partial denture (${state.dentureData.missingTeeth.length} teeth)`
        }
        return 'Not configured'
      case 'implant':
        return state.implantData.positions.length > 0
          ? `Implants: ${state.implantData.positions.sort().join(', ')}`
          : 'No positions selected'
      default:
        return ''
    }
  },
}))

// Mock orders for demonstration
export interface Order {
  id: string
  labId: string
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
    labId: 'lab-1',
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
    labId: 'lab-2',
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
    labId: 'lab-3',
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
