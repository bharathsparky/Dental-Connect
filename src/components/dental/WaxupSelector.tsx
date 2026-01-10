import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, Lightbulb, Eye, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WaxupData } from "@/stores/orderStore"

interface WaxupSelectorProps {
  waxupData: WaxupData
  onWaxupDataChange: (data: Partial<WaxupData>) => void
}

const WAXUP_PURPOSES = [
  { 
    id: 'diagnostic', 
    label: 'Diagnostic Wax-Up', 
    description: 'Treatment planning & case presentation',
    icon: Lightbulb,
    details: 'Visualize proposed changes, patient communication',
    color: 'bg-amber-500/20 text-amber-400'
  },
  { 
    id: 'provisional', 
    label: 'Provisional Template', 
    description: 'Silicone matrix for chair-side temps',
    icon: Wrench,
    details: 'Time-saving, accurate provisionals',
    color: 'bg-blue-500/20 text-blue-400'
  },
  { 
    id: 'smile_design', 
    label: 'Smile Design / Mock-Up', 
    description: 'Try-in preview before final restoration',
    icon: Eye,
    details: 'Patient approval, shape/proportion trial',
    color: 'bg-emerald-500/20 text-emerald-400'
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

export function WaxupSelector({ waxupData, onWaxupDataChange }: WaxupSelectorProps) {
  const prevSelectionRef = useRef<string[]>(waxupData.selectedTeeth || [])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    onWaxupDataChange({ selectedTeeth: currentSelection })
    prevSelectionRef.current = currentSelection
  }, [onWaxupDataChange])

  return (
    <div className="space-y-6">
      {/* Purpose Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Purpose</h3>
        <div className="space-y-3">
          {WAXUP_PURPOSES.map((purpose) => {
            const Icon = purpose.icon
            return (
              <button
                key={purpose.id}
                onClick={() => onWaxupDataChange({ purpose: purpose.id as 'diagnostic' | 'provisional' | 'smile_design' })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  waxupData.purpose === purpose.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", purpose.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-medium text-sm",
                        waxupData.purpose === purpose.id ? "text-primary" : "text-white"
                      )}>
                        {purpose.label}
                      </p>
                      {waxupData.purpose === purpose.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">{purpose.description}</p>
                    <p className="text-[10px] text-white/40 mt-1">{purpose.details}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tooth Selection */}
      {waxupData.purpose && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-1">Select Teeth for Wax-Up</h3>
          <p className="text-xs text-white/50 mb-4">
            Tap on teeth to include in the wax-up design
          </p>

          <div className="rounded-2xl p-4 overflow-hidden">
            <div className="odontogram-waxup-wrapper">
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
        </motion.div>
      )}

      {/* Summary */}
      {waxupData.purpose && waxupData.selectedTeeth && waxupData.selectedTeeth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {WAXUP_PURPOSES.find(p => p.id === waxupData.purpose)?.label}
          </p>
          <p className="text-xs text-white/60">
            {waxupData.selectedTeeth.length} teeth: {waxupData.selectedTeeth.sort().join(', ')}
          </p>
        </motion.div>
      )}

      <style>{`
        .odontogram-waxup-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        .odontogram-waxup-wrapper .Odontogram__tooltip,
        .odontogram-waxup-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        .odontogram-waxup-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-waxup-wrapper svg path:hover {
          fill: #4a7096;
        }
        
        .odontogram-waxup-wrapper svg [aria-selected="true"] path,
        .odontogram-waxup-wrapper svg g[aria-selected="true"] path {
          fill: #5ebbbd !important;
          stroke: #7dd3d5 !important;
        }
        
        .odontogram-waxup-wrapper svg text {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
