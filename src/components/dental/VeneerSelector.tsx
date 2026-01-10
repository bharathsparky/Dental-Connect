import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VeneerData, VeneerType, IncisalOverlap, ContactDesign } from "@/stores/orderStore"

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

const INCISAL_OVERLAPS = [
  { id: 'no_overlap', label: 'No Incisal Overlap', description: 'Veneer ends at incisal edge' },
  { id: 'butt_joint', label: 'Butt Joint', description: 'Veneer meets at incisal, no wrap' },
  { id: 'overlap', label: 'Incisal Overlap', description: 'Wraps over incisal 1-2mm' },
  { id: 'full_coverage', label: 'Full Incisal Coverage', description: '360° coverage of incisal' },
]

const CONTACT_DESIGNS = [
  { id: 'point', label: 'Point Contact', description: 'Small contact area, easier seating' },
  { id: 'broad', label: 'Broad Contact', description: 'Larger contact, better stability' },
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

      {/* Incisal Overlap */}
      {veneerData.selectedTeeth && veneerData.selectedTeeth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Incisal Preparation</h3>
          <div className="grid grid-cols-2 gap-2">
            {INCISAL_OVERLAPS.map((overlap) => (
              <button
                key={overlap.id}
                onClick={() => onVeneerDataChange({ incisalOverlap: overlap.id as IncisalOverlap })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-left",
                  veneerData.incisalOverlap === overlap.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-xs",
                  veneerData.incisalOverlap === overlap.id ? "text-primary" : "text-white"
                )}>
                  {overlap.label}
                </p>
                <p className="text-[9px] text-white/50">{overlap.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contact Design */}
      {veneerData.incisalOverlap && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Contact Design</h3>
          <div className="grid grid-cols-2 gap-3">
            {CONTACT_DESIGNS.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onVeneerDataChange({ contactDesign: contact.id as ContactDesign })}
                className={cn(
                  "p-4 rounded-xl border transition-all text-center",
                  veneerData.contactDesign === contact.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm mb-1",
                  veneerData.contactDesign === contact.id ? "text-primary" : "text-white"
                )}>
                  {contact.label}
                </p>
                <p className="text-[10px] text-white/50">{contact.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Try-In Option */}
      {veneerData.contactDesign && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">Bisque Bake Try-In?</p>
                <button
                  onClick={() => onVeneerDataChange({ needsTryIn: !veneerData.needsTryIn })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    veneerData.needsTryIn ? "bg-primary" : "bg-white/20"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all",
                    veneerData.needsTryIn ? "left-6" : "left-0.5"
                  )} />
                </button>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Try veneers before final glazing to verify shade, shape & fit with patient
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Length/Width Modification */}
      {veneerData.contactDesign && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Length Modification</h3>
          <div className="grid grid-cols-3 gap-2">
            {['shorter', 'same', 'longer'].map((mod) => (
              <button
                key={mod}
                onClick={() => onVeneerDataChange({ lengthModification: mod as 'shorter' | 'same' | 'longer' })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-center",
                  veneerData.lengthModification === mod
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm capitalize",
                  veneerData.lengthModification === mod ? "text-primary" : "text-white"
                )}>
                  {mod === 'same' ? 'Same Length' : mod === 'shorter' ? 'Shorter' : 'Longer'}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {veneerData.veneerType && veneerData.selectedTeeth && veneerData.selectedTeeth.length > 0 && veneerData.contactDesign && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-2">
            {veneerData.selectedTeeth.length} {VENEER_TYPES.find(t => t.id === veneerData.veneerType)?.label}{veneerData.selectedTeeth.length > 1 ? 's' : ''}
            {veneerData.needsTryIn && ' (with try-in)'}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-white/50">Teeth:</span>
              <span className="text-white ml-1">{veneerData.selectedTeeth.sort().join(', ')}</span>
            </div>
            <div>
              <span className="text-white/50">Incisal:</span>
              <span className="text-white ml-1">{veneerData.incisalOverlap?.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-white/50">Contact:</span>
              <span className="text-white ml-1 capitalize">{veneerData.contactDesign}</span>
            </div>
            {veneerData.lengthModification && veneerData.lengthModification !== 'same' && (
              <div>
                <span className="text-white/50">Length:</span>
                <span className="text-white ml-1 capitalize">{veneerData.lengthModification}</span>
              </div>
            )}
          </div>
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
