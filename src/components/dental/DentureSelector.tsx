import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DentureData, DentureType, DentureArch, ClaspDesign } from "@/stores/orderStore"

interface DentureSelectorProps {
  dentureData: DentureData
  onDentureDataChange: (data: Partial<DentureData>) => void
}

const DENTURE_TYPES = [
  { id: 'full', label: 'Full Denture', description: 'Complete denture for edentulous arch' },
  { id: 'partial', label: 'Partial Denture', description: 'Removable partial for some missing teeth' },
  { id: 'immediate', label: 'Immediate Denture', description: 'Placed immediately after extraction' },
  { id: 'overdenture', label: 'Overdenture', description: 'Implant-retained removable prosthesis' },
  { id: 'obturator', label: 'Obturator', description: 'Prosthesis to close palatal defect' },
]

const ARCH_OPTIONS = [
  { id: 'upper', label: 'Upper Arch', description: 'Maxillary denture' },
  { id: 'lower', label: 'Lower Arch', description: 'Mandibular denture' },
  { id: 'both', label: 'Both Arches', description: 'Full set - upper & lower' },
]

const CLASP_DESIGNS = [
  { id: 'c_clasp', label: 'C-Clasp (Circumferential)', description: 'Standard retentive clasp' },
  { id: 'i_bar', label: 'I-Bar (RPI System)', description: 'Better aesthetics, tissue supported' },
  { id: 'wrought_wire', label: 'Wrought Wire', description: 'Flexible, tooth-friendly' },
  { id: 'precision_attachment', label: 'Precision Attachment', description: 'Hidden, aesthetic retention' },
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

export function DentureSelector({ dentureData, onDentureDataChange }: DentureSelectorProps) {
  const prevSelectionRef = useRef<string[]>(dentureData.missingTeeth || [])
  const prevImplantRef = useRef<string[]>(dentureData.implantPositions || [])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    onDentureDataChange({ missingTeeth: currentSelection })
    prevSelectionRef.current = currentSelection
  }, [onDentureDataChange])

  const handleImplantOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    onDentureDataChange({ implantPositions: currentSelection })
    prevImplantRef.current = currentSelection
  }, [onDentureDataChange])

  return (
    <div className="space-y-6">
      {/* Denture Type */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Denture Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {DENTURE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onDentureDataChange({ 
                dentureType: type.id as DentureType,
                // Reset selections when changing type
                arch: null,
                missingTeeth: [],
                claspDesign: null,
                implantPositions: [],
              })}
              className={cn(
                "p-4 rounded-xl border transition-all text-center",
                dentureData.dentureType === type.id
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20",
                type.id === 'obturator' && "col-span-2"
              )}
            >
              <p className={cn(
                "font-medium text-sm mb-1",
                dentureData.dentureType === type.id ? "text-primary" : "text-white"
              )}>
                {type.label}
              </p>
              <p className="text-[10px] text-white/50">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Full Denture: Arch Selection */}
      {dentureData.dentureType === 'full' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Select Arch</h3>
          <div className="space-y-2">
            {ARCH_OPTIONS.map((arch) => (
              <button
                key={arch.id}
                onClick={() => onDentureDataChange({ arch: arch.id as DentureArch })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                  dentureData.arch === arch.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium",
                    dentureData.arch === arch.id ? "text-primary" : "text-white"
                  )}>
                    {arch.label}
                  </p>
                  <p className="text-xs text-white/50">{arch.description}</p>
                </div>
                {dentureData.arch === arch.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Immediate Denture: Info + Arch Selection */}
      {dentureData.dentureType === 'immediate' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-400 font-medium mb-1">Immediate Denture</p>
              <p className="text-xs text-white/60">
                Fabricated before extraction. Patient receives denture immediately after surgery.
                Will require reline after healing (3-6 months).
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Select Arch</h3>
            <div className="space-y-2">
              {ARCH_OPTIONS.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => onDentureDataChange({ arch: arch.id as DentureArch })}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                    dentureData.arch === arch.id
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <div>
                    <p className={cn(
                      "font-medium",
                      dentureData.arch === arch.id ? "text-primary" : "text-white"
                    )}>
                      {arch.label}
                    </p>
                    <p className="text-xs text-white/50">{arch.description}</p>
                  </div>
                  {dentureData.arch === arch.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Overdenture: Implant Positions */}
      {dentureData.dentureType === 'overdenture' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
            <p className="text-sm text-primary font-medium mb-1">Implant-Retained Overdenture</p>
            <p className="text-xs text-white/60">
              Select the implant positions that will retain the denture.
              Typically 2-4 implants for mandibular, 4-6 for maxillary.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-3">Select Arch</h3>
            <div className="grid grid-cols-2 gap-3">
              {ARCH_OPTIONS.filter(a => a.id !== 'both').map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => onDentureDataChange({ arch: arch.id as DentureArch, implantPositions: [] })}
                  className={cn(
                    "p-4 rounded-xl border transition-all text-center",
                    dentureData.arch === arch.id
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <p className={cn(
                    "font-medium text-sm mb-1",
                    dentureData.arch === arch.id ? "text-primary" : "text-white"
                  )}>
                    {arch.label}
                  </p>
                  <p className="text-[10px] text-white/50">{arch.description}</p>
                </button>
              ))}
            </div>
          </div>

          {dentureData.arch && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-medium text-white mb-1">Select Implant Positions</h3>
              <p className="text-xs text-white/50 mb-4">
                Tap on positions where implants are/will be placed
              </p>

              <div className="rounded-2xl p-4 overflow-hidden">
                <div className="odontogram-overdenture-wrapper">
                  <Odontogram 
                    onChange={handleImplantOdontogramChange}
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

              {dentureData.implantPositions && dentureData.implantPositions.length > 0 && (
                <div className="mt-3 p-3 bg-primary/10 rounded-xl border border-primary/30">
                  <p className="text-xs text-primary font-medium">
                    {dentureData.implantPositions.length} implant position{dentureData.implantPositions.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {dentureData.implantPositions.sort().join(', ')}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Obturator */}
      {dentureData.dentureType === 'obturator' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-sm text-amber-400 font-medium mb-1">Obturator Prosthesis</p>
            <p className="text-xs text-white/60">
              Used to close palatal defects (post-maxillectomy, cleft palate). 
              Please provide defect details in the notes section.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Defect Location</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onDentureDataChange({ arch: 'upper' })}
                className={cn(
                  "p-4 rounded-xl border transition-all text-center",
                  dentureData.arch === 'upper'
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm mb-1",
                  dentureData.arch === 'upper' ? "text-primary" : "text-white"
                )}>
                  Maxillary
                </p>
                <p className="text-[10px] text-white/50">Hard/soft palate</p>
              </button>
              <button
                onClick={() => onDentureDataChange({ arch: 'lower' })}
                className={cn(
                  "p-4 rounded-xl border transition-all text-center",
                  dentureData.arch === 'lower'
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm mb-1",
                  dentureData.arch === 'lower' ? "text-primary" : "text-white"
                )}>
                  Mandibular
                </p>
                <p className="text-[10px] text-white/50">Floor of mouth</p>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Partial Denture: Missing Teeth + Clasp Design */}
      {dentureData.dentureType === 'partial' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-sm font-medium text-white mb-1">Select Missing Teeth</h3>
            <p className="text-xs text-white/50 mb-4">
              Tap on teeth that are MISSING and need to be replaced
            </p>
          </div>

          {/* Dental Chart */}
          <div className="rounded-2xl p-4 overflow-hidden">
            <div className="odontogram-denture-wrapper">
              <Odontogram 
                onChange={handleOdontogramChange}
                className="w-full"
                theme="dark"
                colors={{
                  selected: '#ef4444',
                  hover: '#7f1d1d',
                  default: '#3d5a7a',
                  stroke: '#5a7a9a',
                }}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#3d5a7a] border border-[#5a7a9a]" />
              <span className="text-white/60">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-white/60">Missing</span>
            </div>
          </div>

          {/* Clasp Design - show when teeth are selected */}
          {dentureData.missingTeeth && dentureData.missingTeeth.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-medium text-white mb-3">Clasp Design</h3>
              <div className="space-y-2">
                {CLASP_DESIGNS.map((clasp) => (
                  <button
                    key={clasp.id}
                    onClick={() => onDentureDataChange({ claspDesign: clasp.id as ClaspDesign })}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                      dentureData.claspDesign === clasp.id
                        ? "bg-selected border-primary/50"
                        : "bg-card border-border/50 hover:border-white/20"
                    )}
                  >
                    <div>
                      <p className={cn(
                        "font-medium text-sm",
                        dentureData.claspDesign === clasp.id ? "text-primary" : "text-white"
                      )}>
                        {clasp.label}
                      </p>
                      <p className="text-[10px] text-white/50">{clasp.description}</p>
                    </div>
                    {dentureData.claspDesign === clasp.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Summary */}
      {((dentureData.dentureType === 'full' && dentureData.arch) ||
        (dentureData.dentureType === 'immediate' && dentureData.arch) ||
        (dentureData.dentureType === 'partial' && dentureData.missingTeeth && dentureData.missingTeeth.length > 0) ||
        (dentureData.dentureType === 'overdenture' && dentureData.implantPositions && dentureData.implantPositions.length > 0) ||
        (dentureData.dentureType === 'obturator' && dentureData.arch)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {dentureData.dentureType === 'full' 
              ? `Full ${dentureData.arch === 'both' ? 'Upper & Lower' : (dentureData.arch ? dentureData.arch.charAt(0).toUpperCase() + dentureData.arch.slice(1) : '')} Denture`
              : dentureData.dentureType === 'immediate'
              ? `Immediate ${dentureData.arch === 'both' ? 'Upper & Lower' : (dentureData.arch ? dentureData.arch.charAt(0).toUpperCase() + dentureData.arch.slice(1) : '')} Denture`
              : dentureData.dentureType === 'obturator'
              ? `${dentureData.arch === 'upper' ? 'Maxillary' : 'Mandibular'} Obturator`
              : dentureData.dentureType === 'overdenture'
              ? `${dentureData.arch === 'upper' ? 'Maxillary' : 'Mandibular'} Overdenture`
              : `Partial Denture`
            }
          </p>
          {dentureData.dentureType === 'partial' && dentureData.missingTeeth && (
            <>
              <p className="text-xs text-white/60">
                {dentureData.missingTeeth.length} missing teeth: {dentureData.missingTeeth.sort().join(', ')}
              </p>
              {dentureData.claspDesign && (
                <p className="text-xs text-white/50 mt-1">
                  Clasp: {CLASP_DESIGNS.find(c => c.id === dentureData.claspDesign)?.label}
                </p>
              )}
            </>
          )}
          {dentureData.dentureType === 'overdenture' && dentureData.implantPositions && (
            <p className="text-xs text-white/60">
              {dentureData.implantPositions.length} implant positions: {dentureData.implantPositions.sort().join(', ')}
            </p>
          )}
          {dentureData.dentureType === 'obturator' && (
            <p className="text-xs text-white/60">
              Provide defect details and measurements in notes
            </p>
          )}
          {dentureData.dentureType === 'immediate' && (
            <p className="text-xs text-white/60">
              Reline will be required after 3-6 months healing
            </p>
          )}
        </motion.div>
      )}

      <style>{`
        .odontogram-denture-wrapper svg,
        .odontogram-overdenture-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        .odontogram-denture-wrapper .Odontogram__tooltip,
        .odontogram-denture-wrapper [class*="tooltip"],
        .odontogram-overdenture-wrapper .Odontogram__tooltip,
        .odontogram-overdenture-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        .odontogram-denture-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-denture-wrapper svg path:hover {
          fill: #7f1d1d;
        }
        
        .odontogram-denture-wrapper svg [aria-selected="true"] path,
        .odontogram-denture-wrapper svg g[aria-selected="true"] path {
          fill: #ef4444 !important;
          stroke: #fca5a5 !important;
        }
        
        .odontogram-overdenture-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-overdenture-wrapper svg path:hover {
          fill: #4a7096;
        }
        
        .odontogram-overdenture-wrapper svg [aria-selected="true"] path,
        .odontogram-overdenture-wrapper svg g[aria-selected="true"] path {
          fill: #5ebbbd !important;
          stroke: #7dd3d5 !important;
        }
        
        .odontogram-denture-wrapper svg text,
        .odontogram-overdenture-wrapper svg text {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
