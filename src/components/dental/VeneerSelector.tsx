import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VeneerData, VeneerType } from "@/stores/orderStore"

interface VeneerSelectorProps {
  veneerData: VeneerData
  onVeneerDataChange: (data: Partial<VeneerData>) => void
}

const VENEER_TYPES = [
  { 
    id: 'porcelain', 
    label: 'Porcelain Veneer', 
    description: 'Traditional 0.5-0.7mm prep',
    details: 'Best aesthetics, moderate reduction'
  },
  { 
    id: 'minimal_prep', 
    label: 'Minimal Prep', 
    description: 'Conservative 0.3-0.5mm',
    details: 'Less invasive, good aesthetics'
  },
  { 
    id: 'no_prep', 
    label: 'No-Prep (Lumineer)', 
    description: 'Ultra-thin, no reduction',
    details: 'Reversible, minimal enamel loss'
  },
  { 
    id: 'composite', 
    label: 'Composite Veneer', 
    description: 'Lab-processed resin',
    details: 'Economical, repairable'
  },
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

export function VeneerSelector({ veneerData, onVeneerDataChange }: VeneerSelectorProps) {
  const prevSelectionRef = useRef<string[]>(veneerData.selectedTeeth || [])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    onVeneerDataChange({ selectedTeeth: currentSelection })
    prevSelectionRef.current = currentSelection
  }, [onVeneerDataChange])

  return (
    <div className="space-y-6">
      {/* Veneer Type */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Veneer Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {VENEER_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onVeneerDataChange({ veneerType: type.id as VeneerType })}
              className={cn(
                "p-4 rounded-xl border transition-all text-left",
                veneerData.veneerType === type.id
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <p className={cn(
                "font-medium text-sm mb-1",
                veneerData.veneerType === type.id ? "text-primary" : "text-white"
              )}>
                {type.label}
              </p>
              <p className="text-[10px] text-white/50 mb-1">{type.description}</p>
              <p className="text-[9px] text-white/40">{type.details}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tooth Selection */}
      {veneerData.veneerType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-1">Select Teeth</h3>
          <p className="text-xs text-white/50 mb-4">
            Tap on teeth that need veneers (typically anterior teeth)
          </p>

          <div className="rounded-2xl p-4 overflow-hidden">
            <div className="odontogram-veneer-wrapper">
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

          {/* Info about veneer teeth */}
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-2">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/60">
              Veneers are typically placed on upper anterior teeth (13-23) for smile enhancement.
              Posterior teeth can be included if needed.
            </p>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {veneerData.veneerType && veneerData.selectedTeeth && veneerData.selectedTeeth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {veneerData.selectedTeeth.length} {VENEER_TYPES.find(t => t.id === veneerData.veneerType)?.label}{veneerData.selectedTeeth.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-white/60">
            Teeth: {veneerData.selectedTeeth.sort().join(', ')}
          </p>
        </motion.div>
      )}

      <style>{`
        .odontogram-veneer-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        .odontogram-veneer-wrapper .Odontogram__tooltip,
        .odontogram-veneer-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        .odontogram-veneer-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-veneer-wrapper svg path:hover {
          fill: #4a7096;
        }
        
        .odontogram-veneer-wrapper svg [aria-selected="true"] path,
        .odontogram-veneer-wrapper svg g[aria-selected="true"] path {
          fill: #5ebbbd !important;
          stroke: #7dd3d5 !important;
        }
        
        .odontogram-veneer-wrapper svg text {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
