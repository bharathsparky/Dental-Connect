import { motion } from "motion/react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ImplantData } from "@/stores/orderStore"

interface ImplantSelectorProps {
  implantData: ImplantData
  onImplantDataChange: (data: Partial<ImplantData>) => void
  onTogglePosition: (position: string) => void
}

const IMPLANT_SYSTEMS = [
  { id: 'straumann', label: 'Straumann', description: 'BLT, BLX, TL' },
  { id: 'nobel', label: 'Nobel Biocare', description: 'NobelActive, NobelParallel' },
  { id: 'zimmer', label: 'Zimmer Biomet', description: 'Tapered Screw-Vent' },
  { id: 'megagen', label: 'MegaGen', description: 'AnyRidge, AnyOne' },
  { id: 'osstem', label: 'Osstem', description: 'TS, SS, MS' },
  { id: 'other', label: 'Other', description: 'Specify in notes' },
]

const ABUTMENT_TYPES = [
  { id: 'stock', label: 'Stock Abutment' },
  { id: 'custom', label: 'Custom Abutment' },
  { id: 'screw_retained', label: 'Screw-Retained Crown' },
  { id: 'cement_retained', label: 'Cement-Retained Crown' },
]

// Teeth positions
const UPPER_TEETH = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28']
const LOWER_TEETH = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']

export function ImplantSelector({ 
  implantData, 
  onImplantDataChange,
  onTogglePosition 
}: ImplantSelectorProps) {
  const renderPosition = (position: string) => {
    const isSelected = implantData.positions?.includes(position)
    
    return (
      <button
        key={position}
        onClick={() => onTogglePosition(position)}
        className={cn(
          "w-7 h-9 rounded-lg text-[10px] font-medium transition-all relative",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border/50 text-white/50 hover:border-primary/50 hover:text-white/70"
        )}
      >
        {position}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="space-y-6">
      {/* Position Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-1">Select Implant Positions</h3>
        <p className="text-xs text-white/50 mb-4">
          Tap on positions where implants are placed
        </p>

        {/* Dental Chart */}
        <div className="bg-card/50 rounded-2xl p-4 space-y-4">
          {/* Upper Arch */}
          <div className="text-center">
            <p className="text-[10px] text-white/40 mb-2">UPPER</p>
            <div className="flex justify-center gap-0.5 flex-wrap">
              {UPPER_TEETH.slice(0, 8).map(renderPosition)}
              <div className="w-1" />
              {UPPER_TEETH.slice(8).map(renderPosition)}
            </div>
          </div>
          
          {/* Lower Arch */}
          <div className="text-center">
            <div className="flex justify-center gap-0.5 flex-wrap">
              {LOWER_TEETH.slice(0, 8).map(renderPosition)}
              <div className="w-1" />
              {LOWER_TEETH.slice(8).map(renderPosition)}
            </div>
            <p className="text-[10px] text-white/40 mt-2">LOWER</p>
          </div>
        </div>
      </div>

      {/* Implant System */}
      {implantData.positions && implantData.positions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Implant System</h3>
          <div className="grid grid-cols-2 gap-2">
            {IMPLANT_SYSTEMS.map((system) => (
              <button
                key={system.id}
                onClick={() => onImplantDataChange({ implantSystem: system.id })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-left",
                  implantData.implantSystem === system.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm",
                  implantData.implantSystem === system.id ? "text-primary" : "text-white"
                )}>
                  {system.label}
                </p>
                <p className="text-[10px] text-white/50">{system.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Abutment Type */}
      {implantData.implantSystem && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Restoration Type</h3>
          <div className="space-y-2">
            {ABUTMENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onImplantDataChange({ abutmentType: type.id })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  implantData.abutmentType === type.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-sm",
                  implantData.abutmentType === type.id ? "text-primary" : "text-white"
                )}>
                  {type.label}
                </p>
                {implantData.abutmentType === type.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {implantData.positions && implantData.positions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-1">
            {implantData.positions.length} Implant{implantData.positions.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-white/60 mb-2">
            Positions: {implantData.positions.sort().join(', ')}
          </p>
          {implantData.implantSystem && (
            <p className="text-xs text-white/50">
              System: {IMPLANT_SYSTEMS.find(s => s.id === implantData.implantSystem)?.label}
              {implantData.abutmentType && ` • ${ABUTMENT_TYPES.find(t => t.id === implantData.abutmentType)?.label}`}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
