import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, Info, AlertCircle, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ImplantData, ImplantRestorationType, ConnectionType } from "@/stores/orderStore"

interface ImplantSelectorProps {
  implantData: ImplantData
  onImplantDataChange: (data: Partial<ImplantData>) => void
  onTogglePosition: (position: string) => void
}

const IMPLANT_SYSTEMS = [
  { id: 'straumann', label: 'Straumann', description: 'BLT, BLX, TL, Tissue Level' },
  { id: 'nobel', label: 'Nobel Biocare', description: 'NobelActive, NobelParallel, NobelReplace' },
  { id: 'zimmer', label: 'Zimmer Biomet', description: 'Tapered Screw-Vent, T3' },
  { id: 'megagen', label: 'MegaGen', description: 'AnyRidge, AnyOne, BlueDiamond' },
  { id: 'osstem', label: 'Osstem', description: 'TS, SS, MS, Ultra-Wide' },
  { id: 'neodent', label: 'Neodent', description: 'Grand Morse, Helix, Titamax' },
  { id: 'biohorizons', label: 'BioHorizons', description: 'Tapered Internal, Laser-Lok' },
  { id: 'dentsply', label: 'Dentsply Sirona', description: 'Astra Tech, Ankylos, Xive' },
  { id: 'other', label: 'Other', description: 'Specify in notes' },
]

const IMPLANT_STAGES = [
  { 
    id: 'healing', 
    label: 'Healing Phase', 
    description: 'Implant placed, healing abutment in situ',
    note: 'Not ready for final restoration yet'
  },
  { 
    id: 'ready', 
    label: 'Ready for Impression', 
    description: 'Osseointegration complete, ready to restore',
    note: 'Will remove healing abutment for impression'
  },
  { 
    id: 'impression_taken', 
    label: 'Impression Already Taken', 
    description: 'Sending existing impression to lab',
    note: 'Impression coping & analog included'
  },
]

const PLATFORM_SIZES = [
  { id: 'narrow', label: 'Narrow Platform', description: '3.0-3.5mm (NP)' },
  { id: 'regular', label: 'Regular Platform', description: '3.5-4.5mm (RP)' },
  { id: 'wide', label: 'Wide Platform', description: '4.5-5.5mm (WP)' },
  { id: 'extra_wide', label: 'Extra Wide', description: '5.5mm+ (XWP)' },
]

const IMPLANT_DIAMETERS = [
  { id: '3.0', label: '3.0 mm' },
  { id: '3.3', label: '3.3 mm' },
  { id: '3.5', label: '3.5 mm' },
  { id: '3.75', label: '3.75 mm' },
  { id: '4.0', label: '4.0 mm' },
  { id: '4.3', label: '4.3 mm' },
  { id: '4.5', label: '4.5 mm' },
  { id: '5.0', label: '5.0 mm' },
  { id: '5.5', label: '5.5 mm' },
  { id: '6.0', label: '6.0 mm' },
  { id: 'unknown', label: 'Unknown / Check Records' },
]

const IMPLANT_LENGTHS = [
  { id: '6', label: '6 mm' },
  { id: '7', label: '7 mm' },
  { id: '8', label: '8 mm' },
  { id: '8.5', label: '8.5 mm' },
  { id: '10', label: '10 mm' },
  { id: '11.5', label: '11.5 mm' },
  { id: '13', label: '13 mm' },
  { id: '15', label: '15 mm' },
  { id: 'unknown', label: 'Unknown / Check Records' },
]

const IMPRESSION_TECHNIQUES = [
  { 
    id: 'open_tray', 
    label: 'Open Tray (Direct)', 
    description: 'Impression coping unscrewed through tray',
    pros: ['More accurate', 'Better for multiple implants', 'Splinted option']
  },
  { 
    id: 'closed_tray', 
    label: 'Closed Tray (Indirect)', 
    description: 'Impression coping stays in mouth, transfers position',
    pros: ['Easier technique', 'Single implants', 'Less gag reflex']
  },
  { 
    id: 'digital_scan', 
    label: 'Digital Scan (IOS)', 
    description: 'Intraoral scan with scan body',
    pros: ['No impression material', 'Fastest', 'Most accurate']
  },
]

