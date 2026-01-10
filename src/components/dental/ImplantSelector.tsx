import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ImplantData } from "@/stores/orderStore"

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
  { id: 'other', label: 'Other', description: 'Specify in notes' },
]

const ABUTMENT_TYPES = [
  { id: 'stock', label: 'Stock Abutment' },
  { id: 'custom', label: 'Custom Abutment' },
  { id: 'screw_retained', label: 'Screw-Retained Crown' },
  { id: 'cement_retained', label: 'Cement-Retained Crown' },
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

      {/* Abutment Type */}
      {implantData.implantSystem && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Restoration Type</h3>
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
                <p className={cn(
                  "font-medium text-sm",
                  implantData.abutmentType === type.id ? "text-primary" : "text-white"
                )}>
                  {type.label}
                </p>
                {implantData.abutmentType === type.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
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
            {implantData.positions.length} Implant{implantData.positions.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-white/60 mb-2">
            Positions: {implantData.positions.sort().join(', ')}
          </p>
          <p className="text-xs text-white/50">
            System: {IMPLANT_SYSTEMS.find(s => s.id === implantData.implantSystem)?.label}
            {implantData.abutmentType && ` • ${ABUTMENT_TYPES.find(t => t.id === implantData.abutmentType)?.label}`}
          </p>
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
