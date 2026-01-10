import { create } from 'zustand'

export type CaseType = 'crown' | 'bridge' | 'denture' | 'implant' | 'veneer' | 'inlay_onlay' | 'night_guard' | 'retainer' | 'waxup' | 'full_mouth_rehab' | 'surgical_guide' | 'all_on_x' | 'bleaching_tray' | 'sports_guard' | 'clear_aligner' | 'provisional' | null
export type Priority = 'normal' | 'urgent' | 'rush'
export type ImpressionMaterial = 'alginate' | 'pvs' | 'polyether' | 'digital_scan' | null
export type DentureType = 'full' | 'partial' | 'immediate' | 'overdenture' | 'obturator' | null
export type DentureArch = 'upper' | 'lower' | 'both' | null
export type DentureStage = 'primary_impression' | 'custom_tray' | 'bite_registration' | 'wax_try_in' | 'final_finish' | null
export type BasePlateType = 'acrylic' | 'metal_cobalt' | 'flexible' | 'combination' | null
export type AttachmentType = 'ball' | 'locator' | 'bar' | 'era' | null
export type TeethMould = 'square' | 'ovoid' | 'tapering' | 'match_existing' | null
export type BridgeType = 'conventional' | 'cantilever' | 'maryland' | 'precision_attachment' | null
export type PonticDesign = 'ridge_lap' | 'modified_ridge_lap' | 'sanitary' | 'ovate' | null
export type MarginType = 'shoulder' | 'chamfer' | 'knife_edge' | 'feather_edge' | null
export type CrownSubtype = 'full' | 'three_quarter' | null
export type OcclusalReduction = 'standard' | 'minimal' | 'extensive' | null
export type OpposingDentition = 'natural' | 'crown' | 'denture' | 'implant' | null
export type PostType = 'fiber' | 'metal' | 'cast' | null
export type VeneerType = 'porcelain' | 'composite' | 'minimal_prep' | 'no_prep' | null
export type IncisalOverlap = 'no_overlap' | 'butt_joint' | 'overlap' | 'full_coverage' | null
export type ContactDesign = 'point' | 'broad' | null
export type InlayOnlayType = 'inlay' | 'onlay' | 'overlay' | null
export type SurfaceInvolvement = string // e.g., 'MOD', 'MO', 'DO', 'O', etc.
export type NightGuardType = 'soft' | 'hard' | 'dual_laminate' | null
export type OcclusalScheme = 'flat_plane' | 'canine_guidance' | 'group_function' | null
export type RampDesign = 'none' | 'anterior_ramp' | 'posterior_discluder' | null
export type RetainerType = 'hawley' | 'essix' | 'fixed_bonded' | null
export type WireType = 'round' | 'braided' | 'flat' | 'fiber' | null
export type RetainerSpan = '3_3' | '4_4' | '5_5' | '6_6' | null
export type ClaspDesign = 'c_clasp' | 'i_bar' | 'wrought_wire' | 'precision_attachment' | null
export type ImplantRestorationType = 'screw_retained' | 'cement_retained' | null
export type ConnectionType = 'internal_hex' | 'external_hex' | 'morse_taper' | 'multi_unit' | null

// Crown-specific data
export interface CrownData {
  crownSubtype: CrownSubtype
  marginType: MarginType
  needsPostCore: boolean | undefined
  postType: PostType
  occlusalReduction: OcclusalReduction
  opposingDentition: OpposingDentition
  splinted: boolean
}

// Bridge-specific data
export interface BridgeData {
  bridgeType: BridgeType
  ponticDesign: PonticDesign
  startTooth: string | null
  endTooth: string | null
  abutments: string[]  // Teeth that are present (will get crowns)
  pontics: string[]    // Positions that are missing (will be replaced)
  units: number
  attachmentPositions: string[]  // For precision attachment: which abutment(s) get the attachment
}

// Denture-specific data
export interface DentureData {
  dentureType: DentureType
  arch: DentureArch
  stage: DentureStage  // Current fabrication stage
  missingTeeth: string[]  // For partial dentures
  claspDesign: ClaspDesign  // For partial dentures
  basePlateType: BasePlateType  // For partial dentures
  implantPositions: string[]  // For overdentures
  attachmentType: AttachmentType  // For overdentures
  teethMould: TeethMould  // Teeth shape preference
  teethSize: 'small' | 'medium' | 'large' | null
}

