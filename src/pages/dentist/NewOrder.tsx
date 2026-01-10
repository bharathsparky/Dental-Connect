import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router-dom"
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Camera,
  X,
  Clock,
  Star,
  BadgeCheck,
  Search,
  User,
  SkipForward,
  SlidersHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CrownSelector } from "@/components/dental/CrownSelector"
import { BridgeSelector } from "@/components/dental/BridgeSelector"
import { DentureSelector } from "@/components/dental/DentureSelector"
import { ImplantSelector } from "@/components/dental/ImplantSelector"
import { VeneerSelector } from "@/components/dental/VeneerSelector"
import { InlayOnlaySelector } from "@/components/dental/InlayOnlaySelector"
import { NightGuardSelector } from "@/components/dental/NightGuardSelector"
import { RetainerSelector } from "@/components/dental/RetainerSelector"
import { WaxupSelector } from "@/components/dental/WaxupSelector"
import { FullMouthRehabSelector } from "@/components/dental/FullMouthRehabSelector"
import { SurgicalGuideSelector } from "@/components/dental/SurgicalGuideSelector"
import { AllOnXSelector } from "@/components/dental/AllOnXSelector"
import { BleachingTraySelector, SportsGuardSelector, ClearAlignerSelector, ProvisionalSelector } from "@/components/dental/SimpleSelectors"
import { ShadeGuide } from "@/components/dental/ShadeGuide"
import { MaterialSelector } from "@/components/order/MaterialSelector"
import { useOrderStore } from "@/stores/orderStore"
import type { BridgeType, CaseType, ImpressionMaterial } from "@/stores/orderStore"
import { MOCK_LABS, getLabById } from "@/data/mockLabs"
import { getMaterialById } from "@/data/materials"
import { getShadeByCode } from "@/data/vitaShades"
import { cn } from "@/lib/utils"

// Mock favorite lab IDs (in real app, this would come from user preferences)
const FAVORITE_LAB_IDS = ['lab-1', 'lab-3']

const STEPS = [
  { id: 1, title: 'Select Lab' },
  { id: 2, title: 'Case Type' },
  { id: 3, title: 'Selection' },
  { id: 4, title: 'Impression' },
  { id: 5, title: 'Material' },
  { id: 6, title: 'Shade' },
  { id: 7, title: 'Patient Info' },
  { id: 8, title: 'Details' },
  { id: 9, title: 'Review' },
]

const IMPRESSION_MATERIALS = [
  { id: 'alginate', label: 'Alginate', description: 'Cost-effective, good for study models' },
  { id: 'pvs', label: 'PVS (Addition Silicone)', description: 'High accuracy, ideal for crowns & bridges' },
  { id: 'polyether', label: 'Polyether', description: 'Excellent detail, good for implants' },
  { id: 'digital_scan', label: 'Digital Scan', description: 'Intraoral scanner, fastest turnaround' },
]

const CASE_TYPES: { id: CaseType, label: string, description: string, category: 'restoration' | 'prosthetic' | 'appliance' | 'diagnostic' }[] = [
  // Restorations
  { id: 'crown', label: 'Crown', description: 'Single/multiple tooth restorations', category: 'restoration' },
  { id: 'bridge', label: 'Bridge', description: 'Replace missing teeth with span', category: 'restoration' },
  { id: 'veneer', label: 'Veneer', description: 'Aesthetic front tooth facings', category: 'restoration' },
  { id: 'inlay_onlay', label: 'Inlay / Onlay', description: 'Conservative cusp coverage', category: 'restoration' },
  // Prosthetics
  { id: 'denture', label: 'Denture', description: 'Full or partial removable prosthesis', category: 'prosthetic' },
  { id: 'implant', label: 'Implant Crown', description: 'Implant-supported restoration', category: 'prosthetic' },
  // Appliances
  { id: 'night_guard', label: 'Night Guard', description: 'Bruxism / TMJ protection', category: 'appliance' },
  { id: 'retainer', label: 'Retainer', description: 'Orthodontic retention', category: 'appliance' },
  // Diagnostic & Complex
  { id: 'waxup', label: 'Wax-Up / Study', description: 'Diagnostic planning & visualization', category: 'diagnostic' },
  { id: 'full_mouth_rehab', label: 'Full Mouth Rehab', description: 'Comprehensive restoration', category: 'restoration' },
  // Digital & Implant
  { id: 'surgical_guide', label: 'Surgical Guide', description: 'Implant placement guide', category: 'restoration' },
  { id: 'all_on_x', label: 'All-on-X', description: 'Full arch implant prosthesis', category: 'prosthetic' },
  { id: 'provisional', label: 'Provisional', description: 'Temporary crown/bridge', category: 'restoration' },
  // Appliances
  { id: 'bleaching_tray', label: 'Bleaching Tray', description: 'Whitening trays', category: 'appliance' },
  { id: 'sports_guard', label: 'Sports Guard', description: 'Athletic mouthguard', category: 'appliance' },
  { id: 'clear_aligner', label: 'Clear Aligner', description: 'Orthodontic aligners', category: 'appliance' },
]

const PRIORITIES = [
  { id: 'normal', label: 'Standard', days: '5-7 days', price: '' },
  { id: 'urgent', label: 'Urgent', days: '3-4 days', price: '+20%' },
  { id: 'rush', label: 'Rush', days: '1-2 days', price: '+50%' },
]

const LAB_SERVICE_FILTERS = [
  { id: 'crown', label: 'Crown' },
  { id: 'bridge', label: 'Bridge' },
  { id: 'denture', label: 'Denture' },
  { id: 'implant', label: 'Implant' },
  { id: 'veneer', label: 'Veneer' },
  { id: 'night_guard', label: 'Night Guard' },
  { id: 'surgical_guide', label: 'Surgical Guide' },
]
const LAB_SORT_OPTIONS = [
  { id: 'rating', label: 'Top Rated' },
  { id: 'distance', label: 'Nearest' },
  { id: 'turnaround', label: 'Fastest' },
]
const LAB_RATING_OPTIONS = [
  { value: 4.5, label: '4.5+' },
  { value: 4.0, label: '4.0+' },
  { value: 3.5, label: '3.5+' },
]
const LAB_DELIVERY_OPTIONS = [
  { value: '3-5 days', label: '3-5 days' },
  { value: '5-7 days', label: '5-7 days' },
  { value: '7-10 days', label: '7-10 days' },
]

