import { motion } from "motion/react"
import { Check, Eye, Link2, Sparkles, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RetainerData, RetainerType, DentureArch, WireType, RetainerSpan } from "@/stores/orderStore"

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

const WIRE_TYPES = [
  { id: 'round', label: 'Round Wire', description: '0.032" stainless steel', size: '0.032"' },
  { id: 'braided', label: 'Braided/Twist-Flex', description: 'Multi-strand, flexible', size: '0.0175" x 3' },
  { id: 'flat', label: 'Flat Wire', description: 'Low profile, thin', size: '0.010" x 0.028"' },
  { id: 'fiber', label: 'Fiber Reinforced', description: 'Aesthetic, metal-free', size: 'Composite' },
]

const RETAINER_SPANS = [
  { id: '3_3', label: 'Canine to Canine (3-3)', description: 'Standard 6 anterior teeth' },
  { id: '4_4', label: 'Premolar to Premolar (4-4)', description: 'Extended 8 teeth span' },
  { id: '5_5', label: 'Second Premolar (5-5)', description: '10 teeth for severe crowding' },
  { id: '6_6', label: 'First Molar (6-6)', description: 'Full arch retention' },
]

const HAWLEY_CLASPS = [
  { id: 'adams', label: 'Adams Clasp', description: 'Most retentive, on molars' },
  { id: 'ball', label: 'Ball Clasp', description: 'Simple, interproximal' },
  { id: 'c_clasp', label: 'C-Clasp', description: 'Circumferential, simple' },
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
                onClick={() => onRetainerDataChange({ 
                  retainerType: type.id as RetainerType,
                  // Reset type-specific fields
                  wireType: null,
                  span: null,
                  claspType: null,
                })}
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

      {/* Fixed Retainer: Wire Type & Span */}
      {retainerData.retainerType === 'fixed_bonded' && retainerData.arch && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-medium text-white mb-3">Wire Type</h3>
            <div className="space-y-2">
              {WIRE_TYPES.map((wire) => (
                <button
                  key={wire.id}
                  onClick={() => onRetainerDataChange({ wireType: wire.id as WireType })}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                    retainerData.wireType === wire.id
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      retainerData.wireType === wire.id ? "text-primary" : "text-white"
                    )}>
                      {wire.label}
                    </p>
                    <p className="text-[10px] text-white/50">{wire.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {wire.size}
                    </span>
                    {retainerData.wireType === wire.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-medium text-white mb-3">Retention Span</h3>
            <div className="space-y-2">
              {RETAINER_SPANS.map((span) => (
                <button
                  key={span.id}
                  onClick={() => onRetainerDataChange({ span: span.id as RetainerSpan })}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                    retainerData.span === span.id
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      retainerData.span === span.id ? "text-primary" : "text-white"
                    )}>
                      {span.label}
                    </p>
                    <p className="text-[10px] text-white/50">{span.description}</p>
                  </div>
                  {retainerData.span === span.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-primary/10 border border-primary/30 rounded-xl flex gap-2"
          >
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/60">
              <span className="text-primary font-medium">Fixed retainer</span> requires good oral hygiene. 
              Consider providing patient with floss threaders or superfloss for cleaning.
            </p>
          </motion.div>
        </>
      )}

      {/* Hawley: Clasp Type */}
      {retainerData.retainerType === 'hawley' && retainerData.arch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Clasp Type</h3>
          <div className="space-y-2">
            {HAWLEY_CLASPS.map((clasp) => (
              <button
                key={clasp.id}
                onClick={() => onRetainerDataChange({ claspType: clasp.id })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  retainerData.claspType === clasp.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    retainerData.claspType === clasp.id ? "text-primary" : "text-white"
                  )}>
                    {clasp.label}
                  </p>
                  <p className="text-[10px] text-white/50">{clasp.description}</p>
                </div>
                {retainerData.claspType === clasp.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Essix Info */}
      {retainerData.retainerType === 'essix' && retainerData.arch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex gap-2"
        >
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/60">
            <span className="text-cyan-400 font-medium">Essix retainers</span> are vacuum-formed over the model. 
            They're nearly invisible but less durable than Hawley retainers. Typically need replacement every 1-2 years.
          </p>
        </motion.div>
      )}

      {/* Summary */}
      {retainerData.retainerType && retainerData.arch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-2">
            {RETAINER_TYPES.find(t => t.id === retainerData.retainerType)?.label}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-white/50">Arch:</span>
              <span className="text-white ml-1">
                {retainerData.arch === 'both' ? 'Upper & Lower' : retainerData.arch === 'upper' ? 'Upper' : 'Lower'}
              </span>
            </div>
            {retainerData.wireType && (
              <div>
                <span className="text-white/50">Wire:</span>
                <span className="text-white ml-1">{WIRE_TYPES.find(w => w.id === retainerData.wireType)?.label}</span>
              </div>
            )}
            {retainerData.span && (
              <div>
                <span className="text-white/50">Span:</span>
                <span className="text-white ml-1">{retainerData.span?.replace('_', '-')}</span>
              </div>
            )}
            {retainerData.claspType && (
              <div>
                <span className="text-white/50">Clasp:</span>
                <span className="text-white ml-1 capitalize">{retainerData.claspType}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