// Implant-specific data
export type ImplantStage = 'healing' | 'ready' | 'impression_taken' | null
export type PlatformSize = 'narrow' | 'regular' | 'wide' | 'extra_wide' | null
export type ImpressionTechnique = 'open_tray' | 'closed_tray' | 'digital_scan' | null

export interface ImplantData {
  positions: string[]
  implantStage: ImplantStage
  implantSystem: string | null
  platformSize: PlatformSize
  implantDiameter: string | null
  implantLength: string | null
  connectionType: ConnectionType
  impressionTechnique: ImpressionTechnique
  componentsIncluded: string[]  // impression_coping, implant_analog, healing_abutment, etc.
  restorationType: ImplantRestorationType
  abutmentType: string | null
  healingAbutmentHeight: string | null
  healingAbutmentDiameter: string | null
}

// Veneer-specific data
export interface VeneerData {
  veneerType: VeneerType
  selectedTeeth: string[]
  incisalOverlap: IncisalOverlap
  contactDesign: ContactDesign
  needsTryIn: boolean
  lengthModification: 'shorter' | 'same' | 'longer' | null
}

// Inlay/Onlay-specific data
export interface InlayOnlayData {
  type: InlayOnlayType
  selectedTeeth: string[]
  surfaceInvolvement: Record<string, SurfaceInvolvement>  // { "36": "MOD", "46": "DO" }
}

// Night Guard/Splint data
export interface NightGuardData {
  guardType: NightGuardType
  arch: DentureArch
  thickness: 'thin' | 'medium' | 'thick' | null
  occlusalScheme: OcclusalScheme  // For hard splints
  rampDesign: RampDesign  // For TMJ cases
  tmjSymptoms: string[]  // clicking, popping, locking, pain, limited_opening
}

// Retainer data
export interface RetainerData {
  retainerType: RetainerType
  arch: DentureArch
  wireType: WireType  // For fixed/bonded
  span: RetainerSpan  // 3-3, 4-4, 5-5, 6-6
  claspType: string | null  // For Hawley
}

// Wax-up/Study Model data
export interface WaxupData {
  purpose: 'diagnostic' | 'provisional' | 'smile_design' | null
  selectedTeeth: string[]
}

// Full Mouth Rehabilitation data
export type FMRStage = 'diagnostic' | 'provisionals' | 'final_upper' | 'final_lower' | 'final_both' | null
export type OVDChange = 'maintain' | 'increase_1_2mm' | 'increase_2_4mm' | 'increase_4plus' | null
export type TreatmentApproach = 'segmented' | 'full_arch' | 'quadrant' | null

export interface FMRData {
  stage: FMRStage
  ovdChange: OVDChange
  currentOVD: string | null  // mm measurement
  proposedOVD: string | null  // mm measurement
  treatmentApproach: TreatmentApproach
  
  // Diagnostic records
  hasFacebowRecord: boolean
  hasCRRecord: boolean  // Centric Relation
  hasDiagnosticWaxup: boolean
  
  // Treatment plan
  upperArchPlan: string[]  // Array of restoration types: crown, bridge, implant, veneer
  lowerArchPlan: string[]
  
  // Teeth involved
  upperTeeth: string[]
  lowerTeeth: string[]
  
  // Special considerations
  guideplane: 'anterior' | 'canine' | 'group_function' | null
  smileDesign: boolean
  deprogrammer: boolean  // Anterior deprogrammer used?
}

// Surgical Guide data
export type GuideType = 'tooth_supported' | 'mucosa_supported' | 'bone_supported' | null
export type SurgeryType = 'pilot_drill' | 'fully_guided' | 'stackable' | null

export interface SurgicalGuideData {
  guideType: GuideType
  surgeryType: SurgeryType
  implantPositions: string[]
  implantSystem: string | null
  sleeveSize: string | null  // e.g., "5.0mm"
  hasDigitalScan: boolean
  hasCBCT: boolean
  needsRestrictionSleeve: boolean
}