const CONNECTION_TYPES = [
  { id: 'internal_hex', label: 'Internal Hex', description: 'Most common, good anti-rotation' },
  { id: 'external_hex', label: 'External Hex', description: 'Traditional, interchangeable' },
  { id: 'morse_taper', label: 'Morse Taper (Conical)', description: 'Cold-welding seal, no micro-gap' },
  { id: 'tri_channel', label: 'Tri-Channel / Tri-Lobe', description: '3-point anti-rotation' },
  { id: 'octagon', label: 'Octagon', description: '8-position indexing' },
]

const RESTORATION_TYPES = [
  { 
    id: 'screw_retained', 
    label: 'Screw-Retained', 
    description: 'Crown screwed directly to abutment/implant',
    pros: ['Retrievable', 'No cement', 'Easy maintenance'],
    cons: ['Screw access hole visible']
  },
  { 
    id: 'cement_retained', 
    label: 'Cement-Retained', 
    description: 'Crown cemented to abutment',
    pros: ['Better aesthetics', 'No screw hole', 'Easier seating'],
    cons: ['Cement remnants risk', 'Less retrievable']
  },
]

const ABUTMENT_TYPES = [
  { id: 'stock_titanium', label: 'Stock Titanium', description: 'Pre-fabricated, economical, posterior' },
  { id: 'stock_zirconia', label: 'Stock Zirconia', description: 'Pre-fabricated, aesthetic, anterior' },
  { id: 'custom_titanium', label: 'Custom Titanium (CAD/CAM)', description: 'Ideal emergence, best fit' },
  { id: 'custom_zirconia', label: 'Custom Zirconia (CAD/CAM)', description: 'Ideal emergence, premium aesthetics' },
  { id: 'ti_base', label: 'Ti-Base + Zirconia', description: 'Hybrid: titanium base, zirconia coping' },
  { id: 'multiunit', label: 'Multi-Unit Abutment', description: 'For angled implants, full arch' },
]

const COMPONENTS_CHECKLIST = [
  { id: 'impression_coping', label: 'Impression Coping', description: 'Transfer/pickup coping in impression' },
  { id: 'implant_analog', label: 'Implant Analog/Replica', description: 'Lab analog for model' },
  { id: 'healing_abutment', label: 'Healing Abutment Info', description: 'Size of current healing cap' },
  { id: 'bite_registration', label: 'Bite Registration', description: 'Occlusal record included' },
  { id: 'opposing_model', label: 'Opposing Arch Model', description: 'For articulation' },
  { id: 'scan_body', label: 'Scan Body (Digital)', description: 'For intraoral scanning' },
]

interface ToothSelection {
  id: string
  notations: {
    fdi: string
    universal: string
    palmer: string
  }
  type: string
}

