import { motion } from "motion/react"
import { Check, Moon, Activity, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NightGuardData, NightGuardType, DentureArch } from "@/stores/orderStore"

interface NightGuardSelectorProps {
  nightGuardData: NightGuardData
  onNightGuardDataChange: (data: Partial<NightGuardData>) => void
}

const GUARD_TYPES = [
  { 
    id: 'soft', 
    label: 'Soft Guard', 
    description: 'Flexible EVA material',
    icon: Moon,
    indications: ['Light bruxism', 'Clenching', 'Initial therapy'],
    color: 'bg-blue-500/20 text-blue-400'
  },
  { 
    id: 'hard', 
    label: 'Hard Acrylic Splint', 
    description: 'Rigid acrylic material',
    icon: Shield,
    indications: ['Moderate-severe bruxism', 'TMJ therapy', 'Occlusal adjustment'],
    color: 'bg-amber-500/20 text-amber-400'
  },
  { 
    id: 'dual_laminate', 
    label: 'Dual Laminate', 
    description: 'Hard outer, soft inner',
    icon: Activity,
    indications: ['Comfort + durability', 'Heavy grinders', 'Sports protection'],
    color: 'bg-emerald-500/20 text-emerald-400'
  },
]

const ARCH_OPTIONS = [
  { id: 'upper', label: 'Upper Arch', description: 'Most common for night guards' },
  { id: 'lower', label: 'Lower Arch', description: 'Alternative for specific cases' },
]

const THICKNESS_OPTIONS = [
  { id: 'thin', label: 'Thin (1-2mm)', description: 'Minimal, for light bruxism' },
  { id: 'medium', label: 'Medium (2-3mm)', description: 'Standard, most common' },
  { id: 'thick', label: 'Thick (3-4mm)', description: 'Heavy bruxers, TMJ cases' },
]

export function NightGuardSelector({ nightGuardData, onNightGuardDataChange }: NightGuardSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Guard Type */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Guard Type</h3>
        <div className="space-y-3">
          {GUARD_TYPES.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                onClick={() => onNightGuardDataChange({ guardType: type.id as NightGuardType })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  nightGuardData.guardType === type.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", type.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-medium text-sm",
                        nightGuardData.guardType === type.id ? "text-primary" : "text-white"
                      )}>
                        {type.label}
                      </p>
                      {nightGuardData.guardType === type.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">{type.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {type.indications.map((ind, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-white/40">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Arch Selection */}
      {nightGuardData.guardType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Select Arch</h3>
          <div className="grid grid-cols-2 gap-3">
            {ARCH_OPTIONS.map((arch) => (
              <button
                key={arch.id}
                onClick={() => onNightGuardDataChange({ arch: arch.id as DentureArch })}
                className={cn(
                  "p-4 rounded-xl border transition-all text-center",
                  nightGuardData.arch === arch.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm mb-1",
                  nightGuardData.arch === arch.id ? "text-primary" : "text-white"
                )}>
                  {arch.label}
                </p>
                <p className="text-[10px] text-white/50">{arch.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Thickness Selection */}
      {nightGuardData.arch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Thickness</h3>
          <div className="space-y-2">
            {THICKNESS_OPTIONS.map((thickness) => (
              <button
                key={thickness.id}
                onClick={() => onNightGuardDataChange({ thickness: thickness.id as 'thin' | 'medium' | 'thick' })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  nightGuardData.thickness === thickness.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    nightGuardData.thickness === thickness.id ? "text-primary" : "text-white"
                  )}>
                    {thickness.label}
                  </p>
                  <p className="text-[10px] text-white/50">{thickness.description}</p>
                </div>
                {nightGuardData.thickness === thickness.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {nightGuardData.guardType && nightGuardData.arch && nightGuardData.thickness && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {GUARD_TYPES.find(t => t.id === nightGuardData.guardType)?.label}
          </p>
          <p className="text-xs text-white/60">
            {nightGuardData.arch === 'upper' ? 'Upper' : 'Lower'} Arch • {THICKNESS_OPTIONS.find(t => t.id === nightGuardData.thickness)?.label}
          </p>
        </motion.div>
      )}
    </div>
  )
}
