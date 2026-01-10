import { useState } from "react"
import { motion } from "motion/react"
import { Check, ArrowRight, RotateCcw } from "lucide-react"
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

// Get all teeth in a range (same quadrant)
function getTeethInRange(start: string, end: string): string[] {
  const startNum = parseInt(start)
  const endNum = parseInt(end)
  
  const startQuadrant = Math.floor(startNum / 10)
  const endQuadrant = Math.floor(endNum / 10)
  
  if (startQuadrant !== endQuadrant) return []
  
  const teeth: string[] = []
  const startTooth = startNum % 10
  const endTooth = endNum % 10
  
  const minTooth = Math.min(startTooth, endTooth)
  const maxTooth = Math.max(startTooth, endTooth)
  
  for (let i = minTooth; i <= maxTooth; i++) {
    teeth.push(`${startQuadrant}${i}`)
  }
  
  return teeth
}

export function BridgeSelector({ 
  bridgeData, 
  onBridgeTypeChange, 
  onRangeSelect,
  onToggleAbutment 
}: BridgeSelectorProps) {
  const [selectionStep, setSelectionStep] = useState<'start' | 'end' | 'adjust'>(
    bridgeData.units > 0 ? 'adjust' : 'start'
  )
  const [tempStart, setTempStart] = useState<string | null>(bridgeData.startTooth)

  const handleToothClick = (tooth: string) => {
    if (selectionStep === 'start') {
      setTempStart(tooth)
      setSelectionStep('end')
    } else if (selectionStep === 'end' && tempStart) {
      // Validate same quadrant
      const startQuad = Math.floor(parseInt(tempStart) / 10)
      const endQuad = Math.floor(parseInt(tooth) / 10)
      
      if (startQuad === endQuad) {
        const teethInRange = getTeethInRange(tempStart, tooth)
        if (teethInRange.length >= 3) {
          onRangeSelect(tempStart, tooth)
          setSelectionStep('adjust')
        } else {
          // Not enough teeth for a bridge, reset
          setTempStart(tooth)
        }
      } else {
        // Different quadrant - restart with this tooth
        setTempStart(tooth)
      }
    } else if (selectionStep === 'adjust') {
      // In adjust mode, toggle between abutment and pontic
      const allBridgeTeeth = [...bridgeData.abutments, ...bridgeData.pontics]
      if (allBridgeTeeth.includes(tooth)) {
        onToggleAbutment(tooth)
      }
    }
  }

  const resetSelection = () => {
    setTempStart(null)
    setSelectionStep('start')
    // Parent should handle resetting bridgeData
    onRangeSelect('', '') // Signal reset
  }

  const isInBridgeRange = (tooth: string) => {
    return bridgeData.abutments.includes(tooth) || bridgeData.pontics.includes(tooth)
  }

  const isAbutment = (tooth: string) => bridgeData.abutments.includes(tooth)
  const isPontic = (tooth: string) => bridgeData.pontics.includes(tooth)
  const isStartSelection = (tooth: string) => tooth === tempStart && selectionStep === 'end'

  const getInstructionText = () => {
    switch (selectionStep) {
      case 'start':
        return 'Tap the FIRST tooth of the bridge span'
      case 'end':
        return `Start: ${tempStart} → Now tap the LAST tooth (min 3 teeth)`
      case 'adjust':
        return 'Tap teeth in the bridge to toggle Abutment ↔ Pontic'
    }
  }

  const renderTooth = (tooth: string, isUpper: boolean) => {
    const inRange = isInBridgeRange(tooth)
    const abutment = isAbutment(tooth)
    const pontic = isPontic(tooth)
    const isStart = isStartSelection(tooth)
    
    // Tooth shape path - more realistic tooth outline
    const toothPath = isUpper
      ? "M4 0 L20 0 Q24 4 24 12 L22 28 Q20 32 12 32 Q4 32 2 28 L0 12 Q0 4 4 0"
      : "M4 32 L20 32 Q24 28 24 20 L22 4 Q20 0 12 0 Q4 0 2 4 L0 20 Q0 28 4 32"
    
    return (
      <button
        key={tooth}
        onClick={() => handleToothClick(tooth)}
        className="relative group focus:outline-none"
        title={tooth}
      >
        <svg 
          width="28" 
          height="36" 
          viewBox="0 0 24 32" 
          className="transition-all duration-200"
        >
          <path
            d={toothPath}
            className={cn(
              "transition-all duration-200",
              inRange
                ? abutment 
                  ? "fill-primary stroke-primary/80"
                  : "fill-amber-500 stroke-amber-400"
                : isStart
                  ? "fill-primary/60 stroke-primary"
                  : "fill-slate-700 stroke-slate-500 group-hover:fill-slate-600"
            )}
            strokeWidth="1.5"
          />
        </svg>
        
        {/* Tooth number */}
        <span className={cn(
          "absolute inset-0 flex items-center justify-center text-[9px] font-medium pointer-events-none",
          inRange ? "text-white" : isStart ? "text-white" : "text-white/60"
        )}>
          {tooth.slice(-1)}
        </span>
        
        {/* Abutment/Pontic indicator */}
        {abutment && (
          <div className="absolute -top-1 -right-0.5 w-3.5 h-3.5 bg-primary-foreground rounded-full flex items-center justify-center shadow-sm">
            <span className="text-[7px] text-primary font-bold">A</span>
          </div>
        )}
        {pontic && (
          <div className="absolute -top-1 -right-0.5 w-3.5 h-3.5 bg-amber-100 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-[7px] text-amber-700 font-bold">P</span>
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

      {/* Bridge Span Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Select Bridge Span</h3>
          {(tempStart || bridgeData.units > 0) && (
            <button 
              onClick={resetSelection}
              className="text-xs text-primary flex items-center gap-1 hover:text-primary/80"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        
        <div className={cn(
          "text-xs mb-4 px-3 py-2 rounded-lg",
          selectionStep === 'adjust' ? "bg-primary/10 text-primary" : "bg-white/5 text-white/60"
        )}>
          {getInstructionText()}
        </div>

        {/* Dental Chart */}
        <div className="bg-card/50 rounded-2xl p-4 border border-border/30">
          {/* Upper Arch */}
          <div className="text-center mb-4">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Upper Arch</p>
            <div className="flex justify-center items-end gap-0.5">
              <div className="flex gap-0.5">
                {UPPER_RIGHT.map(tooth => renderTooth(tooth, true))}
              </div>
              <div className="w-3 h-8 border-l border-r border-white/10 mx-1" />
              <div className="flex gap-0.5">
                {UPPER_LEFT.map(tooth => renderTooth(tooth, true))}
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-white/10 my-4" />
          
          {/* Lower Arch */}
          <div className="text-center">
            <div className="flex justify-center items-start gap-0.5">
              <div className="flex gap-0.5">
                {LOWER_LEFT.map(tooth => renderTooth(tooth, false))}
              </div>
              <div className="w-3 h-8 border-l border-r border-white/10 mx-1" />
              <div className="flex gap-0.5">
                {LOWER_RIGHT.map(tooth => renderTooth(tooth, false))}
              </div>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-3">Lower Arch</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-5 rounded bg-primary" />
            <span className="text-white/60">Abutment (A)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-5 rounded bg-amber-500" />
            <span className="text-white/60">Pontic (P)</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      {bridgeData.units >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-primary">
              {bridgeData.units}-Unit Bridge
            </p>
            <p className="text-xs text-white/50 flex items-center gap-1">
              {bridgeData.startTooth} <ArrowRight className="w-3 h-3" /> {bridgeData.endTooth}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/20 rounded-lg p-3">
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Abutments</p>
              <p className="font-medium text-primary text-sm">
                {bridgeData.abutments.length > 0 ? bridgeData.abutments.sort().join(', ') : '-'}
              </p>
            </div>
            <div className="bg-amber-500/20 rounded-lg p-3">
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Pontics</p>
              <p className="font-medium text-amber-400 text-sm">
                {bridgeData.pontics.length > 0 ? bridgeData.pontics.sort().join(', ') : '-'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
