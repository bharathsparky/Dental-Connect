import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ImplantData, ImplantRestorationType, ConnectionType } from "@/stores/orderStore"

interface ImplantSelectorProps {
  implantData: ImplantData
  onImplantDataChange: (data: Partial<ImplantData>) => void
  onTogglePosition: (position: string) => void
}

const IMPLANT_SYSTEMS = [
  { id: 'straumann', label: 'Straumann', description: 'BLT, BLX, TL' },
  { id: 'nobel', label: 'Nobel Biocare', description: 'NobelActive, NobelParallel' },
  { id: 'zimmer', label: 'Zimmer Biomet', description: 'Tapered Screw-Vent' },
  { id: 'megagen', label: 'MegaGen', description: 'AnyRidge, AnyOne' },
  { id: 'osstem', label: 'Osstem', description: 'TS, SS, MS' },
  { id: 'neodent', label: 'Neodent', description: 'Grand Morse, Helix' },
  { id: 'other', label: 'Other', description: 'Specify in notes' },
]

const RESTORATION_TYPES = [
  { 
    id: 'screw_retained', 
    label: 'Screw-Retained', 
    description: 'Retrievable, no cement risk',
    pros: ['Easy retrieval', 'No cement remnants', 'Better for posterior']
  },
  { 
    id: 'cement_retained', 
    label: 'Cement-Retained', 
    description: 'Better aesthetics, passive fit',
    pros: ['Superior aesthetics', 'Easier seating', 'Better for anterior']
  },
]

const CONNECTION_TYPES = [
  { id: 'internal_hex', label: 'Internal Hex', description: 'Most common, good stability' },
  { id: 'external_hex', label: 'External Hex', description: 'Traditional, interchangeable' },
  { id: 'morse_taper', label: 'Morse Taper (Conical)', description: 'Cold-welding, bacterial seal' },
  { id: 'multi_unit', label: 'Multi-Unit Abutment', description: 'For angled implants' },
]

const ABUTMENT_TYPES = [
  { id: 'stock', label: 'Stock Abutment', description: 'Pre-fabricated, economical' },
  { id: 'custom', label: 'Custom/CAD Abutment', description: 'Ideal emergence profile' },
  { id: 'ti_base', label: 'Ti-Base + Zirconia', description: 'Premium aesthetics' },
  { id: 'multiunit', label: 'Multi-Unit Abutment', description: 'For angulation correction' },
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
    
    // Find newly added or removed teeth
    const addedTeeth = currentSelection.filter(t => !previousSelection.includes(t))
    const removedTeeth = previousSelection.filter(t => !currentSelection.includes(t))
    
    prevSelectionRef.current = currentSelection
    
    // Toggle each changed tooth
    addedTeeth.forEach(tooth => onTogglePosition(tooth))
    removedTeeth.forEach(tooth => onTogglePosition(tooth))
  }, [onTogglePosition])

  return (
    <div className="space-y-6">
      {/* Position Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-1">Select Implant Positions</h3>
        <p className="text-xs text-white/50 mb-4">
          Tap on positions where implants are placed
        </p>

        {/* Dental Chart using react-odontogram */}
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

        {/* Selection summary */}
        {implantData.positions && implantData.positions.length > 0 && (
          <div className="mt-3 p-3 bg-primary/10 rounded-xl border border-primary/30">
            <p className="text-xs text-primary font-medium">
              {implantData.positions.length} position{implantData.positions.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-white/50 mt-1">
              {implantData.positions.sort().join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Implant System */}
      {implantData.positions && implantData.positions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Implant System</h3>
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

      {/* Connection Type */}
      {implantData.implantSystem && (
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

      {/* Restoration Type (Screw vs Cement) */}
      {implantData.connectionType && (
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
                <ul className="space-y-0.5">
                  {type.pros.map((pro, i) => (
                    <li key={i} className="text-[10px] text-white/40 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-primary" />
                      {pro}
                    </li>
                  ))}
                </ul>
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

      {/* Scan Body Reminder */}
      {implantData.abutmentType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-3"
        >
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-400 font-medium mb-1">Lab Analog Required</p>
            <p className="text-xs text-white/60">
              Please include implant analog/lab replica with your impression. 
              For digital scans, ensure scan body is compatible with {IMPLANT_SYSTEMS.find(s => s.id === implantData.implantSystem)?.label || 'your system'}.
            </p>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {implantData.positions && implantData.positions.length > 0 && implantData.implantSystem && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {implantData.positions.length} Implant{implantData.positions.length > 1 ? 's' : ''} Crown{implantData.positions.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-white/60 mb-2">
            Positions: {implantData.positions.sort().join(', ')}
          </p>
          <div className="text-xs text-white/50 space-y-0.5">
            <p>System: {IMPLANT_SYSTEMS.find(s => s.id === implantData.implantSystem)?.label}</p>
            {implantData.connectionType && (
              <p>Connection: {CONNECTION_TYPES.find(c => c.id === implantData.connectionType)?.label}</p>
            )}
            {implantData.restorationType && (
              <p>Type: {RESTORATION_TYPES.find(r => r.id === implantData.restorationType)?.label}</p>
            )}
            {implantData.abutmentType && (
              <p>Abutment: {ABUTMENT_TYPES.find(t => t.id === implantData.abutmentType)?.label}</p>
            )}
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
      `}</style>
    </div>
  )
}
