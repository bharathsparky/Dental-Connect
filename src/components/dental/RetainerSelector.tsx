import { motion } from "motion/react"
import { Check, Eye, Link2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RetainerData, RetainerType, DentureArch } from "@/stores/orderStore"

interface RetainerSelectorProps {
  retainerData: RetainerData
  onRetainerDataChange: (data: Partial<RetainerData>) => void
}

const RETAINER_TYPES = [
  { 
    id: 'hawley', 
    label: 'Hawley Retainer', 
    description: 'Acrylic + wire, adjustable',
    icon: Sparkles,
    pros: ['Adjustable', 'Durable', 'Classic'],
    color: 'bg-rose-500/20 text-rose-400'
  },
  { 
    id: 'essix', 
    label: 'Essix (Clear)', 
    description: 'Vacuum-formed clear plastic',
    icon: Eye,
    pros: ['Invisible', 'Comfortable', 'Economical'],
    color: 'bg-cyan-500/20 text-cyan-400'
  },
  { 
    id: 'fixed_bonded', 
    label: 'Fixed/Bonded', 
    description: 'Permanent wire bonded lingual',
    icon: Link2,
    pros: ['No compliance', 'Invisible', 'Permanent'],
    color: 'bg-amber-500/20 text-amber-400'
  },
]

const ARCH_OPTIONS = [
  { id: 'upper', label: 'Upper Arch Only' },
  { id: 'lower', label: 'Lower Arch Only' },
  { id: 'both', label: 'Both Arches' },
]

export function RetainerSelector({ retainerData, onRetainerDataChange }: RetainerSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Retainer Type */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Retainer Type</h3>
        <div className="space-y-3">
          {RETAINER_TYPES.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                onClick={() => onRetainerDataChange({ retainerType: type.id as RetainerType })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  retainerData.retainerType === type.id
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
                        retainerData.retainerType === type.id ? "text-primary" : "text-white"
                      )}>
                        {type.label}
                      </p>
                      {retainerData.retainerType === type.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">{type.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {type.pros.map((pro, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-white/40">
                          {pro}
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
      {retainerData.retainerType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Select Arch</h3>
          <div className="space-y-2">
            {ARCH_OPTIONS.map((arch) => (
              <button
                key={arch.id}
                onClick={() => onRetainerDataChange({ arch: arch.id as DentureArch })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                  retainerData.arch === arch.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm",
                  retainerData.arch === arch.id ? "text-primary" : "text-white"
                )}>
                  {arch.label}
                </p>
                {retainerData.arch === arch.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {retainerData.retainerType && retainerData.arch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {RETAINER_TYPES.find(t => t.id === retainerData.retainerType)?.label}
          </p>
          <p className="text-xs text-white/60">
            {retainerData.arch === 'both' ? 'Upper & Lower Arches' : retainerData.arch === 'upper' ? 'Upper Arch' : 'Lower Arch'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
