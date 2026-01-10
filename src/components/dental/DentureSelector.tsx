import { motion } from "motion/react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DentureData, DentureType, DentureArch } from "@/stores/orderStore"

interface DentureSelectorProps {
  dentureData: DentureData
  onDentureDataChange: (data: Partial<DentureData>) => void
}

const DENTURE_TYPES = [
  { id: 'full', label: 'Full Denture', description: 'Complete denture for edentulous arch' },
  { id: 'partial', label: 'Partial Denture', description: 'Removable partial for some missing teeth' },
]

const ARCH_OPTIONS = [
  { id: 'upper', label: 'Upper Arch', description: 'Maxillary denture' },
  { id: 'lower', label: 'Lower Arch', description: 'Mandibular denture' },
  { id: 'both', label: 'Both Arches', description: 'Full set - upper & lower' },
]

// Teeth for partial denture selection
const UPPER_TEETH = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28']
const LOWER_TEETH = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']

export function DentureSelector({ dentureData, onDentureDataChange }: DentureSelectorProps) {
  const toggleMissingTooth = (tooth: string) => {
    const current = dentureData.missingTeeth || []
    const updated = current.includes(tooth)
      ? current.filter(t => t !== tooth)
      : [...current, tooth]
    onDentureDataChange({ missingTeeth: updated })
  }

  const renderTooth = (tooth: string) => {
    const isMissing = dentureData.missingTeeth?.includes(tooth)
    
    return (
      <button
        key={tooth}
        onClick={() => toggleMissingTooth(tooth)}
        className={cn(
          "w-7 h-9 rounded-lg text-[10px] font-medium transition-all",
          isMissing
            ? "bg-red-500/80 text-white"
            : "bg-card border border-border/50 text-white/50 hover:border-red-500/50 hover:text-white/70"
        )}
      >
        {tooth}
      </button>
    )
  }

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
                // Reset arch selection when changing type
                arch: null,
                missingTeeth: []
              })}
              className={cn(
                "p-4 rounded-xl border transition-all text-center",
                dentureData.dentureType === type.id
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
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

      {/* Partial Denture: Missing Teeth Selection */}
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
          <div className="bg-card/50 rounded-2xl p-4 space-y-4">
            {/* Upper Arch */}
            <div className="text-center">
              <p className="text-[10px] text-white/40 mb-2">UPPER</p>
              <div className="flex justify-center gap-0.5 flex-wrap">
                {UPPER_TEETH.slice(0, 8).map(renderTooth)}
                <div className="w-1" />
                {UPPER_TEETH.slice(8).map(renderTooth)}
              </div>
            </div>
            
            {/* Lower Arch */}
            <div className="text-center">
              <div className="flex justify-center gap-0.5 flex-wrap">
                {LOWER_TEETH.slice(0, 8).map(renderTooth)}
                <div className="w-1" />
                {LOWER_TEETH.slice(8).map(renderTooth)}
              </div>
              <p className="text-[10px] text-white/40 mt-2">LOWER</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-card border border-border/50" />
              <span className="text-white/60">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-white/60">Missing</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {((dentureData.dentureType === 'full' && dentureData.arch) ||
        (dentureData.dentureType === 'partial' && dentureData.missingTeeth && dentureData.missingTeeth.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {dentureData.dentureType === 'full' 
              ? `Full ${dentureData.arch === 'both' ? 'Upper & Lower' : (dentureData.arch ? dentureData.arch.charAt(0).toUpperCase() + dentureData.arch.slice(1) : '')} Denture`
              : `Partial Denture`
            }
          </p>
          {dentureData.dentureType === 'partial' && dentureData.missingTeeth && (
            <p className="text-xs text-white/60">
              {dentureData.missingTeeth.length} missing teeth: {dentureData.missingTeeth.sort().join(', ')}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