// Case types that don't need shade selection
const NO_SHADE_CASE_TYPES: CaseType[] = ['night_guard', 'retainer', 'waxup', 'surgical_guide', 'bleaching_tray', 'sports_guard', 'clear_aligner']

export function NewOrder() {
  const navigate = useNavigate()
  const store = useOrderStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [labSearch, setLabSearch] = useState('')
  const [labServiceFilter, setLabServiceFilter] = useState<string[]>([])
  const [labSortBy, setLabSortBy] = useState('rating')
  const [labMinRating, setLabMinRating] = useState<number | null>(null)
  const [labMaxDelivery, setLabMaxDelivery] = useState<string | null>(null)
  const [showLabFilters, setShowLabFilters] = useState(false)
  const [caseTypeSearch, setCaseTypeSearch] = useState('')

  // Auto-advance handlers for single-selection screens
  const handleLabSelect = (labId: string) => {
    store.setLabId(labId)
    // Small delay for visual feedback before advancing
    setTimeout(() => store.setStep(2), 150)
  }

  const handleCaseTypeSelect = (caseType: CaseType) => {
    store.setCaseType(caseType)
    setTimeout(() => store.setStep(3), 150)
  }

  const handleMaterialSelect = (materialId: string) => {
    store.setMaterial(materialId)
    // Skip shade step if not needed for this case type
    // Check if shade needed based on case type and the material being selected
    const skipShade = (store.caseType && NO_SHADE_CASE_TYPES.includes(store.caseType)) || 
                      materialId === 'full-metal'
    setTimeout(() => {
      if (skipShade) {
        store.setStep(7) // Skip to patient info
      } else {
        store.setStep(6)
      }
    }, 150)
  }

  const handleShadeSelect = (shade: string) => {
    store.setShade(shade)
    setTimeout(() => store.setStep(7), 150)
  }

  const handleImpressionSelect = (hasImpression: boolean) => {
    store.setHasImpression(hasImpression)
    if (!hasImpression) {
      store.setImpressionMaterial(null)
    }
    setTimeout(() => store.setStep(5), 150)
  }

  const handleImpressionMaterialSelect = (material: ImpressionMaterial) => {
    store.setImpressionMaterial(material)
    setTimeout(() => store.setStep(5), 150)
  }

  // Check if shade is needed for this case type
  const needsShade = () => {
    if (!store.caseType) return false
    if (NO_SHADE_CASE_TYPES.includes(store.caseType)) return false
    // FMR diagnostic and trial_bite stages don't need shade
    if (store.caseType === 'full_mouth_rehab' && 
        (store.fmrData.stage === 'diagnostic' || store.fmrData.stage === 'trial_bite')) return false
    // Full metal crown doesn't need shade
    if (store.material === 'full-metal') return false
    // Metal-only restorations don't need shade
    if (store.material === 'gold' || store.material === 'gold-inlay') return false
    return true
  }

  // Check if can proceed based on case type
  const canProceed = () => {
    switch (store.step) {
      case 1: return !!store.labId
      case 2: return !!store.caseType
      case 3: 
        // Different validation based on case type
        switch (store.caseType) {
          case 'crown': 
            // Need teeth + margin type for lab instructions
            return store.selectedTeeth.length > 0 && 
                   !!store.crownData.marginType
          case 'bridge': 
            // Need minimum 3-unit bridge + pontic design if pontics exist
            const hasPontics = store.bridgeData.pontics.length > 0
            return store.bridgeData.units >= 3 && 
                   (!hasPontics || !!store.bridgeData.ponticDesign)
          case 'denture': 
            // Full denture: type + arch + stage
            if (store.dentureData.dentureType === 'full') {
              return !!store.dentureData.arch && !!store.dentureData.stage
            }
            // Immediate: type + arch + stage
            if (store.dentureData.dentureType === 'immediate') {
              return !!store.dentureData.arch && !!store.dentureData.stage
            }
            // Obturator: complete workflow
            if (store.dentureData.dentureType === 'obturator') {
              return !!store.dentureData.obturatorType && 
                     !!store.dentureData.defectClass && 
                     !!store.dentureData.defectExtent && 
                     !!store.dentureData.retentionMethod
            }
            // Overdenture: implants + attachment type
            if (store.dentureData.dentureType === 'overdenture') {
              return (store.dentureData.implantPositions?.length || 0) >= 2 && 
                     !!store.dentureData.attachmentType
            }
            // Partial denture: missing teeth + base plate type
            return (store.dentureData.missingTeeth?.length || 0) > 0 && 
                   !!store.dentureData.basePlateType
          case 'implant': 
            // For healing stage, only need positions + stage
            if (store.implantData.implantStage === 'healing') {
              return store.implantData.positions.length > 0
            }
            // For ready/impression_taken, need full details
            return store.implantData.positions.length > 0 && 
                   !!store.implantData.implantStage &&
                   !!store.implantData.implantSystem &&
                   !!store.implantData.platformSize &&
                   !!store.implantData.connectionType &&
                   !!store.implantData.impressionTechnique &&
                   !!store.implantData.restorationType &&
                   !!store.implantData.abutmentType
          case 'veneer':
            return !!store.veneerData.veneerType && 
                   (store.veneerData.selectedTeeth?.length || 0) > 0 &&
                   !!store.veneerData.incisalOverlap
          case 'inlay_onlay':
            // Need type + teeth + surface involvement for each tooth
            const hasTeeth = (store.inlayOnlayData.selectedTeeth?.length || 0) > 0
            const hasSurfaces = hasTeeth && store.inlayOnlayData.selectedTeeth.every(
              tooth => !!store.inlayOnlayData.surfaceInvolvement[tooth]
            )
            return !!store.inlayOnlayData.type && hasTeeth && hasSurfaces
          case 'night_guard':
            // Hard guards need occlusal scheme
            const baseValid = !!store.nightGuardData.guardType && 
                             !!store.nightGuardData.arch && 
                             !!store.nightGuardData.thickness
            if (store.nightGuardData.guardType === 'hard') {
              return baseValid && !!store.nightGuardData.occlusalScheme
            }
            return baseValid
          case 'retainer':
            // Fixed bonded needs wire type + span
            if (store.retainerData.retainerType === 'fixed_bonded') {
              return !!store.retainerData.arch && 
                     !!store.retainerData.wireType && 
                     !!store.retainerData.span
            }
            return !!store.retainerData.retainerType && !!store.retainerData.arch
          case 'waxup':
            return !!store.waxupData.purpose && (store.waxupData.selectedTeeth?.length || 0) > 0
          case 'full_mouth_rehab':
            // Diagnostic stage: basic info only
            if (store.fmrData.stage === 'diagnostic') {
              return !!store.fmrData.stage && 
                     !!store.fmrData.ovdChange &&
                     !!store.fmrData.treatmentApproach
            }
            // Trial bite stage: arch + at least one verification
            if (store.fmrData.stage === 'trial_bite') {
              return !!store.fmrData.trialBiteArch &&
                     (store.fmrData.trialBiteOVDVerified || store.fmrData.trialBiteOcclusionVerified)
            }
            // Bisque trial stage: arch + at least one check
            if (store.fmrData.stage === 'bisque_trial') {
              return !!store.fmrData.bisqueTrialArch &&
                     (store.fmrData.bisqueFitCheck || store.fmrData.bisqueAestheticCheck || 
                      store.fmrData.bisqueOcclusionCheck || store.fmrData.bisqueShadeVerified)
            }
            // Provisionals and final stages: full validation
            return !!store.fmrData.stage && 
                   !!store.fmrData.ovdChange &&
                   !!store.fmrData.treatmentApproach &&
                   !!store.fmrData.guideplane &&
                   ((store.fmrData.upperTeeth?.length || 0) > 0 || (store.fmrData.lowerTeeth?.length || 0) > 0)
          case 'surgical_guide':
            return store.surgicalGuideData.hasCBCT && 
                   store.surgicalGuideData.hasDigitalScan &&
                   !!store.surgicalGuideData.guideType &&
                   !!store.surgicalGuideData.surgeryType &&
                   (store.surgicalGuideData.implantPositions?.length || 0) > 0 &&
                   !!store.surgicalGuideData.implantSystem &&
                   !!store.surgicalGuideData.sleeveSize
          case 'all_on_x':
            return !!store.allOnXData.arch &&
                   !!store.allOnXData.type &&
                   !!store.allOnXData.stage &&
                   (store.allOnXData.implantPositions?.length || 0) > 0 &&
                   !!store.allOnXData.material &&
                   !!store.allOnXData.implantSystem
          case 'bleaching_tray':
            return !!store.bleachingTrayData.arch && !!store.bleachingTrayData.thickness
          case 'sports_guard':
            return !!store.sportsGuardData.sportLevel && !!store.sportsGuardData.thickness
          case 'clear_aligner':
            return !!store.clearAlignerData.stage && store.clearAlignerData.hasDigitalScan
          case 'provisional':
            return !!store.provisionalData.type &&
                   !!store.provisionalData.material &&
                   !!store.provisionalData.duration &&
                   (store.provisionalData.selectedTeeth?.length || 0) > 0
          default: return false
        }
      case 4: 
        // Impression step - hasImpression can be true (with material) or false (no impression)
        // If hasImpression is explicitly set to true, need material
        // If hasImpression is false, that's also valid (digital cases, etc.)
        return store.hasImpression === false || (store.hasImpression === true && !!store.impressionMaterial)
      case 5: return !!store.material
      case 6: 
        // Shade step - can skip for non-aesthetic cases
        if (!needsShade()) return true
        return !!store.shade
      case 7: return true // Patient info is optional but recommended
      case 8: return true // Details are optional
      case 9: return true // Review - ready to submit
      default: return false
    }
  }

  const handleSubmit = () => {
    setShowSuccess(true)
    setTimeout(() => {
      store.reset()
      navigate('/')
    }, 2000)
  }

  // Handle next step - skip shade if not needed
  const handleNextStep = () => {
    if (store.step === 5 && !needsShade()) {
      store.setStep(7) // Skip shade step (6), go to patient info (7)
    } else if (store.step === 9) {
      handleSubmit()
    } else {
      store.nextStep()
    }
  }

  // Handle previous step - skip shade if not needed
  const handlePrevStep = () => {
    if (store.step === 7 && !needsShade()) {
      store.setStep(5) // Skip shade step (6), go back to material (5)
    } else {
      store.prevStep()
    }
  }

  const selectedLab = store.labId ? getLabById(store.labId) : null
  const selectedMaterial = store.material ? getMaterialById(store.material) : null
  const selectedShade = store.shade ? getShadeByCode(store.shade) : null

  // Get teeth summary for review
  const getTeethSummary = () => {
    switch (store.caseType) {
      case 'crown':
        return store.selectedTeeth.join(', ')
      case 'bridge':
        return `${store.bridgeData.units}-unit (${store.bridgeData.startTooth}-${store.bridgeData.endTooth})`
      case 'denture':
        if (store.dentureData.dentureType === 'full') {
          return `Full ${store.dentureData.arch} denture`
        }
        if (store.dentureData.dentureType === 'immediate') {
          return `Immediate ${store.dentureData.arch} denture`
        }
        if (store.dentureData.dentureType === 'overdenture') {
          return `Overdenture (${store.dentureData.implantPositions?.length || 0} implants)`
        }
        if (store.dentureData.dentureType === 'obturator') {
          return `${store.dentureData.arch === 'upper' ? 'Maxillary' : 'Mandibular'} Obturator`
        }
        return `Partial (${store.dentureData.missingTeeth?.length || 0} teeth)`
      case 'implant':
        return store.implantData.positions.join(', ')
      case 'veneer':
        return store.veneerData.selectedTeeth?.join(', ') || '-'
      case 'inlay_onlay':
        return `${store.inlayOnlayData.type}: ${store.inlayOnlayData.selectedTeeth?.join(', ') || '-'}`
      case 'night_guard':
        return `${store.nightGuardData.arch} arch`
      case 'retainer':
        return store.retainerData.arch === 'both' ? 'Both arches' : `${store.retainerData.arch} arch`
      case 'waxup':
        return store.waxupData.selectedTeeth?.join(', ') || '-'
      case 'full_mouth_rehab':
        const fmrTotal = (store.fmrData.upperTeeth?.length || 0) + (store.fmrData.lowerTeeth?.length || 0)
        return `${fmrTotal} teeth - ${store.fmrData.stage?.replace('_', ' ')}`
      default:
        return '-'
    }
  }

  // Get current total steps (accounting for skipped shade)
  const totalSteps = needsShade() ? 9 : 8
  const displayStep = !needsShade() && store.step > 6 ? store.step - 1 : store.step

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white">Order Placed</h2>
            <p className="text-sm text-white/50 mt-1">Your order has been submitted</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lab Filters Modal */}
      <AnimatePresence>
        {showLabFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => setShowLabFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[390px] bg-card rounded-t-3xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-border/50">
                <h2 className="text-lg font-semibold text-white">Filter & Sort</h2>
                <button
                  onClick={() => {
                    setLabServiceFilter([])
                    setLabMinRating(null)
                    setLabMaxDelivery(null)
                    setLabSortBy('rating')
                  }}
                  className="text-sm text-primary"
                >
                  Reset
                </button>
              </div>

              <div className="p-5 space-y-6 overflow-auto max-h-[60vh]">
                {/* Services */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {LAB_SERVICE_FILTERS.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => {
                          if (labServiceFilter.includes(filter.id)) {
                            setLabServiceFilter(labServiceFilter.filter(f => f !== filter.id))
                          } else {
                            setLabServiceFilter([...labServiceFilter, filter.id])
                          }
                        }}
                        className={cn(
                          "px-3 py-2 rounded-xl text-sm font-medium transition-all",
                          labServiceFilter.includes(filter.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                        )}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Minimum Rating
                  </h3>
                  <div className="flex gap-2">
                    {LAB_RATING_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLabMinRating(labMinRating === option.value ? null : option.value)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                          labMinRating === option.value
                            ? "bg-amber-500/20 border border-amber-500/50 text-amber-400"
                            : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Time */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Maximum Delivery Time
                  </h3>
                  <div className="flex gap-2">
                    {LAB_DELIVERY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLabMaxDelivery(labMaxDelivery === option.value ? null : option.value)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                          labMaxDelivery === option.value
                            ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                            : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Sort By</h3>
                  <div className="flex gap-2">
                    {LAB_SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setLabSortBy(option.id)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                          labSortBy === option.id
                            ? "bg-primary/20 border border-primary/50 text-primary"
                            : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setShowLabFilters(false)}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-background/80 backdrop-blur-lg z-40">
        <div className="flex items-center justify-between h-14 px-5">
          <button
            onClick={() => store.step === 1 ? navigate(-1) : handlePrevStep()}
            className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <p className="text-xs text-white/50">Step {displayStep} of {totalSteps}</p>
            <h1 className="font-semibold text-sm text-white">{STEPS[store.step - 1].title}</h1>
          </div>
          
          <button
            onClick={() => {
              store.reset()
              navigate(-1)
            }}
            className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="h-1 bg-card mx-5 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(displayStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-4 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={store.step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {/* Step 1: Select Lab */}
            {store.step === 1 && (() => {
              // Count active filters
              const activeFilterCount = labServiceFilter.length + 
                (labMinRating ? 1 : 0) + 
                (labMaxDelivery ? 1 : 0)
              
              // Filter by search and filters
              let filteredLabs = MOCK_LABS.filter(lab => {
                const matchesSearch = lab.name.toLowerCase().includes(labSearch.toLowerCase()) ||
                  lab.address.toLowerCase().includes(labSearch.toLowerCase())
                const matchesService = labServiceFilter.length === 0 ||
                  lab.services.some(s => labServiceFilter.some(f => s.toLowerCase().includes(f.toLowerCase())))
                const matchesRating = !labMinRating || lab.rating >= labMinRating
                const matchesDelivery = !labMaxDelivery || 
                  parseInt(lab.turnaround.split('-')[0]) <= parseInt(labMaxDelivery.split('-')[0])
                return matchesSearch && matchesService && matchesRating && matchesDelivery
              })
              
              // Sort labs
              filteredLabs = [...filteredLabs].sort((a, b) => {
                switch (labSortBy) {
                  case 'rating': return b.rating - a.rating
                  case 'distance': return parseFloat(a.distance) - parseFloat(b.distance)
                  case 'turnaround': return parseInt(a.turnaround.split('-')[0]) - parseInt(b.turnaround.split('-')[0])
                  default: return 0
                }
              })
              
              const favoriteLabs = filteredLabs.filter(lab => FAVORITE_LAB_IDS.includes(lab.id))
              const otherLabs = filteredLabs.filter(lab => !FAVORITE_LAB_IDS.includes(lab.id))
              
              const LabItem = ({ lab }: { lab: typeof MOCK_LABS[0] }) => (
                <motion.button
                  key={lab.id}
                  onClick={() => handleLabSelect(lab.id)}
                  className={cn(
                    "w-full text-left rounded-2xl border transition-all",
                    store.labId === lab.id
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-4 flex items-center gap-4">
                    <img
                      src={lab.image}
                      alt={lab.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-white truncate">{lab.name}</span>
                        {lab.isVerified && <BadgeCheck className="w-4 h-4 text-primary fill-primary/20 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50 mt-1">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {lab.rating}
                        </span>
                        <span>·</span>
                        <span>{lab.distance}</span>
                        <span>·</span>
                        <span>{lab.turnaround}</span>
                      </div>
                    </div>
                    {store.labId === lab.id ? (
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    ) : FAVORITE_LAB_IDS.includes(lab.id) ? (
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
                    ) : null}
                  </div>
                </motion.button>
              )
              
              return (
                <div className="space-y-4">
                  {/* Search & Filter Row */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        placeholder="Search labs..."
                        value={labSearch}
                        onChange={(e) => setLabSearch(e.target.value)}
                        className="pl-11 h-12 bg-card border-border/50 rounded-xl"
                      />
                      {labSearch && (
                        <button
                          onClick={() => setLabSearch('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <X className="w-4 h-4 text-white/40" />
                        </button>
                      )}
                    </div>
                    
                    {/* Filter Button */}
                    <button
                      onClick={() => setShowLabFilters(true)}
                      className={cn(
                        "relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all",
                        activeFilterCount > 0
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "bg-card border-border/50 text-white/70 hover:text-white"
                      )}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Active Filter Tags */}
                  {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {labServiceFilter.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setLabServiceFilter(labServiceFilter.filter(f => f !== filter))}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs"
                        >
                          {LAB_SERVICE_FILTERS.find(f => f.id === filter)?.label || filter}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                      {labMinRating && (
                        <button
                          onClick={() => setLabMinRating(null)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs"
                        >
                          <Star className="w-3 h-3 fill-current" />
                          {labMinRating}+
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      {labMaxDelivery && (
                        <button
                          onClick={() => setLabMaxDelivery(null)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs"
                        >
                          <Clock className="w-3 h-3" />
                          ≤{labMaxDelivery}
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      {labSortBy !== 'rating' && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-white/70 text-xs">
                          Sort: {LAB_SORT_OPTIONS.find(o => o.id === labSortBy)?.label}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setLabServiceFilter([])
                          setLabMinRating(null)
                          setLabMaxDelivery(null)
                          setLabSortBy('rating')
                        }}
                        className="px-2 py-1 rounded-lg text-white/40 text-xs hover:text-white"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                  
                  {/* Favorites */}
                  {favoriteLabs.length > 0 && !labSearch && activeFilterCount === 0 && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5 px-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        Favorites
                      </p>
                      <div className="space-y-3">
                        {favoriteLabs.map((lab) => (
                          <LabItem key={lab.id} lab={lab} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* All Labs */}
                  <div>
                    {!labSearch && favoriteLabs.length > 0 && activeFilterCount === 0 && (
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-3 px-1">All Labs</p>
                    )}
                    {(labSearch || activeFilterCount > 0) && filteredLabs.length > 0 && (
                      <p className="text-xs text-white/40 mb-3 px-1">
                        {filteredLabs.length} lab{filteredLabs.length !== 1 ? 's' : ''} found
                      </p>
                    )}
                    <div className="space-y-3">
                      {(labSearch || activeFilterCount > 0 ? filteredLabs : otherLabs).map((lab) => (
                        <LabItem key={lab.id} lab={lab} />
                      ))}
                    </div>
                    
                    {filteredLabs.length === 0 && (
                      <div className="text-center py-10">
                        <Search className="w-8 h-8 text-white/20 mx-auto mb-3" />
                        <p className="text-sm text-white/40">No labs found</p>
                        <button
                          onClick={() => {
                            setLabSearch('')
                            setLabServiceFilter([])
                            setLabMinRating(null)
                            setLabMaxDelivery(null)
                          }}
                          className="text-xs text-primary mt-2"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Step 2: Case Type */}
            {store.step === 2 && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="Search case types..."
                    value={caseTypeSearch}
                    onChange={(e) => setCaseTypeSearch(e.target.value)}
                    className="pl-10 h-11 bg-card border-border/50 rounded-xl text-sm"
                  />
                  {caseTypeSearch && (
                    <button
                      onClick={() => setCaseTypeSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Filter case types based on search */}
                {(() => {
                  const searchLower = caseTypeSearch.toLowerCase().trim()
                  const filteredTypes = searchLower
                    ? CASE_TYPES.filter(t => 
                        t.label.toLowerCase().includes(searchLower) ||
                        t.description.toLowerCase().includes(searchLower) ||
                        t.category.toLowerCase().includes(searchLower)
                      )
                    : CASE_TYPES

                  // If searching, show flat list; otherwise group by category
                  if (searchLower) {
                    return (
                      <div className="space-y-2">
                        {filteredTypes.length === 0 ? (
                          <div className="text-center py-8">
                            <Search className="w-8 h-8 text-white/20 mx-auto mb-2" />
                            <p className="text-sm text-white/50">No case types found</p>
                            <p className="text-xs text-white/30 mt-1">Try a different search term</p>
                          </div>
                        ) : (
                          filteredTypes.map((type) => (
                            <motion.button
                              key={type.id}
                              onClick={() => {
                                setCaseTypeSearch('')
                                handleCaseTypeSelect(type.id)
                              }}
                              className={cn(
                                "w-full text-left p-4 rounded-2xl border transition-all",
                                store.caseType === type.id
                                  ? "bg-selected border-primary/50"
                                  : "bg-card border-border/50 hover:border-white/20"
                              )}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className={cn(
                                      "font-medium",
                                      store.caseType === type.id ? "text-primary" : "text-white"
                                    )}>
                                      {type.label}
                                    </p>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase">
                                      {type.category}
                                    </span>
                                  </div>
                                  <p className="text-sm text-white/50">{type.description}</p>
                                </div>
                                {store.caseType === type.id && (
                                  <Check className="w-5 h-5 text-primary" />
                                )}
                              </div>
                            </motion.button>
                          ))
                        )}
                      </div>
                    )
                  }

                  // Group by category when not searching
                  return (['restoration', 'prosthetic', 'appliance', 'diagnostic'] as const).map((category) => {
                    const categoryTypes = filteredTypes.filter(t => t.category === category)
                    if (categoryTypes.length === 0) return null
                    
                    const categoryLabels = {
                      restoration: 'Fixed Restorations',
                      prosthetic: 'Prosthetics',
                      appliance: 'Appliances',
                      diagnostic: 'Diagnostic'
                    }
                    
                    return (
                      <div key={category}>
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-2 px-1">
                          {categoryLabels[category]}
                        </p>
                        <div className="space-y-2 mb-4">
                          {categoryTypes.map((type) => (
                            <motion.button
                              key={type.id}
                              onClick={() => handleCaseTypeSelect(type.id)}
                              className={cn(
                                "w-full text-left p-4 rounded-2xl border transition-all",
                                store.caseType === type.id
                                  ? "bg-selected border-primary/50"
                                  : "bg-card border-border/50 hover:border-white/20"
                              )}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={cn(
                                    "font-medium",
                                    store.caseType === type.id ? "text-primary" : "text-white"
                                  )}>
                                    {type.label}
                                  </p>
                                  <p className="text-sm text-white/50">{type.description}</p>
                                </div>
                                {store.caseType === type.id && (
                                  <Check className="w-5 h-5 text-primary" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            )}

            {/* Step 3: Selection - Different UI based on case type */}
            {store.step === 3 && (
              <div>
                {/* Crown */}
                {store.caseType === 'crown' && (
                  <CrownSelector
                    selectedTeeth={store.selectedTeeth}
                    onToothClick={store.toggleTooth}
                    crownData={store.crownData}
                    onCrownDataChange={store.setCrownData}
                  />
                )}

                {/* Bridge */}
                {store.caseType === 'bridge' && (
                  <BridgeSelector
                    bridgeData={store.bridgeData}
                    onBridgeTypeChange={(type: BridgeType) => store.setBridgeData({ bridgeType: type })}
                    onBridgeDataChange={store.setBridgeData}
                    onRangeSelect={store.setBridgeRange}
                    onToggleAbutment={store.toggleAbutment}
                    onReset={() => store.setBridgeData({ 
                      bridgeType: 'conventional', 
                      ponticDesign: null,
                      startTooth: null, 
                      endTooth: null, 
                      abutments: [], 
                      pontics: [], 
                      units: 0,
                      attachmentPositions: []
                    })}
                  />
                )}

                {/* Denture */}
                {store.caseType === 'denture' && (
                  <DentureSelector
                    dentureData={store.dentureData}
                    onDentureDataChange={store.setDentureData}
                  />
                )}

                {/* Implant */}
                {store.caseType === 'implant' && (
                  <ImplantSelector
                    implantData={store.implantData}
                    onImplantDataChange={store.setImplantData}
                    onTogglePosition={store.toggleImplantPosition}
                  />
                )}

                {/* Veneer */}
                {store.caseType === 'veneer' && (
                  <VeneerSelector
                    veneerData={store.veneerData}
                    onVeneerDataChange={store.setVeneerData}
                  />
                )}

                {/* Inlay/Onlay */}
                {store.caseType === 'inlay_onlay' && (
                  <InlayOnlaySelector
                    inlayOnlayData={store.inlayOnlayData}
                    onInlayOnlayDataChange={store.setInlayOnlayData}
                  />
                )}

                {/* Night Guard */}
                {store.caseType === 'night_guard' && (
                  <NightGuardSelector
                    nightGuardData={store.nightGuardData}
                    onNightGuardDataChange={store.setNightGuardData}
                  />
                )}

                {/* Retainer */}
                {store.caseType === 'retainer' && (
                  <RetainerSelector
                    retainerData={store.retainerData}
                    onRetainerDataChange={store.setRetainerData}
                  />
                )}

                {/* Wax-Up / Study */}
                {store.caseType === 'waxup' && (
                  <WaxupSelector
                    waxupData={store.waxupData}
                    onWaxupDataChange={store.setWaxupData}
                  />
                )}

                {/* Full Mouth Rehabilitation */}
                {store.caseType === 'full_mouth_rehab' && (
                  <FullMouthRehabSelector
                    fmrData={store.fmrData}
                    onFMRDataChange={store.setFMRData}
                  />
                )}

                {/* Surgical Guide */}
                {store.caseType === 'surgical_guide' && (
                  <SurgicalGuideSelector
                    surgicalGuideData={store.surgicalGuideData}
                    onSurgicalGuideDataChange={store.setSurgicalGuideData}
                  />
                )}

                {/* All-on-X */}
                {store.caseType === 'all_on_x' && (
                  <AllOnXSelector
                    allOnXData={store.allOnXData}
                    onAllOnXDataChange={store.setAllOnXData}
                  />
                )}

                {/* Bleaching Tray */}
                {store.caseType === 'bleaching_tray' && (
                  <BleachingTraySelector
                    bleachingTrayData={store.bleachingTrayData}
                    onBleachingTrayDataChange={store.setBleachingTrayData}
                  />
                )}

                {/* Sports Guard */}
                {store.caseType === 'sports_guard' && (
                  <SportsGuardSelector
                    sportsGuardData={store.sportsGuardData}
                    onSportsGuardDataChange={store.setSportsGuardData}
                  />
                )}

                {/* Clear Aligner */}
                {store.caseType === 'clear_aligner' && (
                  <ClearAlignerSelector
                    clearAlignerData={store.clearAlignerData}
                    onClearAlignerDataChange={store.setClearAlignerData}
                  />
                )}

                {/* Provisional */}
                {store.caseType === 'provisional' && (
                  <ProvisionalSelector
                    provisionalData={store.provisionalData}
                    onProvisionalDataChange={store.setProvisionalData}
                  />
                )}
              </div>
            )}

            {/* Step 4: Impression */}
            {store.step === 4 && (
              <div className="space-y-6">
                {/* Has Impression */}
                <div>
                  <h3 className="font-medium text-white mb-3">Do you have an impression ready?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={() => store.setHasImpression(true)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all text-center cursor-pointer",
                        store.hasImpression
                          ? "bg-selected border-primary/50"
                          : "bg-card border-border/50 hover:border-white/20"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className={cn(
                        "w-6 h-6 mx-auto mb-2",
                        store.hasImpression ? "text-primary" : "text-white/60"
                      )} />
                      <p className={cn(
                        "font-medium",
                        store.hasImpression ? "text-primary" : "text-white"
                      )}>
                        Yes
                      </p>
                      <p className="text-xs text-white/50 mt-1">Ready to send</p>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleImpressionSelect(false)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all text-center",
                        !store.hasImpression && store.hasImpression !== undefined
                          ? "bg-card border-border/50"
                          : "bg-card border-border/50 hover:border-white/20"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X className="w-6 h-6 mx-auto mb-2 text-white/60" />
                      <p className="font-medium text-white">No</p>
                      <p className="text-xs text-white/50 mt-1">Will take later</p>
                    </motion.button>
                  </div>
                </div>

                {/* Impression Material */}
                {store.hasImpression && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="font-medium text-white mb-3">Impression Material Used</h3>
                    <div className="space-y-3">
                      {IMPRESSION_MATERIALS.map((material) => (
                        <motion.button
                          key={material.id}
                          onClick={() => handleImpressionMaterialSelect(material.id as ImpressionMaterial)}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl border transition-all",
                            store.impressionMaterial === material.id
                              ? "bg-selected border-primary/50"
                              : "bg-card border-border/50 hover:border-white/20"
                          )}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={cn(
                                "font-medium",
                                store.impressionMaterial === material.id ? "text-primary" : "text-white"
                              )}>
                                {material.label}
                              </p>
                              <p className="text-sm text-white/50">{material.description}</p>
                            </div>
                            {store.impressionMaterial === material.id && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Bite Registration & Opposing Model */}
                {store.hasImpression && store.impressionMaterial && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <h3 className="font-medium text-white mb-3">Additional Records</h3>
                    
                    <button
                      onClick={() => store.setHasBiteRegistration(!store.hasBiteRegistration)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                        store.hasBiteRegistration
                          ? "bg-selected border-primary/50"
                          : "bg-card border-border/50 hover:border-white/20"
                      )}
                    >
                      <div>
                        <p className={cn(
                          "font-medium",
                          store.hasBiteRegistration ? "text-primary" : "text-white"
                        )}>
                          Bite Registration
                        </p>
                        <p className="text-xs text-white/50">Including occlusal records</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center",
                        store.hasBiteRegistration ? "bg-primary border-primary" : "border-white/30"
                      )}>
                        {store.hasBiteRegistration && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>

                    <button
                      onClick={() => store.setHasOpposingModel(!store.hasOpposingModel)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                        store.hasOpposingModel
                          ? "bg-selected border-primary/50"
                          : "bg-card border-border/50 hover:border-white/20"
                      )}
                    >
                      <div>
                        <p className={cn(
                          "font-medium",
                          store.hasOpposingModel ? "text-primary" : "text-white"
                        )}>
                          Opposing Arch Model
                        </p>
                        <p className="text-xs text-white/50">For accurate occlusion</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center",
                        store.hasOpposingModel ? "bg-primary border-primary" : "border-white/30"
                      )}>
                        {store.hasOpposingModel && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 5: Material */}
            {store.step === 5 && store.caseType && (
              <MaterialSelector
                category={store.caseType}
                value={store.material}
                onChange={handleMaterialSelect}
              />
            )}

            {/* Step 6: Shade */}
            {store.step === 6 && needsShade() && (
              <ShadeGuide
                value={store.shade}
                onChange={handleShadeSelect}
              />
            )}

            {/* Step 6 (skipped) - Show message if shade not needed */}
            {store.step === 6 && !needsShade() && (
              <div className="text-center py-10">
                <SkipForward className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Shade Not Required</h3>
                <p className="text-sm text-white/50">
                  This case type doesn't require shade selection.
                </p>
              </div>
            )}

            {/* Step 7: Patient Info */}
            {store.step === 7 && (
              <div className="space-y-6">
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl flex gap-3">
                  <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-primary font-medium mb-1">Patient Information</p>
                    <p className="text-xs text-white/60">
                      Patient details help the lab make better aesthetic decisions for shade matching 
                      and tooth characterization.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Patient Name</label>
                  <Input
                    placeholder="Enter patient name (optional)"
                    value={store.patientName}
                    onChange={(e) => store.setPatientInfo(e.target.value, store.patientAge, store.patientGender || 'male')}
                    className="h-12 bg-card border-border/50 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Age</label>
                    <Input
                      placeholder="Age"
                      type="number"
                      value={store.patientAge}
                      onChange={(e) => store.setPatientInfo(store.patientName, e.target.value, store.patientGender || 'male')}
                      className="h-12 bg-card border-border/50 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['male', 'female'] as const).map((gender) => (
                        <button
                          key={gender}
                          onClick={() => store.setPatientInfo(store.patientName, store.patientAge, gender)}
                          className={cn(
                            "h-12 rounded-xl border transition-all text-sm font-medium",
                            store.patientGender === gender
                              ? "bg-selected border-primary/50 text-primary"
                              : "bg-card border-border/50 text-white/70 hover:border-white/20"
                          )}
                        >
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/40 text-center">
                  This information is optional but recommended for better results
                </p>
              </div>
            )}

            {/* Step 8: Details */}
            {store.step === 8 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-white mb-3">Upload Photos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors bg-card/50"
                      >
                        <Camera className="w-5 h-5 text-white/40" />
                        <span className="text-xs text-white/40">Add</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-white/40 mt-2">
                    Prep photos, shade tabs, patient smile photos
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-3">Priority</h3>
                  <div className="space-y-2">
                    {PRIORITIES.map((priority) => (
                      <button
                        key={priority.id}
                        onClick={() => store.setPriority(priority.id as typeof store.priority)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                          store.priority === priority.id
                            ? "bg-selected border-primary/50"
                            : "bg-card border-border/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-white/50" />
                          <div>
                            <p className={cn(
                              "font-medium text-sm",
                              store.priority === priority.id ? "text-primary" : "text-white"
                            )}>
                              {priority.label}
                            </p>
                            <p className="text-xs text-white/50">{priority.days}</p>
                          </div>
                        </div>
                        {priority.price && (
                          <Badge variant="secondary">{priority.price}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-3">Special Instructions</h3>
                  <textarea
                    value={store.instructions}
                    onChange={(e) => store.setInstructions(e.target.value)}
                    placeholder="Contact preferences, stump shade, occlusion notes, characterization requests..."
                    className="w-full h-24 p-4 rounded-xl bg-card border border-border/50 resize-none text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            )}

            {/* Step 9: Review */}
            {store.step === 9 && (
              <div className="space-y-4">
                <Card variant="gradient">
                  <CardContent className="p-4 pt-4 space-y-4">
                    {selectedLab && (
                      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <img
                          src={selectedLab.image}
                          alt={selectedLab.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-white">{selectedLab.name}</h3>
                          <p className="text-xs text-white/50">{selectedLab.address}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/50 text-xs">Case Type</p>
                        <p className="font-medium text-white capitalize">
                          {CASE_TYPES.find(t => t.id === store.caseType)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Selection</p>
                        <p className="font-medium text-white">{getTeethSummary()}</p>
                      </div>
                      
                      {/* Bridge-specific details */}
                      {store.caseType === 'bridge' && (
                        <>
                          <div>
                            <p className="text-white/50 text-xs">Abutments</p>
                            <p className="font-medium text-white">{store.bridgeData.abutments.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">Pontics</p>
                            <p className="font-medium text-white">{store.bridgeData.pontics.join(', ') || '-'}</p>
                          </div>
                          {store.bridgeData.bridgeType === 'precision_attachment' && store.bridgeData.attachmentPositions && store.bridgeData.attachmentPositions.length > 0 && (
                            <div>
                              <p className="text-white/50 text-xs">Attachment Position</p>
                              <p className="font-medium text-white">{store.bridgeData.attachmentPositions.join(', ')}</p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Implant-specific details */}
                      {store.caseType === 'implant' && store.implantData.implantSystem && (
                        <>
                          <div>
                            <p className="text-white/50 text-xs">Implant System</p>
                            <p className="font-medium text-white capitalize">{store.implantData.implantSystem}</p>
                          </div>
                          {store.implantData.platformSize && (
                            <div>
                              <p className="text-white/50 text-xs">Platform</p>
                              <p className="font-medium text-white capitalize">{store.implantData.platformSize?.replace('_', ' ')}</p>
                            </div>
                          )}
                          {store.implantData.implantDiameter && (
                            <div>
                              <p className="text-white/50 text-xs">Diameter</p>
                              <p className="font-medium text-white">{store.implantData.implantDiameter} mm</p>
                            </div>
                          )}
                          <div>
                            <p className="text-white/50 text-xs">Connection</p>
                            <p className="font-medium text-white capitalize">
                              {store.implantData.connectionType?.replace('_', ' ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">Impression</p>
                            <p className="font-medium text-white capitalize">
                              {store.implantData.impressionTechnique?.replace('_', ' ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">Restoration Type</p>
                            <p className="font-medium text-white capitalize">
                              {store.implantData.restorationType?.replace('_', '-')}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">Abutment</p>
                            <p className="font-medium text-white capitalize">
                              {store.implantData.abutmentType?.replace(/_/g, ' ')}
                            </p>
                          </div>
                          {store.implantData.componentsIncluded && store.implantData.componentsIncluded.length > 0 && (
                            <div className="col-span-2">
                              <p className="text-white/50 text-xs">Components Included</p>
                              <p className="font-medium text-white text-xs">
                                {store.implantData.componentsIncluded.map(c => c.replace(/_/g, ' ')).join(', ')}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                      
                      <div>
                        <p className="text-white/50 text-xs">Impression</p>
                        <p className="font-medium text-white capitalize">
                          {IMPRESSION_MATERIALS.find(m => m.id === store.impressionMaterial)?.label || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Material</p>
                        <p className="font-medium text-white">{selectedMaterial?.name || '-'}</p>
                      </div>
                      
                      {needsShade() && (
                        <div>
                          <p className="text-white/50 text-xs">Shade</p>
                          <div className="flex items-center gap-2">
                            {selectedShade && (
                              <div 
                                className="w-4 h-4 rounded border border-white/20"
                                style={{ backgroundColor: selectedShade.hex }}
                              />
                            )}
                            <p className="font-medium text-white">{store.shade || '-'}</p>
                          </div>
                        </div>
                      )}

                      {store.patientName && (
                        <div>
                          <p className="text-white/50 text-xs">Patient</p>
                          <p className="font-medium text-white">
                            {store.patientName}
                            {store.patientAge && `, ${store.patientAge}y`}
                            {store.patientGender && ` (${store.patientGender.charAt(0).toUpperCase()})`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/50">Priority</span>
                        <Badge variant={store.priority === 'rush' ? 'destructive' : store.priority === 'urgent' ? 'warning' : 'outline'}>
                          {store.priority}
                        </Badge>
                      </div>
                      
                      {selectedLab && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/50">Est. Delivery</span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium text-white">
                              {(() => {
                                // Parse turnaround like "5-7 days"
                                const match = selectedLab.turnaround.match(/(\d+)-(\d+)/)
                                if (!match) return selectedLab.turnaround
                                
                                let minDays = parseInt(match[1])
                                let maxDays = parseInt(match[2])
                                
                                // Adjust for priority
                                if (store.priority === 'rush') {
                                  minDays = Math.max(1, minDays - 2)
                                  maxDays = Math.max(2, maxDays - 2)
                                } else if (store.priority === 'urgent') {
                                  minDays = Math.max(2, minDays - 1)
                                  maxDays = Math.max(3, maxDays - 1)
                                }
                                
                                const minDate = new Date()
                                minDate.setDate(minDate.getDate() + minDays)
                                const maxDate = new Date()
                                maxDate.setDate(maxDate.getDate() + maxDays)
                                
                                const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                
                                return `${formatDate(minDate)} - ${formatDate(maxDate)}`
                              })()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {store.instructions && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-white/50 text-xs mb-1">Notes</p>
                        <p className="text-sm text-white/80">{store.instructions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card variant="gradient-accent">
                  <CardContent className="p-4 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Estimated Total</span>
                      <span className="text-xl font-semibold text-white">₹8,000 - ₹12,000</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-t from-background to-background/80 p-5 z-40">
        <Button
          className="w-full"
          disabled={!canProceed()}
          onClick={handleNextStep}
        >
          {store.step === 9 ? 'Place Order' : 'Continue'}
          {store.step !== 9 && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
