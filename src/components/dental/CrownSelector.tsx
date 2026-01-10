import { motion } from "motion/react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ToothChart } from "./ToothChart"
import type { CrownData, CrownSubtype, MarginType } from "@/stores/orderStore"

interface CrownSelectorProps {
  selectedTeeth: string[]
  onToothClick: (tooth: string) => void
  crownData: CrownData
  onCrownDataChange: (data: Partial<CrownData>) => void
}

const CROWN_SUBTYPES = [
  { id: 'full', label: 'Full Crown', description: 'Complete coverage restoration' },
  { id: 'three_quarter', label: '3/4 Crown', description: 'Preserves one tooth surface' },
]

const MARGIN_TYPES = [
  { id: 'shoulder', label: 'Shoulder', description: '90° shoulder with rounded internal angles' },
  { id: 'chamfer', label: 'Chamfer', description: 'Concave margin, most common' },
  { id: 'knife_edge', label: 'Knife Edge', description: 'Minimal reduction, feathered margin' },
  { id: 'feather_edge', label: 'Feather Edge', description: 'Very thin margin, conservative' },
]

export function CrownSelector({ 
  selectedTeeth, 
  onToothClick, 
  crownData, 
  onCrownDataChange 
}: CrownSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Crown Subtype */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Crown Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {CROWN_SUBTYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onCrownDataChange({ crownSubtype: type.id as CrownSubtype })}
              className={cn(
                "p-4 rounded-xl border transition-all text-center",
                crownData.crownSubtype === type.id
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <p className={cn(
                "font-medium text-sm mb-1",
                crownData.crownSubtype === type.id ? "text-primary" : "text-white"
              )}>
                {type.label}
              </p>
              <p className="text-[10px] text-white/50">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tooth Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-1">Select Teeth</h3>
        <p className="text-xs text-white/50 mb-4">
          Tap on teeth that need crowns
        </p>
        <ToothChart
          selectedTeeth={selectedTeeth}
          onToothClick={onToothClick}
        />
      </div>

      {/* Margin Type - show when teeth are selected */}
      {selectedTeeth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Margin Preparation</h3>
          <div className="space-y-2">
            {MARGIN_TYPES.map((margin) => (
              <button
                key={margin.id}
                onClick={() => onCrownDataChange({ marginType: margin.id as MarginType })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  crownData.marginType === margin.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    crownData.marginType === margin.id ? "text-primary" : "text-white"
                  )}>
                    {margin.label}
                  </p>
                  <p className="text-[10px] text-white/50">{margin.description}</p>
                </div>
                {crownData.marginType === margin.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {selectedTeeth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {selectedTeeth.length} {crownData.crownSubtype === 'three_quarter' ? '3/4' : 'Full'} Crown{selectedTeeth.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-white/60 mb-1">
            Teeth: {selectedTeeth.sort().join(', ')}
          </p>
          {crownData.marginType && (
            <p className="text-xs text-white/50">
              Margin: {MARGIN_TYPES.find(m => m.id === crownData.marginType)?.label}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