// All-on-X (Full Arch Implant) data
export type AllOnXType = 'all_on_4' | 'all_on_6' | 'zygomatic' | null
export type HybridMaterial = 'pmma' | 'zirconia' | 'titanium_acrylic' | 'peek' | null

export interface AllOnXData {
  arch: DentureArch
  type: AllOnXType
  stage: 'conversion' | 'immediate_load' | 'final' | null
  implantSystem: string | null
  implantPositions: string[]
  tiBarIncluded: boolean
  material: HybridMaterial
  hasMultiUnitAbutments: boolean
  screwAccessPosition: 'palatal' | 'occlusal' | null
}

// Bleaching Tray data
export interface BleachingTrayData {
  arch: DentureArch
  reservoirIncluded: boolean  // Space for bleaching gel
  scalloped: boolean  // Follows gingival margin
  thickness: 'thin' | 'medium' | 'thick' | null
}

// Sports Guard data
export type SportsGuardType = 'stock' | 'boil_bite' | 'custom' | 'professional' | null
export type SportLevel = 'low_risk' | 'medium_risk' | 'high_risk' | null

export interface SportsGuardData {
  guardType: SportsGuardType
  arch: DentureArch
  thickness: 'standard' | 'heavy' | 'extra_heavy' | null
  sportLevel: SportLevel
  sportType: string | null  // e.g., "boxing", "football"
  color: string | null
  hasLabialBar: boolean  // For added protection
}

// Clear Aligner data
export type AlignerStage = 'records' | 'refinement' | 'retainer' | null

export interface ClearAlignerData {
  stage: AlignerStage
  arch: DentureArch
  hasCBCT: boolean
  hasDigitalScan: boolean
  hasPhotos: boolean  // Extraoral/Intraoral photos
  alignerNumber: string | null  // Current aligner number
  totalAligners: string | null
  ipr: boolean  // Interproximal reduction needed
  attachments: boolean  // Composite attachments
}

// Provisional (Temporary Crown/Bridge) data
export type ProvisionalMaterial = 'pmma' | 'composite' | 'bis_acrylic' | null
export type ProvisionalDuration = 'short_term' | 'long_term' | null

export interface ProvisionalData {
  type: 'crown' | 'bridge' | 'full_arch' | null
  material: ProvisionalMaterial
  duration: ProvisionalDuration
  selectedTeeth: string[]
  needsCustomStaining: boolean
  hasDigitalDesign: boolean  // From wax-up or digital design
}

export interface OrderFormState {
  step: number
  labId: string | null
  caseType: CaseType
  
  // Patient Info (important for aesthetics decisions)
  patientName: string
  patientAge: string
  patientGender: 'male' | 'female' | 'other' | null
  
  // Crown: individual teeth selection
  selectedTeeth: string[]
  crownData: CrownData
  
  // Bridge-specific
  bridgeData: BridgeData
  
  // Denture-specific
  dentureData: DentureData
  
  // Implant-specific
  implantData: ImplantData
  
  // Veneer-specific
  veneerData: VeneerData
  
  // Inlay/Onlay-specific
  inlayOnlayData: InlayOnlayData
  
  // Night Guard-specific
  nightGuardData: NightGuardData
  
  // Retainer-specific
  retainerData: RetainerData
  
  // Wax-up-specific
  waxupData: WaxupData
  
  // Full Mouth Rehab-specific
  fmrData: FMRData
  
  // Surgical Guide-specific
  surgicalGuideData: SurgicalGuideData
  
  // All-on-X-specific
  allOnXData: AllOnXData
  
  // Bleaching Tray-specific
  bleachingTrayData: BleachingTrayData
  
  // Sports Guard-specific
  sportsGuardData: SportsGuardData
  
  // Clear Aligner-specific
  clearAlignerData: ClearAlignerData
  
  // Provisional-specific
  provisionalData: ProvisionalData
  
  // Impression & Material
  hasImpression: boolean
  impressionMaterial: ImpressionMaterial
  hasBiteRegistration: boolean
  hasOpposingModel: boolean
  material: string | null
  shade: string | null
  stumpShade: string | null
  
  // Additional details
  photos: string[]
  instructions: string
  priority: Priority
  deliveryDate: Date | null
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setLabId: (labId: string) => void
  setCaseType: (caseType: CaseType) => void
  setPatientInfo: (name: string, age: string, gender: 'male' | 'female' | 'other') => void
  
