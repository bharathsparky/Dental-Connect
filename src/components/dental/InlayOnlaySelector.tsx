import { useRef, useCallback, useState } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, Info, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InlayOnlayData, InlayOnlayType, SurfaceInvolvement } from "@/stores/orderStore"

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

const SURFACE_OPTIONS = [
  { id: 'O', label: 'O', fullName: 'Occlusal' },
  { id: 'M', label: 'M', fullName: 'Mesial' },
  { id: 'D', label: 'D', fullName: 'Distal' },
  { id: 'B', label: 'B', fullName: 'Buccal' },
  { id: 'L', label: 'L', fullName: 'Lingual' },
]

const COMMON_PATTERNS = [
  { id: 'O', label: 'O only', description: 'Occlusal surface only' },
  { id: 'MO', label: 'MO', description: 'Mesial-Occlusal' },
  { id: 'DO', label: 'DO', description: 'Distal-Occlusal' },
  { id: 'MOD', label: 'MOD', description: 'Mesial-Occlusal-Distal' },
  { id: 'MODB', label: 'MODB', description: 'All except lingual' },
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
  const [expandedTooth, setExpandedTooth] = useState<string | null>(null)

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    const prevSelection = prevSelectionRef.current
    
    // Find added teeth
    const addedTeeth = currentSelection.filter(t => !prevSelection.includes(t))
    
    // Initialize surface involvement for new teeth (default to MOD for inlay)
    const currentSurfaces = inlayOnlayData.surfaceInvolvement || {}
    const newSurfaces = { ...currentSurfaces }
    
    addedTeeth.forEach(tooth => {
      if (!newSurfaces[tooth]) {
        newSurfaces[tooth] = 'MOD' // Default surface pattern
      }
    })
    
    // Remove surfaces for deselected teeth
    Object.keys(newSurfaces).forEach(tooth => {
      if (!currentSelection.includes(tooth)) {
        delete newSurfaces[tooth]
      }
    })
    
    onInlayOnlayDataChange({ 
      selectedTeeth: currentSelection,
      surfaceInvolvement: newSurfaces
    })
    prevSelectionRef.current = currentSelection
  }, [onInlayOnlayDataChange, inlayOnlayData.surfaceInvolvement])

  const updateToothSurface = (tooth: string, surface: SurfaceInvolvement) => {
    const currentSurfaces = inlayOnlayData.surfaceInvolvement || {}
    onInlayOnlayDataChange({
      surfaceInvolvement: {
        ...currentSurfaces,
        [tooth]: surface
      }
    })
  }

  const toggleSurfaceLetter = (tooth: string, letter: string) => {
    const currentPattern = inlayOnlayData.surfaceInvolvement?.[tooth] || 'O'
    let newPattern: string
    
    if (currentPattern.includes(letter)) {
      // Remove the letter
      newPattern = currentPattern.replace(letter, '')
    } else {
      // Add the letter in the correct order: M, O, D, B, L
      const order = ['M', 'O', 'D', 'B', 'L']
      const letters = (currentPattern + letter).split('')
      letters.sort((a, b) => order.indexOf(a) - order.indexOf(b))
      newPattern = letters.join('')
    }
    
    if (newPattern === '') newPattern = 'O' // At least occlusal required
    updateToothSurface(tooth, newPattern as SurfaceInvolvement)
  }

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

      {/* Surface Involvement per Tooth */}
      {inlayOnlayData.selectedTeeth && inlayOnlayData.selectedTeeth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Surface Involvement</h3>
          <p className="text-xs text-white/50 mb-3">
            Specify which surfaces are involved for each tooth
          </p>
          
          <div className="space-y-2">
            {inlayOnlayData.selectedTeeth.sort().map((tooth) => (
              <div key={tooth} className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <button
                  onClick={() => setExpandedTooth(expandedTooth === tooth ? null : tooth)}
                  className="w-full flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="font-medium text-primary">{tooth}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-white text-sm">Tooth {tooth}</p>
                      <p className="text-xs text-primary">
                        {inlayOnlayData.surfaceInvolvement?.[tooth] || 'MOD'}
                      </p>
                    </div>
                  </div>
                  {expandedTooth === tooth ? (
                    <ChevronUp className="w-4 h-4 text-white/50" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/50" />
                  )}
                </button>
                
                {expandedTooth === tooth && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-3 pb-3 border-t border-border/30"
                  >
                    {/* Quick Patterns */}
                    <p className="text-[10px] text-white/50 mt-3 mb-2">Quick Select:</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {COMMON_PATTERNS.map((pattern) => (
                        <button
                          key={pattern.id}
                          onClick={() => updateToothSurface(tooth, pattern.id as SurfaceInvolvement)}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-medium transition-all",
                            inlayOnlayData.surfaceInvolvement?.[tooth] === pattern.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-white/10 text-white/70 hover:bg-white/20"
                          )}
                        >
                          {pattern.id}
                        </button>
                      ))}
                    </div>
                    
                    {/* Individual Surfaces */}
                    <p className="text-[10px] text-white/50 mb-2">Or customize:</p>
                    <div className="flex gap-2">
                      {SURFACE_OPTIONS.map((surface) => {
                        const isActive = inlayOnlayData.surfaceInvolvement?.[tooth]?.includes(surface.id)
                        return (
                          <button
                            key={surface.id}
                            onClick={() => toggleSurfaceLetter(tooth, surface.id)}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-white/10 text-white/50 hover:bg-white/20"
                            )}
                          >
                            <span className="block">{surface.label}</span>
                            <span className="block text-[8px] opacity-60">{surface.fullName}</span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
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
          <p className="text-sm font-medium text-primary mb-2">
            {inlayOnlayData.selectedTeeth.length} {INLAY_ONLAY_TYPES.find(t => t.id === inlayOnlayData.type)?.label}{inlayOnlayData.selectedTeeth.length > 1 ? 's' : ''}
          </p>
          <div className="space-y-1 text-xs">
            {inlayOnlayData.selectedTeeth.sort().map((tooth) => (
              <div key={tooth} className="flex items-center gap-2">
                <span className="text-white/50">#{tooth}:</span>
                <span className="text-white font-medium">
                  {inlayOnlayData.surfaceInvolvement?.[tooth] || 'MOD'}
                </span>
              </div>
            ))}
          </div>
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
