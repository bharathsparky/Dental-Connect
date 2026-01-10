import { useState } from "react"
import { motion } from "motion/react"
import { Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BridgeData, BridgeType } from "@/stores/orderStore"

interface BridgeSelectorProps {
  bridgeData: BridgeData
  onBridgeTypeChange: (type: BridgeType) => void
  onRangeSelect: (start: string, end: string) => void
  onToggleAbutment: (tooth: string) => void
}

const BRIDGE_TYPES = [
  { id: 'conventional', label: 'Conventional', description: 'Abutments on both sides' },
  { id: 'cantilever', label: 'Cantilever', description: 'Abutment on one side only' },
  { id: 'maryland', label: 'Maryland', description: 'Wings bonded to adjacent teeth' },
]

// FDI notation teeth layout
const UPPER_RIGHT = ['18', '17', '16', '15', '14', '13', '12', '11']
const UPPER_LEFT = ['21', '22', '23', '24', '25', '26', '27', '28']
const LOWER_LEFT = ['31', '32', '33', '34', '35', '36', '37', '38']
const LOWER_RIGHT = ['48', '47', '46', '45', '44', '43', '42', '41']

export function BridgeSelector({ 
  bridgeData, 
  onBridgeTypeChange, 
  onRangeSelect,
  onToggleAbutment 
}: BridgeSelectorProps) {
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start')
  const [tempStart, setTempStart] = useState<string | null>(null)

  const handleToothClick = (tooth: string) => {
    if (selectionMode === 'start') {
      setTempStart(tooth)
      setSelectionMode('end')
    } else {
      if (tempStart) {
        // Validate same quadrant
        const startQuad = Math.floor(parseInt(tempStart) / 10)
        const endQuad = Math.floor(parseInt(tooth) / 10)
        
        if (startQuad === endQuad) {
          onRangeSelect(tempStart, tooth)
        }
      }
      setTempStart(null)
      setSelectionMode('start')
    }
  }

  const isInRange = (tooth: string) => {
    if (!bridgeData.startTooth || !bridgeData.endTooth) return false
    return bridgeData.abutments.includes(tooth) || bridgeData.pontics.includes(tooth)
  }

  const isAbutment = (tooth: string) => bridgeData.abutments.includes(tooth)
  const isPontic = (tooth: string) => bridgeData.pontics.includes(tooth)

  const renderTooth = (tooth: string) => {
    const inRange = isInRange(tooth)
    const abutment = isAbutment(tooth)
    const pontic = isPontic(tooth)
    const isStart = tooth === tempStart
    
    return (
      <button
        key={tooth}
        onClick={() => inRange ? onToggleAbutment(tooth) : handleToothClick(tooth)}
        className={cn(
          "w-8 h-10 rounded-lg text-xs font-medium transition-all relative",
          inRange 
            ? abutment 
              ? "bg-primary text-primary-foreground"
              : "bg-amber-500/80 text-white"
            : isStart
              ? "bg-primary/50 text-white ring-2 ring-primary"
              : "bg-card border border-border/50 text-white/70 hover:border-primary/50"
        )}
      >
        {tooth}
        {abutment && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <span className="text-[8px] text-primary font-bold">A</span>
          </div>
        )}
        {pontic && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
            <span className="text-[8px] text-amber-900 font-bold">P</span>
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bridge Type Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Bridge Type</h3>
        <div className="space-y-2">
          {BRIDGE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onBridgeTypeChange(type.id as BridgeType)}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                bridgeData.bridgeType === type.id
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <div>
                <p className={cn(
                  "font-medium text-sm",
                  bridgeData.bridgeType === type.id ? "text-primary" : "text-white"
                )}>
                  {type.label}
                </p>
                <p className="text-xs text-white/50">{type.description}</p>
              </div>
              {bridgeData.bridgeType === type.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Range Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Select Bridge Span</h3>
          {tempStart && (
            <span className="text-xs text-primary">
              Start: {tempStart} → Select end tooth
            </span>
          )}
        </div>
        
        <p className="text-xs text-white/50 mb-4">
          {selectionMode === 'start' 
            ? 'Tap the first tooth of the bridge span'
            : 'Tap the last tooth of the bridge span'}
        </p>

        {/* Dental Chart */}
        <div className="bg-card/50 rounded-2xl p-4 space-y-4">
          {/* Upper Arch */}
          <div className="text-center">
            <p className="text-[10px] text-white/40 mb-2">UPPER</p>
            <div className="flex justify-center gap-1">
              {UPPER_RIGHT.map(renderTooth)}
              <div className="w-2" />
              {UPPER_LEFT.map(renderTooth)}
            </div>
          </div>
          
          {/* Lower Arch */}
          <div className="text-center">
            <div className="flex justify-center gap-1">
              {LOWER_LEFT.map(renderTooth)}
              <div className="w-2" />
              {LOWER_RIGHT.map(renderTooth)}
            </div>
            <p className="text-[10px] text-white/40 mt-2">LOWER</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-white/60">Abutment (A)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-white/60">Pontic (P)</span>
        </div>
      </div>

      {/* Summary */}
      {bridgeData.units > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-primary">
              {bridgeData.units}-Unit Bridge
            </p>
            <p className="text-xs text-white/50">
              {bridgeData.startTooth} <ArrowRight className="w-3 h-3 inline" /> {bridgeData.endTooth}
            </p>
          </div>
          <div className="flex gap-4 text-xs text-white/60">
            <span>Abutments: {bridgeData.abutments.join(', ')}</span>
            {bridgeData.pontics.length > 0 && (
              <span>Pontics: {bridgeData.pontics.join(', ')}</span>
            )}
          </div>
          <p className="text-xs text-white/40 mt-2">
            Tap on teeth in the span to toggle between abutment/pontic
          </p>
        </motion.div>
      )}
    </div>
  )
}