  // Crown actions
  setSelectedTeeth: (teeth: string[]) => void
  toggleTooth: (tooth: string) => void
  setCrownData: (data: Partial<CrownData>) => void
  
  // Bridge actions
  setBridgeData: (data: Partial<BridgeData>) => void
  setBridgeRange: (start: string, end: string) => void
  toggleAbutment: (tooth: string) => void
  
  // Denture actions
  setDentureData: (data: Partial<DentureData>) => void
  
  // Implant actions
  setImplantData: (data: Partial<ImplantData>) => void
  toggleImplantPosition: (position: string) => void
  
  // Veneer actions
  setVeneerData: (data: Partial<VeneerData>) => void
  
  // Inlay/Onlay actions
  setInlayOnlayData: (data: Partial<InlayOnlayData>) => void
  
  // Night Guard actions
  setNightGuardData: (data: Partial<NightGuardData>) => void
  
  // Retainer actions
  setRetainerData: (data: Partial<RetainerData>) => void
  
  // Wax-up actions
  setWaxupData: (data: Partial<WaxupData>) => void
  
  // FMR actions
  setFMRData: (data: Partial<FMRData>) => void
  
  // Surgical Guide actions
  setSurgicalGuideData: (data: Partial<SurgicalGuideData>) => void
  
  // All-on-X actions
  setAllOnXData: (data: Partial<AllOnXData>) => void
  
  // Bleaching Tray actions
  setBleachingTrayData: (data: Partial<BleachingTrayData>) => void
  
  // Sports Guard actions
  setSportsGuardData: (data: Partial<SportsGuardData>) => void
  
  // Clear Aligner actions
  setClearAlignerData: (data: Partial<ClearAlignerData>) => void
  
  // Provisional actions
  setProvisionalData: (data: Partial<ProvisionalData>) => void
  
  setHasImpression: (hasImpression: boolean) => void
  setImpressionMaterial: (material: ImpressionMaterial) => void
  setHasBiteRegistration: (has: boolean) => void
  setHasOpposingModel: (has: boolean) => void
  setMaterial: (material: string) => void
  setShade: (shade: string) => void
  setStumpShade: (shade: string) => void
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  setInstructions: (instructions: string) => void
  setPriority: (priority: Priority) => void
  setDeliveryDate: (date: Date) => void
  reset: () => void
  
  // Helper to get display summary of teeth selection
  getTeethSummary: () => string
  
  // Helper to check if shade is needed for this case type
  needsShade: () => boolean
}

const initialCrownData: CrownData = {
  crownSubtype: 'full',
  marginType: null,
  needsPostCore: undefined,
  postType: null,
  occlusalReduction: null,
  opposingDentition: null,
  splinted: false,
}

const initialBridgeData: BridgeData = {
  bridgeType: 'conventional',
  ponticDesign: null,
  startTooth: null,
  endTooth: null,
  abutments: [],
  pontics: [],
  units: 0,
  attachmentPositions: [],
}

const initialDentureData: DentureData = {
  dentureType: null,
  arch: null,
  stage: null,
  missingTeeth: [],
  claspDesign: null,
  basePlateType: null,
  implantPositions: [],
  attachmentType: null,
  teethMould: null,
  teethSize: null,
}

const initialImplantData: ImplantData = {
  positions: [],
  implantStage: null,
  implantSystem: null,
  platformSize: null,
  implantDiameter: null,
  implantLength: null,
  connectionType: null,
  impressionTechnique: null,
  componentsIncluded: [],
  restorationType: null,
  abutmentType: null,
  healingAbutmentHeight: null,
  healingAbutmentDiameter: null,
}

const initialVeneerData: VeneerData = {
  veneerType: null,
  selectedTeeth: [],
  incisalOverlap: null,
  contactDesign: null,
  needsTryIn: false,
  lengthModification: null,
}

const initialInlayOnlayData: InlayOnlayData = {
  type: null,
  selectedTeeth: [],
  surfaceInvolvement: {},
}

const initialNightGuardData: NightGuardData = {
  guardType: null,
  arch: null,
  thickness: null,
  occlusalScheme: null,
  rampDesign: null,
  tmjSymptoms: [],
}

