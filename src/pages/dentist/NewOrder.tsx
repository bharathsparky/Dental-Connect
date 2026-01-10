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
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ToothChart } from "@/components/dental/ToothChart"
import { BridgeSelector } from "@/components/dental/BridgeSelector"
import { DentureSelector } from "@/components/dental/DentureSelector"
import { ImplantSelector } from "@/components/dental/ImplantSelector"
import { ShadeGuide } from "@/components/dental/ShadeGuide"
import { MaterialSelector } from "@/components/order/MaterialSelector"
import { useOrderStore } from "@/stores/orderStore"
import type { BridgeType } from "@/stores/orderStore"
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
  { id: 7, title: 'Details' },
  { id: 8, title: 'Review' },
]

const IMPRESSION_MATERIALS = [
  { id: 'alginate', label: 'Alginate', description: 'Cost-effective, good for study models' },
  { id: 'pvs', label: 'PVS (Addition Silicone)', description: 'High accuracy, ideal for crowns & bridges' },
  { id: 'polyether', label: 'Polyether', description: 'Excellent detail, good for implants' },
  { id: 'digital_scan', label: 'Digital Scan', description: 'Intraoral scanner, fastest turnaround' },
]

const CASE_TYPES = [
  { id: 'crown', label: 'Crown', description: 'Single/multiple tooth restorations', icon: '👑' },
  { id: 'bridge', label: 'Bridge', description: 'Replace missing teeth with span', icon: '🌉' },
  { id: 'denture', label: 'Denture', description: 'Full or partial removable prosthesis', icon: '🦷' },
  { id: 'implant', label: 'Implant', description: 'Implant-supported restoration', icon: '🔩' },
]

const PRIORITIES = [
  { id: 'normal', label: 'Standard', days: '5-7 days', price: '' },
  { id: 'urgent', label: 'Urgent', days: '3-4 days', price: '+20%' },
  { id: 'rush', label: 'Rush', days: '1-2 days', price: '+50%' },
]

const LAB_SERVICE_FILTERS = ['All', 'Crown', 'Bridge', 'Denture', 'Implant']
const LAB_SORT_OPTIONS = [
  { id: 'rating', label: 'Top Rated' },
  { id: 'distance', label: 'Nearest' },
  { id: 'turnaround', label: 'Fastest' },
]

export function NewOrder() {
  const navigate = useNavigate()
  const store = useOrderStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [labSearch, setLabSearch] = useState('')
  const [labServiceFilter, setLabServiceFilter] = useState('All')
  const [labSortBy, setLabSortBy] = useState('rating')

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
            return store.dentureData.dentureType === 'full' 
              ? !!store.dentureData.arch
              : (store.dentureData.missingTeeth?.length || 0) > 0
          case 'implant': return store.implantData.positions.length > 0
          default: return false
        }
      case 4: return store.hasImpression && !!store.impressionMaterial
      case 5: return !!store.material
      case 6: return !!store.shade
      case 7: return true
      case 8: return true
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
          return `Full ${store.dentureData.arch} arch`
        }
        return `Partial (${store.dentureData.missingTeeth?.length || 0} teeth)`
      case 'implant':
        return store.implantData.positions.join(', ')
      default:
        return '-'
    }
  }

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
            onClick={() => store.step === 1 ? navigate(-1) : store.prevStep()}
            className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <p className="text-xs text-white/50">Step {store.step} of 8</p>
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
            animate={{ width: `${(store.step / 8) * 100}%` }}
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
              <div className="space-y-3">
                <p className="text-sm text-white/50 mb-4">What type of restoration do you need?</p>
                {CASE_TYPES.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => store.setCaseType(type.id as typeof store.caseType)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all",
                      store.caseType === type.id
                        ? "bg-selected border-primary/50"
                        : "bg-card border-border/50 hover:border-white/20"
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                        store.caseType === type.id ? "bg-primary/20" : "bg-white/5"
                      )}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
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
            )}

            {/* Step 3: Teeth/Selection - Different UI based on case type */}
            {store.step === 3 && (
              <div>
                {/* Crown: Individual tooth selection */}
                {store.caseType === 'crown' && (
                  <div>
                    <p className="text-sm text-white/50 mb-4">Select teeth for crown restorations</p>
                    <ToothChart
                      selectedTeeth={store.selectedTeeth}
                      onToothClick={store.toggleTooth}
                    />
                  </div>
                )}

                {/* Bridge: Range selection with abutment/pontic */}
                {store.caseType === 'bridge' && (
                  <BridgeSelector
                    bridgeData={store.bridgeData}
                    onBridgeTypeChange={(type: BridgeType) => store.setBridgeData({ bridgeType: type })}
                    onRangeSelect={store.setBridgeRange}
                    onToggleAbutment={store.toggleAbutment}
                  />
                )}

                {/* Denture: Arch/partial selection */}
                {store.caseType === 'denture' && (
                  <DentureSelector
                    dentureData={store.dentureData}
                    onDentureDataChange={store.setDentureData}
                  />
                )}

                {/* Implant: Position selection with system */}
                {store.caseType === 'implant' && (
                  <ImplantSelector
                    implantData={store.implantData}
                    onImplantDataChange={store.setImplantData}
                    onTogglePosition={store.toggleImplantPosition}
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
                      <div className={cn(
                        "text-2xl mb-2",
                        store.hasImpression ? "text-primary" : "text-white/60"
                      )}>
                        ✓
                      </div>
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
                      <div className="text-2xl mb-2 text-white/60">✗</div>
                      <p className="font-medium text-white">No</p>
                      <p className="text-xs text-white/50 mt-1">Will take later</p>
                    </motion.button>
                  </div>
                </div>

                {/* Impression Material - show only if hasImpression is true */}
                {store.hasImpression && (
                  <div>
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
                  </div>
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
            {store.step === 6 && (
              <ShadeGuide
                value={store.shade}
                onChange={store.setShade}
              />
            )}

            {/* Step 7: Details */}
            {store.step === 7 && (
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
                  <h3 className="font-medium text-white mb-3">Notes</h3>
                  <textarea
                    value={store.instructions}
                    onChange={(e) => store.setInstructions(e.target.value)}
                    placeholder="Special instructions..."
                    className="w-full h-20 p-4 rounded-xl bg-card border border-border/50 resize-none text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            )}

            {/* Step 8: Review */}
            {store.step === 8 && (
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
                        <p className="font-medium text-white capitalize">{store.caseType}</p>
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
                        <div>
                          <p className="text-white/50 text-xs">Implant System</p>
                          <p className="font-medium text-white capitalize">{store.implantData.implantSystem}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-white/50 text-xs">Impression</p>
                        <p className="font-medium text-white capitalize">
                          {IMPRESSION_MATERIALS.find(m => m.id === store.impressionMaterial)?.label || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Material</p>
                        <p className="font-medium text-white">{selectedMaterial?.name}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Shade</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border border-white/20"
                            style={{ backgroundColor: selectedShade?.hex }}
                          />
                          <p className="font-medium text-white">{store.shade}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm text-white/50">Priority</span>
                      <Badge variant={store.priority === 'rush' ? 'destructive' : store.priority === 'urgent' ? 'warning' : 'outline'}>
                        {store.priority}
                      </Badge>
                    </div>
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
          onClick={() => store.step === 8 ? handleSubmit() : store.nextStep()}
        >
          {store.step === 8 ? 'Place Order' : 'Continue'}
          {store.step !== 8 && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