export function ImplantSelector({ 
  implantData, 
  onImplantDataChange,
  onTogglePosition 
}: ImplantSelectorProps) {
  const prevSelectionRef = useRef<string[]>(implantData.positions || [])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    const previousSelection = prevSelectionRef.current
    
    const addedTeeth = currentSelection.filter(t => !previousSelection.includes(t))
    const removedTeeth = previousSelection.filter(t => !currentSelection.includes(t))
    
    prevSelectionRef.current = currentSelection
    
    addedTeeth.forEach(tooth => onTogglePosition(tooth))
    removedTeeth.forEach(tooth => onTogglePosition(tooth))
  }, [onTogglePosition])

  // Get selected components
  const selectedComponents = implantData.componentsIncluded || []

  return (
    <div className="space-y-6">
      {/* Position Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-1">Select Implant Positions</h3>
        <p className="text-xs text-white/50 mb-4">
          Tap on positions where implants are placed
        </p>

        <div className="rounded-2xl p-4 overflow-hidden">
          <div className="odontogram-implant-wrapper">
            <Odontogram 
              onChange={handleOdontogramChange}
              className="w-full"
              theme="dark"
              colors={{
                selected: '#5ebbbd',
                hover: '#4a7096',
                default: '#3d5a7a',
                stroke: '#5a7a9a',
              }}
            />
          </div>
        </div>

        {implantData.positions && implantData.positions.length > 0 && (
          <div className="mt-3 p-3 bg-primary/10 rounded-xl border border-primary/30">
            <p className="text-xs text-primary font-medium">
              {implantData.positions.length} implant position{implantData.positions.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-white/50 mt-1">
              {implantData.positions.sort().join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Implant Stage */}
      {implantData.positions && implantData.positions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Current Stage</h3>
          <div className="space-y-2">
            {IMPLANT_STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => onImplantDataChange({ implantStage: stage.id as typeof implantData.implantStage })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  implantData.implantStage === stage.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      implantData.implantStage === stage.id ? "text-primary" : "text-white"
                    )}>
                      {stage.label}
                    </p>
                    <p className="text-xs text-white/50">{stage.description}</p>
                    <p className="text-[10px] text-white/40 mt-1">{stage.note}</p>
                  </div>
                  {implantData.implantStage === stage.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Warning for healing stage */}
      {implantData.implantStage === 'healing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-400 font-medium mb-1">Implant Still Healing</p>
            <p className="text-xs text-white/60">
              If the implant is still in healing phase, you may want to wait for osseointegration 
              before taking final impression. You can still place this order for planning purposes.
            </p>
          </div>
        </motion.div>
      )}

      {/* Implant System */}
      {implantData.implantStage && implantData.implantStage !== 'healing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Implant System/Brand</h3>
          <div className="grid grid-cols-2 gap-2">
            {IMPLANT_SYSTEMS.map((system) => (
              <button
                key={system.id}
                onClick={() => onImplantDataChange({ implantSystem: system.id })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-left",
                  implantData.implantSystem === system.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm",
                  implantData.implantSystem === system.id ? "text-primary" : "text-white"
                )}>
                  {system.label}
                </p>
                <p className="text-[10px] text-white/50">{system.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Implant Specifications */}
      {implantData.implantSystem && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-medium text-white">Implant Specifications</h3>
          
          {/* Platform Size */}
          <div>
            <p className="text-xs text-white/60 mb-2">Platform Size</p>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORM_SIZES.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => onImplantDataChange({ platformSize: platform.id as typeof implantData.platformSize })}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-left",
                    implantData.platformSize === platform.id
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <p className={cn(
                    "font-medium text-xs",
                    implantData.platformSize === platform.id ? "text-primary" : "text-white"
                  )}>
                    {platform.label}
                  </p>
                  <p className="text-[10px] text-white/40">{platform.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Diameter & Length in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60 mb-2">Diameter</p>
              <select
                value={implantData.implantDiameter || ''}
                onChange={(e) => onImplantDataChange({ implantDiameter: e.target.value })}
                className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white focus:border-primary/50 focus:outline-none"
              >
                <option value="">Select...</option>
                {IMPLANT_DIAMETERS.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-2">Length</p>
              <select
                value={implantData.implantLength || ''}
                onChange={(e) => onImplantDataChange({ implantLength: e.target.value })}
                className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white focus:border-primary/50 focus:outline-none"
              >
                <option value="">Select...</option>
                {IMPLANT_LENGTHS.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Connection Type */}
      {implantData.platformSize && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Connection Type</h3>
          <div className="space-y-2">
            {CONNECTION_TYPES.map((conn) => (
              <button
                key={conn.id}
                onClick={() => onImplantDataChange({ connectionType: conn.id as ConnectionType })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  implantData.connectionType === conn.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    implantData.connectionType === conn.id ? "text-primary" : "text-white"
                  )}>
                    {conn.label}
                  </p>
                  <p className="text-[10px] text-white/50">{conn.description}</p>
                </div>
                {implantData.connectionType === conn.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Impression Technique */}
      {implantData.connectionType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Impression Technique</h3>
          <div className="space-y-2">
            {IMPRESSION_TECHNIQUES.map((tech) => (
              <button
                key={tech.id}
                onClick={() => onImplantDataChange({ impressionTechnique: tech.id as typeof implantData.impressionTechnique })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  implantData.impressionTechnique === tech.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={cn(
                    "font-medium text-sm",
                    implantData.impressionTechnique === tech.id ? "text-primary" : "text-white"
                  )}>
                    {tech.label}
                  </p>
                  {implantData.impressionTechnique === tech.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-white/50 mb-2">{tech.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tech.pros.map((pro, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-white/40">
                      {pro}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Components Included */}
      {implantData.impressionTechnique && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-white">Components Included</h3>
          </div>
          <p className="text-xs text-white/50 mb-3">
            Check all components you're sending to the lab
          </p>
          <div className="space-y-2">
            {COMPONENTS_CHECKLIST.filter(c => {
              // Filter based on impression technique
              if (c.id === 'scan_body' && implantData.impressionTechnique !== 'digital_scan') return false
              if (c.id === 'impression_coping' && implantData.impressionTechnique === 'digital_scan') return false
              return true
            }).map((component) => {
              const isChecked = selectedComponents.includes(component.id)
              return (
                <button
                  key={component.id}
                  onClick={() => {
                    const newComponents = isChecked
                      ? selectedComponents.filter(c => c !== component.id)
                      : [...selectedComponents, component.id]
                    onImplantDataChange({ componentsIncluded: newComponents })
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                    isChecked
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                    isChecked ? "bg-primary border-primary" : "border-white/30"
                  )}>
                    {isChecked && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      isChecked ? "text-primary" : "text-white"
                    )}>
                      {component.label}
                    </p>
                    <p className="text-[10px] text-white/50">{component.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Warning if analog not included */}
          {implantData.impressionTechnique !== 'digital_scan' && 
           !selectedComponents.includes('implant_analog') && 
           selectedComponents.includes('impression_coping') && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/60">
                <span className="text-amber-400 font-medium">Implant analog recommended!</span> The lab needs an analog to pour the model and position the implant correctly.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Restoration Type */}
      {selectedComponents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Restoration Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {RESTORATION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onImplantDataChange({ restorationType: type.id as ImplantRestorationType })}
                className={cn(
                  "p-4 rounded-xl border transition-all text-left",
                  implantData.restorationType === type.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm mb-1",
                  implantData.restorationType === type.id ? "text-primary" : "text-white"
                )}>
                  {type.label}
                </p>
                <p className="text-[10px] text-white/50 mb-2">{type.description}</p>
                <div className="space-y-0.5">
                  {type.pros.map((pro, i) => (
                    <p key={i} className="text-[9px] text-emerald-400/80 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> {pro}
                    </p>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Abutment Type */}
      {implantData.restorationType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Abutment Type</h3>
          <div className="space-y-2">
            {ABUTMENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onImplantDataChange({ abutmentType: type.id })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  implantData.abutmentType === type.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    implantData.abutmentType === type.id ? "text-primary" : "text-white"
                  )}>
                    {type.label}
                  </p>
                  <p className="text-[10px] text-white/50">{type.description}</p>
                </div>
                {implantData.abutmentType === type.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Healing Abutment Info */}
      {implantData.abutmentType && selectedComponents.includes('healing_abutment') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Healing Abutment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60 mb-2">Height</p>
              <select
                value={implantData.healingAbutmentHeight || ''}
                onChange={(e) => onImplantDataChange({ healingAbutmentHeight: e.target.value })}
                className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white focus:border-primary/50 focus:outline-none"
              >
                <option value="">Select...</option>
                <option value="2">2 mm</option>
                <option value="3">3 mm</option>
                <option value="4">4 mm</option>
                <option value="5">5 mm</option>
                <option value="6">6 mm</option>
                <option value="7">7 mm</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-2">Diameter</p>
              <select
                value={implantData.healingAbutmentDiameter || ''}
                onChange={(e) => onImplantDataChange({ healingAbutmentDiameter: e.target.value })}
                className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white focus:border-primary/50 focus:outline-none"
              >
                <option value="">Select...</option>
                <option value="3.5">3.5 mm</option>
                <option value="4.0">4.0 mm</option>
                <option value="4.5">4.5 mm</option>
                <option value="5.0">5.0 mm</option>
                <option value="5.5">5.5 mm</option>
                <option value="6.0">6.0 mm</option>
                <option value="6.5">6.5 mm</option>
              </select>
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-2">
            This helps the lab match the emergence profile
          </p>
        </motion.div>
      )}

      {/* Summary */}
      {implantData.abutmentType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-2">
            {implantData.positions?.length} Implant Crown{(implantData.positions?.length || 0) > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-white/50">Positions:</span>
              <span className="text-white ml-1">{implantData.positions?.sort().join(', ')}</span>
            </div>
            <div>
              <span className="text-white/50">System:</span>
              <span className="text-white ml-1">{IMPLANT_SYSTEMS.find(s => s.id === implantData.implantSystem)?.label}</span>
            </div>
            {implantData.platformSize && (
              <div>
                <span className="text-white/50">Platform:</span>
                <span className="text-white ml-1">{PLATFORM_SIZES.find(p => p.id === implantData.platformSize)?.label}</span>
              </div>
            )}
            {implantData.implantDiameter && (
              <div>
                <span className="text-white/50">Diameter:</span>
                <span className="text-white ml-1">{implantData.implantDiameter} mm</span>
              </div>
            )}
            <div>
              <span className="text-white/50">Connection:</span>
              <span className="text-white ml-1">{CONNECTION_TYPES.find(c => c.id === implantData.connectionType)?.label}</span>
            </div>
            <div>
              <span className="text-white/50">Impression:</span>
              <span className="text-white ml-1">{IMPRESSION_TECHNIQUES.find(t => t.id === implantData.impressionTechnique)?.label}</span>
            </div>
            <div>
              <span className="text-white/50">Restoration:</span>
              <span className="text-white ml-1">{RESTORATION_TYPES.find(r => r.id === implantData.restorationType)?.label}</span>
            </div>
            <div>
              <span className="text-white/50">Abutment:</span>
              <span className="text-white ml-1">{ABUTMENT_TYPES.find(a => a.id === implantData.abutmentType)?.label}</span>
            </div>
          </div>
          {selectedComponents.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-[10px] text-white/50">
                Components: {selectedComponents.map(c => COMPONENTS_CHECKLIST.find(cc => cc.id === c)?.label).join(', ')}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Info Box */}
      {implantData.abutmentType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/10 border border-primary/30 rounded-xl flex gap-3"
        >
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-primary font-medium mb-1">Ready to Send</p>
            <p className="text-xs text-white/60">
              Include all checked components with your shipment. The lab will pour the model with the analog 
              and fabricate the {implantData.abutmentType?.includes('custom') ? 'custom' : 'stock'} abutment 
              and {implantData.restorationType === 'screw_retained' ? 'screw-retained' : 'cement-retained'} crown.
            </p>
          </div>
        </motion.div>
      )}

      <style>{`
        .odontogram-implant-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        .odontogram-implant-wrapper .Odontogram__tooltip,
        .odontogram-implant-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        .odontogram-implant-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-implant-wrapper svg path:hover {
          fill: #4a7096;
        }
        
        .odontogram-implant-wrapper svg [aria-selected="true"] path,
        .odontogram-implant-wrapper svg g[aria-selected="true"] path {
          fill: #5ebbbd !important;
          stroke: #7dd3d5 !important;
        }
        
        .odontogram-implant-wrapper svg text {
          display: none !important;
        }
        
        select option {
          background: #1a2a3a;
          color: white;
        }
      `}</style>
    </div>
  )
}