const initialRetainerData: RetainerData = {
  retainerType: null,
  arch: null,
  wireType: null,
  span: null,
  claspType: null,
}

const initialWaxupData: WaxupData = {
  purpose: null,
  selectedTeeth: [],
}

const initialFMRData: FMRData = {
  stage: null,
  ovdChange: null,
  currentOVD: null,
  proposedOVD: null,
  treatmentApproach: null,
  hasFacebowRecord: false,
  hasCRRecord: false,
  hasDiagnosticWaxup: false,
  upperArchPlan: [],
  lowerArchPlan: [],
  upperTeeth: [],
  lowerTeeth: [],
  guideplane: null,
  smileDesign: false,
  deprogrammer: false,
}

const initialSurgicalGuideData: SurgicalGuideData = {
  guideType: null,
  surgeryType: null,
  implantPositions: [],
  implantSystem: null,
  sleeveSize: null,
  hasDigitalScan: false,
  hasCBCT: false,
  needsRestrictionSleeve: false,
}

const initialAllOnXData: AllOnXData = {
  arch: null,
  type: null,
  stage: null,
  implantSystem: null,
  implantPositions: [],
  tiBarIncluded: false,
  material: null,
  hasMultiUnitAbutments: false,
  screwAccessPosition: null,
}

const initialBleachingTrayData: BleachingTrayData = {
  arch: null,
  reservoirIncluded: true,
  scalloped: true,
  thickness: null,
}

const initialSportsGuardData: SportsGuardData = {
  guardType: null,
  arch: null,
  thickness: null,
  sportLevel: null,
  sportType: null,
  color: null,
  hasLabialBar: false,
}

const initialClearAlignerData: ClearAlignerData = {
  stage: null,
  arch: null,
  hasCBCT: false,
  hasDigitalScan: false,
  hasPhotos: false,
  alignerNumber: null,
  totalAligners: null,
  ipr: false,
  attachments: false,
}

const initialProvisionalData: ProvisionalData = {
  type: null,
  material: null,
  duration: null,
  selectedTeeth: [],
  needsCustomStaining: false,
  hasDigitalDesign: false,
}

