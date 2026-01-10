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
  SkipForward
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
import { ShadeGuide } from "@/components/dental/ShadeGuide"
import { MaterialSelector } from "@/components/order/MaterialSelector"
import { useOrderStore } from "@/stores/orderStore"
import type { BridgeType, CaseType } from "@/stores/orderStore"
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
  // Diagnostic
  { id: 'waxup', label: 'Wax-Up / Study', description: 'Diagnostic planning & visualization', category: 'diagnostic' },
]

const PRIORITIES = [
  { id: 'normal', label: 'Standard', days: '5-7 days', price: '' },
  { id: 'urgent', label: 'Urgent', days: '3-4 days', price: '+20%' },
  { id: 'rush', label: 'Rush', days: '1-2 days', price: '+50%' },
]

const LAB_SERVICE_FILTERS = ['All', 'Crown', 'Bridge', 'Denture', 'Implant', 'Veneer']
const LAB_SORT_OPTIONS = [
  { id: 'rating', label: 'Top Rated' },
  { id: 'distance', label: 'Nearest' },
  { id: 'turnaround', label: 'Fastest' },
]

// Case types that don't need shade selection
const NO_SHADE_CASE_TYPES: CaseType[] = ['night_guard', 'retainer', 'waxup']

export function NewOrder() {
  const navigate = useNavigate()
  const store = useOrderStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [labSearch, setLabSearch] = useState('')
  const [labServiceFilter, setLabServiceFilter] = useState('All')
  const [labSortBy, setLabSortBy] = useState('rating')

  // Check if shade is needed for this case type
  const needsShade = () => {
    if (!store.caseType) return false
    if (NO_SHADE_CASE_TYPES.includes(store.caseType)) return false
    // Full metal crown doesn't need shade
    if (store.material === 'full-metal') return false
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
          case 'crown': return store.selectedTeeth.length > 0
          case 'bridge': return store.bridgeData.units >= 3 // Minimum 3-unit bridge
          case 'denture': 
            if (store.dentureData.dentureType === 'full' || 
                store.dentureData.dentureType === 'immediate' ||
                store.dentureData.dentureType === 'obturator') {
              return !!store.dentureData.arch
            }
            if (store.dentureData.dentureType === 'overdenture') {
              return (store.dentureData.implantPositions?.length || 0) >= 2
            }
            // Partial denture
            return (store.dentureData.missingTeeth?.length || 0) > 0
          case 'implant': 
            return store.implantData.positions.length > 0 && 
                   !!store.implantData.implantSystem &&
                   !!store.implantData.connectionType &&
                   !!store.implantData.restorationType &&
                   !!store.implantData.abutmentType
          case 'veneer':
            return !!store.veneerData.veneerType && (store.veneerData.selectedTeeth?.length || 0) > 0
          case 'inlay_onlay':
            return !!store.inlayOnlayData.type && (store.inlayOnlayData.selectedTeeth?.length || 0) > 0
          case 'night_guard':
            return !!store.nightGuardData.guardType && !!store.nightGuardData.arch && !!store.nightGuardData.thickness
          case 'retainer':
            return !!store.retainerData.retainerType && !!store.retainerData.arch
          case 'waxup':
            return !!store.waxupData.purpose && (store.waxupData.selectedTeeth?.length || 0) > 0
          default: return false
        }
      case 4: return store.hasImpression && !!store.impressionMaterial
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
              // Filter by search and service
              let filteredLabs = MOCK_LABS.filter(lab => {
                const matchesSearch = lab.name.toLowerCase().includes(labSearch.toLowerCase()) ||
                  lab.address.toLowerCase().includes(labSearch.toLowerCase())
                const matchesService = labServiceFilter === 'All' ||
                  lab.services.some(s => s.toLowerCase() === labServiceFilter.toLowerCase())
                return matchesSearch && matchesService
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
                  onClick={() => store.setLabId(lab.id)}
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
                  {/* Search */}
                  <div className="relative">
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
                  
                  {/* Service Filter Pills */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {LAB_SERVICE_FILTERS.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setLabServiceFilter(filter)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0",
                          labServiceFilter === filter
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border/50 text-white/70 hover:text-white"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  
                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">Sort:</span>
                    <div className="flex gap-1.5">
                      {LAB_SORT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setLabSortBy(option.id)}
                          className={cn(
                            "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                            labSortBy === option.id
                              ? "bg-white/10 text-white"
                              : "text-white/50 hover:text-white"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Favorites */}
                  {favoriteLabs.length > 0 && !labSearch && labServiceFilter === 'All' && (
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
                    {!labSearch && favoriteLabs.length > 0 && labServiceFilter === 'All' && (
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-3 px-1">All Labs</p>
                    )}
                    {(labSearch || labServiceFilter !== 'All') && filteredLabs.length > 0 && (
                      <p className="text-xs text-white/40 mb-3 px-1">
                        {filteredLabs.length} lab{filteredLabs.length !== 1 ? 's' : ''} found
                        {labServiceFilter !== 'All' && ` for ${labServiceFilter}`}
                      </p>
                    )}
                    <div className="space-y-3">
                      {(labSearch || labServiceFilter !== 'All' ? filteredLabs : otherLabs).map((lab) => (
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
                            setLabServiceFilter('All')
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
                <p className="text-sm text-white/50 mb-2">What type of restoration or appliance do you need?</p>
                
                {/* Group by category */}
                {(['restoration', 'prosthetic', 'appliance', 'diagnostic'] as const).map((category) => {
                  const categoryTypes = CASE_TYPES.filter(t => t.category === category)
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
                            onClick={() => store.setCaseType(type.id)}
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
                })}
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
                      units: 0 
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
                        "p-4 rounded-2xl border transition-all text-center",
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
                      onClick={() => {
                        store.setHasImpression(false)
                        store.setImpressionMaterial(null)
                      }}
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
                          onClick={() => store.setImpressionMaterial(material.id as typeof store.impressionMaterial)}
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
                onChange={store.setMaterial}
              />
            )}

            {/* Step 6: Shade */}
            {store.step === 6 && needsShade() && (
              <ShadeGuide
                value={store.shade}
                onChange={store.setShade}
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
                        </>
                      )}
                      
                      {/* Implant-specific details */}
                      {store.caseType === 'implant' && store.implantData.implantSystem && (
                        <>
                          <div>
                            <p className="text-white/50 text-xs">Implant System</p>
                            <p className="font-medium text-white capitalize">{store.implantData.implantSystem}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">Restoration Type</p>
                            <p className="font-medium text-white capitalize">
                              {store.implantData.restorationType?.replace('_', '-')}
                            </p>
                          </div>
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

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm text-white/50">Priority</span>
                      <Badge variant={store.priority === 'rush' ? 'destructive' : store.priority === 'urgent' ? 'warning' : 'outline'}>
                        {store.priority}
                      </Badge>
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
