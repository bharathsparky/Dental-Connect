import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InlayOnlayData, InlayOnlayType } from "@/stores/orderStore"

interface InlayOnlaySelectorProps {
  inlayOnlayData: InlayOnlayData
  onInlayOnlayDataChange: (data: Partial<InlayOnlayData>) => void
}

const INLAY_ONLAY_TYPES = [
  { 
    id: 'inlay', 
    label: 'Inlay', 
    description: 'Fills within cusps only',
    indications: 'Moderate decay, no cusp involvement'
  },
  { 
    id: 'onlay', 
    label: 'Onlay', 
    description: 'Covers one or more cusps',
    indications: 'Cusp fracture/wear, large restoration'
  },
  { 
    id: 'overlay', 
    label: 'Overlay (Table Top)', 
    description: 'Covers all cusps',
    indications: 'Worn dentition, occlusal rehab'
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

export function InlayOnlaySelector({ inlayOnlayData, onInlayOnlayDataChange }: InlayOnlaySelectorProps) {
  const prevSelectionRef = useRef<string[]>(inlayOnlayData.selectedTeeth || [])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    onInlayOnlayDataChange({ selectedTeeth: currentSelection })
    prevSelectionRef.current = currentSelection
  }, [onInlayOnlayDataChange])

  return (
    <div className="space-y-6">
      {/* Restoration Type */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Restoration Type</h3>
        <div className="space-y-3">
          {INLAY_ONLAY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onInlayOnlayDataChange({ type: type.id as InlayOnlayType })}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all",
                inlayOnlayData.type === type.id
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "font-medium text-sm mb-1",
                    inlayOnlayData.type === type.id ? "text-primary" : "text-white"
                  )}>
                    {type.label}
                  </p>
                  <p className="text-xs text-white/50">{type.description}</p>
                  <p className="text-[10px] text-white/40 mt-1">{type.indications}</p>
                </div>
                {inlayOnlayData.type === type.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tooth Selection */}
      {inlayOnlayData.type && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-1">Select Teeth</h3>
          <p className="text-xs text-white/50 mb-4">
            Tap on teeth that need {inlayOnlayData.type === 'inlay' ? 'inlays' : inlayOnlayData.type === 'onlay' ? 'onlays' : 'overlays'}
          </p>

          <div className="rounded-2xl p-4 overflow-hidden">
            <div className="odontogram-inlay-wrapper">
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

          {/* Info */}
          <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-xl flex gap-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/60">
              Inlays/onlays are conservative restorations typically used on posterior teeth 
              (premolars and molars) when more than a filling is needed but less than a crown.
            </p>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {inlayOnlayData.type && inlayOnlayData.selectedTeeth && inlayOnlayData.selectedTeeth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {inlayOnlayData.selectedTeeth.length} {INLAY_ONLAY_TYPES.find(t => t.id === inlayOnlayData.type)?.label}{inlayOnlayData.selectedTeeth.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-white/60">
            Teeth: {inlayOnlayData.selectedTeeth.sort().join(', ')}
          </p>
        </motion.div>
      )}

      <style>{`
        .odontogram-inlay-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        .odontogram-inlay-wrapper .Odontogram__tooltip,
        .odontogram-inlay-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        .odontogram-inlay-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-inlay-wrapper svg path:hover {
          fill: #4a7096;
        }
        
        .odontogram-inlay-wrapper svg [aria-selected="true"] path,
        .odontogram-inlay-wrapper svg g[aria-selected="true"] path {
          fill: #5ebbbd !important;
          stroke: #7dd3d5 !important;
        }
        
        .odontogram-inlay-wrapper svg text {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