const initialState = {
  step: 1,
  labId: null,
  caseType: null as CaseType,
  patientName: '',
  patientAge: '',
  patientGender: null as 'male' | 'female' | 'other' | null,
  selectedTeeth: [] as string[],
  crownData: { ...initialCrownData },
  bridgeData: { ...initialBridgeData },
  dentureData: { ...initialDentureData },
  implantData: { ...initialImplantData },
  veneerData: { ...initialVeneerData },
  inlayOnlayData: { ...initialInlayOnlayData },
  nightGuardData: { ...initialNightGuardData },
  retainerData: { ...initialRetainerData },
  waxupData: { ...initialWaxupData },
  fmrData: { ...initialFMRData },
  surgicalGuideData: { ...initialSurgicalGuideData },
  allOnXData: { ...initialAllOnXData },
  bleachingTrayData: { ...initialBleachingTrayData },
  sportsGuardData: { ...initialSportsGuardData },
  clearAlignerData: { ...initialClearAlignerData },
  provisionalData: { ...initialProvisionalData },
  hasImpression: false,
  impressionMaterial: null as ImpressionMaterial,
  hasBiteRegistration: false,
  hasOpposingModel: false,
  material: null,
  shade: null,
  stumpShade: null,
  photos: [] as string[],
  instructions: '',
  priority: 'normal' as Priority,
  deliveryDate: null,
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
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 9) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setLabId: (labId) => set({ labId }),
  setCaseType: (caseType) => set({ 
    caseType,
    // Reset case-specific data when changing type
    selectedTeeth: [],
    crownData: { ...initialCrownData },
    bridgeData: { ...initialBridgeData },
    dentureData: { ...initialDentureData },
    implantData: { ...initialImplantData },
    veneerData: { ...initialVeneerData },
    inlayOnlayData: { ...initialInlayOnlayData },
    nightGuardData: { ...initialNightGuardData },
    retainerData: { ...initialRetainerData },
    waxupData: { ...initialWaxupData },
    fmrData: { ...initialFMRData },
    surgicalGuideData: { ...initialSurgicalGuideData },
    allOnXData: { ...initialAllOnXData },
    bleachingTrayData: { ...initialBleachingTrayData },
    sportsGuardData: { ...initialSportsGuardData },
    clearAlignerData: { ...initialClearAlignerData },
    provisionalData: { ...initialProvisionalData },
  }),
  setPatientInfo: (patientName, patientAge, patientGender) => set({ 
    patientName, 
    patientAge, 
    patientGender 
  }),
  
  // Crown actions
  setSelectedTeeth: (selectedTeeth) => set({ selectedTeeth }),
  toggleTooth: (tooth) => set((state) => ({
    selectedTeeth: state.selectedTeeth.includes(tooth)
      ? state.selectedTeeth.filter(t => t !== tooth)
      : [...state.selectedTeeth, tooth]
  })),
  setCrownData: (data) => set((state) => ({
    crownData: { ...state.crownData, ...data }
  })),
  
  // Bridge actions
  setBridgeData: (data) => set((state) => ({
    bridgeData: { ...state.bridgeData, ...data }
  })),
  setBridgeRange: (start, end) => {
    // Handle reset case
    if (!start || !end) {
      set(() => ({
        bridgeData: { ...initialBridgeData }
      }))
      return
    }
    
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
  
  // Veneer actions
  setVeneerData: (data) => set((state) => ({
    veneerData: { ...state.veneerData, ...data }
  })),
  
  // Inlay/Onlay actions
  setInlayOnlayData: (data) => set((state) => ({
    inlayOnlayData: { ...state.inlayOnlayData, ...data }
  })),
  
  // Night Guard actions
  setNightGuardData: (data) => set((state) => ({
    nightGuardData: { ...state.nightGuardData, ...data }
  })),
  
  // Retainer actions
  setRetainerData: (data) => set((state) => ({
    retainerData: { ...state.retainerData, ...data }
  })),
  
  // Wax-up actions
  setWaxupData: (data) => set((state) => ({
    waxupData: { ...state.waxupData, ...data }
  })),
  
  // FMR actions
  setFMRData: (data) => set((state) => ({
    fmrData: { ...state.fmrData, ...data }
  })),
  
  // Surgical Guide actions
  setSurgicalGuideData: (data) => set((state) => ({
    surgicalGuideData: { ...state.surgicalGuideData, ...data }
  })),
  
  // All-on-X actions
  setAllOnXData: (data) => set((state) => ({
    allOnXData: { ...state.allOnXData, ...data }
  })),
  
  // Bleaching Tray actions
  setBleachingTrayData: (data) => set((state) => ({
    bleachingTrayData: { ...state.bleachingTrayData, ...data }
  })),
  
  // Sports Guard actions
  setSportsGuardData: (data) => set((state) => ({
    sportsGuardData: { ...state.sportsGuardData, ...data }
  })),
  
  // Clear Aligner actions
  setClearAlignerData: (data) => set((state) => ({
    clearAlignerData: { ...state.clearAlignerData, ...data }
  })),
  
  // Provisional actions
  setProvisionalData: (data) => set((state) => ({
    provisionalData: { ...state.provisionalData, ...data }
  })),
  
  setHasImpression: (hasImpression) => set({ hasImpression }),
  setImpressionMaterial: (impressionMaterial) => set({ impressionMaterial }),
  setHasBiteRegistration: (hasBiteRegistration) => set({ hasBiteRegistration }),
  setHasOpposingModel: (hasOpposingModel) => set({ hasOpposingModel }),
  setMaterial: (material) => set({ material }),
  setShade: (shade) => set({ shade }),
  setStumpShade: (stumpShade) => set({ stumpShade }),
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  removePhoto: (index) => set((state) => ({ 
    photos: state.photos.filter((_, i) => i !== index) 
  })),
  setInstructions: (instructions) => set({ instructions }),
  setPriority: (priority) => set({ priority }),
  setDeliveryDate: (deliveryDate) => set({ deliveryDate }),
  reset: () => set({
    ...initialState,
    crownData: { ...initialCrownData },
    bridgeData: { ...initialBridgeData },
    dentureData: { ...initialDentureData },
    implantData: { ...initialImplantData },
    veneerData: { ...initialVeneerData },
    inlayOnlayData: { ...initialInlayOnlayData },
    nightGuardData: { ...initialNightGuardData },
    retainerData: { ...initialRetainerData },
    waxupData: { ...initialWaxupData },
    fmrData: { ...initialFMRData },
    surgicalGuideData: { ...initialSurgicalGuideData },
    allOnXData: { ...initialAllOnXData },
    bleachingTrayData: { ...initialBleachingTrayData },
    sportsGuardData: { ...initialSportsGuardData },
    clearAlignerData: { ...initialClearAlignerData },
    provisionalData: { ...initialProvisionalData },
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
        } else if (state.dentureData.dentureType === 'immediate') {
          return `Immediate denture - ${state.dentureData.arch || ''}`
        } else if (state.dentureData.dentureType === 'overdenture') {
          return `Overdenture - ${state.dentureData.implantPositions.length} implants`
        } else if (state.dentureData.dentureType === 'obturator') {
          return `Obturator - ${state.dentureData.arch || ''}`
        }
        return 'Not configured'
      case 'implant':
        return state.implantData.positions.length > 0
          ? `Implants: ${state.implantData.positions.sort().join(', ')}`
          : 'No positions selected'
      case 'veneer':
        return state.veneerData.selectedTeeth.length > 0
          ? state.veneerData.selectedTeeth.sort().join(', ')
          : 'No teeth selected'
      case 'inlay_onlay':
        return state.inlayOnlayData.selectedTeeth.length > 0
          ? `${state.inlayOnlayData.type || ''}: ${state.inlayOnlayData.selectedTeeth.sort().join(', ')}`
          : 'No teeth selected'
      case 'night_guard':
        return `${state.nightGuardData.guardType || ''} guard - ${state.nightGuardData.arch || ''}`
      case 'retainer':
        return `${state.retainerData.retainerType || ''} - ${state.retainerData.arch || ''}`
      case 'waxup':
        return state.waxupData.selectedTeeth.length > 0
          ? `${state.waxupData.purpose || ''}: ${state.waxupData.selectedTeeth.sort().join(', ')}`
          : 'Not configured'
      case 'full_mouth_rehab':
        const totalTeeth = (state.fmrData.upperTeeth?.length || 0) + (state.fmrData.lowerTeeth?.length || 0)
        return totalTeeth > 0
          ? `FMR: ${totalTeeth} teeth, ${state.fmrData.stage || 'planning'}`
          : 'Full Mouth Rehabilitation'
      case 'surgical_guide':
        return state.surgicalGuideData.implantPositions.length > 0
          ? `Guide: ${state.surgicalGuideData.implantPositions.join(', ')}`
          : 'Surgical Guide'
      case 'all_on_x':
        return `All-on-${state.allOnXData.type?.replace('all_on_', '') || 'X'} - ${state.allOnXData.arch || ''}`
      case 'bleaching_tray':
        return `Bleaching Tray - ${state.bleachingTrayData.arch || ''}`
      case 'sports_guard':
        return `Sports Guard - ${state.sportsGuardData.sportType || state.sportsGuardData.sportLevel || ''}`
      case 'clear_aligner':
        return `Aligners - ${state.clearAlignerData.stage || ''}`
      case 'provisional':
        return state.provisionalData.selectedTeeth.length > 0
          ? `Provisional: ${state.provisionalData.selectedTeeth.join(', ')}`
          : 'Provisional Restoration'
      default:
        return ''
    }
  },
  
  // Helper to check if shade is needed
  needsShade: () => {
    const state = get()
    // Night guards, retainers, and full metal don't need shade
    if (state.caseType === 'night_guard' || state.caseType === 'retainer') {
      return false
    }
    // Check if material is full metal
    if (state.material === 'full-metal') {
      return false
    }
    return true
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
  instructions?: string
  patientName?: string
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
    patientName: 'Rajesh Kumar',
    instructions: 'Patient has slight crowding. Please ensure tight contact with adjacent teeth. Match shade with upper central incisors.',
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
    patientName: 'Anita Sharma',
    instructions: 'Ridge lap pontic design preferred. Abutments have minimal prep - please check for adequate clearance.',
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
